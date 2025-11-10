package com.hotel.reservation.service;

import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;

    /**
     * Get all active rooms
     */
    public List<Room> getAllActiveRooms() {
        return roomRepository.findByIsActiveTrue();
    }

    /**
     * Get room by ID
     */
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findByIdAndIsActiveTrue(id);
    }

    /**
     * Get rooms by hotel ID
     */
    public List<Room> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelIdAndIsActiveTrue(hotelId);
    }

    /**
     * Search rooms by category
     */
    public List<Room> getRoomsByCategory(String category) {
        return roomRepository.findByCategoryAndIsActiveTrue(category);
    }

    /**
     * Search rooms by capacity
     */
    public List<Room> getRoomsByMinCapacity(Integer capacity) {
        return roomRepository.findByCapacityGreaterThanEqualAndIsActiveTrue(capacity);
    }

    /**
     * Search rooms by price range
     */
    public List<Room> getRoomsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return roomRepository.findByPriceRange(minPrice, maxPrice);
    }

    /**
     * Find available rooms for date range
     */
    public List<Room> findAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRoomsForDateRange(checkIn, checkOut);
    }

    /**
     * Find available rooms with filters
     */
    public List<Room> findAvailableRoomsWithFilters(
            LocalDate checkIn,
            LocalDate checkOut,
            Integer capacity,
            String category,
            Long hotelId) {
        return roomRepository.findAvailableRoomsWithFilters(checkIn, checkOut, capacity, category, hotelId);
    }

    /**
     * Calculate dynamic pricing for a room
     */
    public BigDecimal calculateDynamicPrice(Room room, LocalDate checkIn, LocalDate checkOut) {
        BigDecimal basePrice = room.getBasePrice();
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        
        if (nights <= 0) {
            return basePrice;
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        LocalDate currentDate = checkIn;

        while (currentDate.isBefore(checkOut)) {
            BigDecimal nightPrice = basePrice;

            // Weekend pricing (Friday, Saturday)
            if (currentDate.getDayOfWeek() == DayOfWeek.FRIDAY || 
                currentDate.getDayOfWeek() == DayOfWeek.SATURDAY) {
                nightPrice = nightPrice.multiply(BigDecimal.valueOf(1.3)); // +30%
            }

            // Holiday pricing (simplified - Christmas/New Year period)
            int month = currentDate.getMonthValue();
            int day = currentDate.getDayOfMonth();
            if ((month == 12 && day >= 20) || (month == 1 && day <= 5)) {
                nightPrice = nightPrice.multiply(BigDecimal.valueOf(1.5)); // +50%
            }

            // Summer peak season (June-August)
            if (month >= 6 && month <= 8) {
                nightPrice = nightPrice.multiply(BigDecimal.valueOf(1.2)); // +20%
            }

            // Premium category pricing
            if ("Suite".equalsIgnoreCase(room.getCategory()) || 
                "Presidential".equalsIgnoreCase(room.getCategory())) {
                nightPrice = nightPrice.multiply(BigDecimal.valueOf(1.1)); // +10%
            }

            totalPrice = totalPrice.add(nightPrice);
            currentDate = currentDate.plusDays(1);
        }

        return totalPrice.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate total cost including taxes and fees
     */
    public BigDecimal calculateTotalCost(Room room, LocalDate checkIn, LocalDate checkOut) {
        BigDecimal roomCost = calculateDynamicPrice(room, checkIn, checkOut);
        BigDecimal taxes = roomCost.multiply(BigDecimal.valueOf(0.12)); // 12% tax
        BigDecimal fees = BigDecimal.valueOf(25); // Fixed service fee
        
        return roomCost.add(taxes).add(fees).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Check if room is available for specific dates
     */
    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        List<Room> availableRooms = roomRepository.findAvailableRoomsForDateRange(checkIn, checkOut);
        return availableRooms.stream().anyMatch(room -> room.getId().equals(roomId));
    }

    /**
     * Create new room (Admin only)
     */
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    /**
     * Update room (Admin only)
     */
    public Optional<Room> updateRoom(Long id, Room roomDetails) {
        return roomRepository.findById(id)
                .map(room -> {
                    room.setRoomNumber(roomDetails.getRoomNumber());
                    room.setCategory(roomDetails.getCategory());
                    room.setCapacity(roomDetails.getCapacity());
                    room.setBasePrice(roomDetails.getBasePrice());
                    room.setDescription(roomDetails.getDescription());
                    room.setAmenities(roomDetails.getAmenities());
                    room.setImageUrl(roomDetails.getImageUrl());
                    room.setIsActive(roomDetails.getIsActive());
                    return roomRepository.save(room);
                });
    }

    /**
     * Soft delete room (Admin only)
     */
    public boolean deleteRoom(Long id) {
        return roomRepository.findById(id)
                .map(room -> {
                    room.setIsActive(false);
                    roomRepository.save(room);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Get room statistics
     */
    public long getTotalActiveRooms() {
        return roomRepository.findByIsActiveTrue().size();
    }

    /**
     * Get available room count for date range
     */
    public long getAvailableRoomCount(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRoomsForDateRange(checkIn, checkOut).size();
    }
}