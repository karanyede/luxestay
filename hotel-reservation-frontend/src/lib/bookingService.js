// Room availability and booking service with Supabase integration

import { supabase } from "./supabase";
import dayjs from "dayjs";

export class BookingService {
  // Check room availability for given date range
  static async checkAvailability(
    checkIn,
    checkOut,
    guests = 1,
    roomType = null
  ) {
    try {
      const { data: rooms, error: roomsError } = await supabase
        .from("rooms")
        .select(
          `
          *,
          hotels (
            id,
            name,
            address,
            rating
          )
        `
        )
        .gte("capacity", guests)
        .eq("is_active", true);

      if (roomsError) throw roomsError;

      // Filter by room type if specified
      let filteredRooms = rooms;
      if (roomType && roomType !== "all") {
        filteredRooms = rooms.filter(
          (room) => room.category.toLowerCase() === roomType.toLowerCase()
        );
      }

      // Check for existing reservations that overlap with the requested dates
      const { data: conflictingReservations, error: reservationsError } =
        await supabase
          .from("reservations")
          .select("room_id")
          .in(
            "room_id",
            filteredRooms.map((room) => room.id)
          )
          .neq("status", "cancelled")
          .or(
            `and(check_in_date.lte.${checkOut},check_out_date.gte.${checkIn})`
          );

      if (reservationsError) throw reservationsError;

      // Get IDs of rooms that are already booked
      const bookedRoomIds = new Set(
        conflictingReservations.map((res) => res.room_id)
      );

      // Filter out booked rooms
      const availableRooms = filteredRooms.filter(
        (room) => !bookedRoomIds.has(room.id)
      );

      // Calculate pricing for each available room
      const roomsWithPricing = availableRooms.map((room) => ({
        ...room,
        pricing: this.calculateDynamicPricing(room, checkIn, checkOut),
      }));

      return {
        success: true,
        data: roomsWithPricing,
        total: roomsWithPricing.length,
      };
    } catch (error) {
      console.error("Error checking availability:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Calculate dynamic pricing based on various factors
  static calculateDynamicPricing(room, checkIn, checkOut) {
    const basePrice = parseFloat(room.base_price);
    const checkInDate = dayjs(checkIn);
    const checkOutDate = dayjs(checkOut);
    const nights = checkOutDate.diff(checkInDate, "day");

    let totalPrice = 0;
    let priceBreakdown = [];

    for (let i = 0; i < nights; i++) {
      const currentDate = checkInDate.add(i, "day");
      let nightPrice = basePrice;
      let factors = [];

      // Weekend pricing (Friday, Saturday)
      if (currentDate.day() === 5 || currentDate.day() === 6) {
        nightPrice *= 1.3;
        factors.push("Weekend Rate (+30%)");
      }

      // Holiday pricing (simplified - you'd want a more sophisticated holiday detection)
      const month = currentDate.month();
      const date = currentDate.date();

      // Christmas/New Year period
      if ((month === 11 && date >= 20) || (month === 0 && date <= 5)) {
        nightPrice *= 1.5;
        factors.push("Holiday Rate (+50%)");
      }

      // Summer peak season (June-August)
      if (month >= 5 && month <= 7) {
        nightPrice *= 1.2;
        factors.push("Peak Season (+20%)");
      }

      // High demand rooms (based on category)
      if (room.category === "Suite" || room.category === "Presidential") {
        nightPrice *= 1.1;
        factors.push("Premium Category (+10%)");
      }

      // Round to nearest dollar
      nightPrice = Math.round(nightPrice);
      totalPrice += nightPrice;

      priceBreakdown.push({
        date: currentDate.format("YYYY-MM-DD"),
        basePrice: basePrice,
        finalPrice: nightPrice,
        factors: factors,
      });
    }

    return {
      basePrice,
      totalPrice: Math.round(totalPrice),
      pricePerNight: Math.round(totalPrice / nights),
      nights,
      breakdown: priceBreakdown,
      taxes: Math.round(totalPrice * 0.12), // 12% tax
      fees: 25, // Fixed service fee
      grandTotal: Math.round(totalPrice + totalPrice * 0.12 + 25),
    };
  }

  // Create a new booking/reservation
  static async createBooking(bookingData) {
    try {
      const {
        roomId,
        userId,
        checkIn,
        checkOut,
        guests,
        totalAmount,
        guestInfo,
        specialRequests,
      } = bookingData;

      // Generate a unique booking reference
      const bookingReference = this.generateBookingReference();

      // First, double-check availability
      const availabilityCheck = await this.checkRoomSpecificAvailability(
        roomId,
        checkIn,
        checkOut
      );
      if (!availabilityCheck.available) {
        return {
          success: false,
          error: "Room is no longer available for selected dates",
        };
      }

      // Create the reservation
      const { data: reservation, error: reservationError } = await supabase
        .from("reservations")
        .insert([
          {
            booking_reference: bookingReference,
            user_id: userId,
            room_id: roomId,
            check_in_date: checkIn,
            check_out_date: checkOut,
            guests: guests,
            total_amount: totalAmount,
            status: "confirmed",
            guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
            guest_email: guestInfo.email,
            guest_phone: guestInfo.phone,
            special_requests: specialRequests,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Create payment record (for tracking)
      const { error: paymentError } = await supabase.from("payments").insert([
        {
          reservation_id: reservation.id,
          amount: totalAmount,
          status: "pending",
          payment_method: "credit_card", // This would be determined by actual payment processing
          created_at: new Date().toISOString(),
        },
      ]);

      if (paymentError) {
        console.warn("Payment record creation failed:", paymentError);
        // Don't fail the booking if payment record fails
      }

      // Send confirmation email (you'd integrate with your email service)
      await this.sendBookingConfirmation(reservation, guestInfo);

      return {
        success: true,
        data: {
          reservation,
          bookingReference,
        },
      };
    } catch (error) {
      console.error("Error creating booking:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Check availability for a specific room
  static async checkRoomSpecificAvailability(roomId, checkIn, checkOut) {
    try {
      const { data: conflictingReservations, error } = await supabase
        .from("reservations")
        .select("id")
        .eq("room_id", roomId)
        .neq("status", "cancelled")
        .or(`and(check_in_date.lte.${checkOut},check_out_date.gte.${checkIn})`);

      if (error) throw error;

      return {
        available: conflictingReservations.length === 0,
        conflicts: conflictingReservations.length,
      };
    } catch (error) {
      console.error("Error checking specific room availability:", error);
      return {
        available: false,
        error: error.message,
      };
    }
  }

  // Generate unique booking reference
  static generateBookingReference() {
    const prefix = "LUX";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Get booking by reference
  static async getBookingByReference(bookingReference) {
    try {
      const { data: reservation, error } = await supabase
        .from("reservations")
        .select(
          `
          *,
          rooms (
            *,
            hotels (
              name,
              address,
              phone,
              email
            )
          ),
          payments (
            amount,
            status,
            payment_method,
            created_at
          )
        `
        )
        .eq("booking_reference", bookingReference)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: reservation,
      };
    } catch (error) {
      console.error("Error fetching booking:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get user's bookings
  static async getUserBookings(userId, limit = 10, offset = 0) {
    try {
      const { data: reservations, error } = await supabase
        .from("reservations")
        .select(
          `
          *,
          rooms (
            room_number,
            category,
            hotels (
              name,
              address
            )
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        success: true,
        data: reservations,
      };
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Cancel booking
  static async cancelBooking(bookingReference, userId) {
    try {
      // Get the booking first to verify ownership
      const { data: reservation, error: fetchError } = await supabase
        .from("reservations")
        .select("*")
        .eq("booking_reference", bookingReference)
        .eq("user_id", userId)
        .single();

      if (fetchError) throw fetchError;

      // Check if cancellation is allowed (e.g., not within 24 hours of check-in)
      const checkInDate = dayjs(reservation.check_in_date);
      const now = dayjs();
      const hoursUntilCheckIn = checkInDate.diff(now, "hour");

      if (hoursUntilCheckIn < 24) {
        return {
          success: false,
          error: "Cancellation not allowed within 24 hours of check-in",
        };
      }

      // Update reservation status
      const { error: updateError } = await supabase
        .from("reservations")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", reservation.id);

      if (updateError) throw updateError;

      // Update payment status
      await supabase
        .from("payments")
        .update({ status: "refunded" })
        .eq("reservation_id", reservation.id);

      // Send cancellation email
      await this.sendCancellationConfirmation(reservation);

      return {
        success: true,
        message: "Booking cancelled successfully",
      };
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Send booking confirmation email (placeholder)
  static async sendBookingConfirmation(reservation, guestInfo) {
    // In a real application, you would integrate with an email service like SendGrid, Mailgun, etc.
    console.log("Sending booking confirmation email to:", guestInfo.email);
    console.log("Booking Reference:", reservation.booking_reference);

    // For now, we'll just simulate the email sending
    return Promise.resolve();
  }

  // Send cancellation confirmation email (placeholder)
  static async sendCancellationConfirmation(reservation) {
    console.log(
      "Sending cancellation confirmation for:",
      reservation.booking_reference
    );
    return Promise.resolve();
  }

  // Get room details with current availability
  static async getRoomDetails(roomId) {
    try {
      const { data: room, error } = await supabase
        .from("rooms")
        .select(
          `
          *,
          hotels (
            id,
            name,
            address,
            phone,
            email,
            rating,
            amenities
          )
        `
        )
        .eq("id", roomId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: room,
      };
    } catch (error) {
      console.error("Error fetching room details:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get booking statistics for dashboard
  static async getBookingStats(userId) {
    try {
      const { data: stats, error } = await supabase
        .from("reservations")
        .select("status, total_amount, created_at")
        .eq("user_id", userId);

      if (error) throw error;

      const totalBookings = stats.length;
      const totalSpent = stats.reduce(
        (sum, booking) => sum + parseFloat(booking.total_amount),
        0
      );
      const upcomingBookings = stats.filter(
        (booking) =>
          dayjs(booking.check_in_date).isAfter(dayjs()) &&
          booking.status !== "cancelled"
      ).length;

      return {
        success: true,
        data: {
          totalBookings,
          totalSpent,
          upcomingBookings,
          recentBookings: stats.slice(0, 5),
        },
      };
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default BookingService;
