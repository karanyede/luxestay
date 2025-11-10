package com.hotel.reservation.controller;

import com.hotel.reservation.model.Room;
import com.hotel.reservation.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {

    private final RoomService roomService;

    /**
     * Simple test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("RoomController is working!");
    }

    /**
     * Get all active rooms
     */
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllActiveRooms();
        return ResponseEntity.ok(rooms);
    }

    /**
     * Get room by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(room -> ResponseEntity.ok(room))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get rooms by hotel ID
     */
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Room>> getRoomsByHotel(@PathVariable Long hotelId) {
        List<Room> rooms = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Search available rooms
     */
    @GetMapping("/search")
    public ResponseEntity<List<Room>> searchAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long hotelId) {
        
        if (checkIn == null || checkOut == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Room> rooms = roomService.findAvailableRoomsWithFilters(
                checkIn, checkOut, capacity, category, hotelId);
        
        return ResponseEntity.ok(rooms);
    }

    /**
     * Get rooms by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Room>> getRoomsByCategory(@PathVariable String category) {
        List<Room> rooms = roomService.getRoomsByCategory(category);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Get rooms by minimum capacity
     */
    @GetMapping("/capacity/{capacity}")
    public ResponseEntity<List<Room>> getRoomsByCapacity(@PathVariable Integer capacity) {
        List<Room> rooms = roomService.getRoomsByMinCapacity(capacity);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Get rooms by price range
     */
    @GetMapping("/price-range")
    public ResponseEntity<List<Room>> getRoomsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        
        List<Room> rooms = roomService.getRoomsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Calculate room pricing
     */
    @GetMapping("/{id}/pricing")
    public ResponseEntity<PricingResponse> calculateRoomPricing(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        
        return roomService.getRoomById(id)
                .map(room -> {
                    BigDecimal totalPrice = roomService.calculateDynamicPrice(room, checkIn, checkOut);
                    BigDecimal totalCost = roomService.calculateTotalCost(room, checkIn, checkOut);
                    
                    PricingResponse response = new PricingResponse(
                            room.getBasePrice(),
                            totalPrice,
                            totalCost,
                            totalCost.subtract(totalPrice), // taxes and fees
                            checkIn,
                            checkOut
                    );
                    
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check room availability
     */
    @GetMapping("/{id}/availability")
    public ResponseEntity<AvailabilityResponse> checkRoomAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        
        boolean available = roomService.isRoomAvailable(id, checkIn, checkOut);
        return ResponseEntity.ok(new AvailabilityResponse(available));
    }

    /**
     * Create new room (Admin only)
     */
    @PostMapping
    public ResponseEntity<Room> createRoom(@Valid @RequestBody Room room) {
        try {
            Room createdRoom = roomService.createRoom(room);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update room (Admin only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @Valid @RequestBody Room roomDetails) {
        return roomService.updateRoom(id, roomDetails)
                .map(room -> ResponseEntity.ok(room))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete room (Admin only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        boolean deleted = roomService.deleteRoom(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    /**
     * Get room statistics (Admin only)
     */
    @GetMapping("/stats")
    public ResponseEntity<RoomStatsResponse> getRoomStats() {
        long totalRooms = roomService.getTotalActiveRooms();
        return ResponseEntity.ok(new RoomStatsResponse(totalRooms));
    }

    // Response DTOs
    public static class PricingResponse {
        public final BigDecimal basePrice;
        public final BigDecimal totalRoomPrice;
        public final BigDecimal totalCost;
        public final BigDecimal taxesAndFees;
        public final LocalDate checkIn;
        public final LocalDate checkOut;

        public PricingResponse(BigDecimal basePrice, BigDecimal totalRoomPrice, 
                             BigDecimal totalCost, BigDecimal taxesAndFees,
                             LocalDate checkIn, LocalDate checkOut) {
            this.basePrice = basePrice;
            this.totalRoomPrice = totalRoomPrice;
            this.totalCost = totalCost;
            this.taxesAndFees = taxesAndFees;
            this.checkIn = checkIn;
            this.checkOut = checkOut;
        }
    }

    public static class AvailabilityResponse {
        public final boolean available;

        public AvailabilityResponse(boolean available) {
            this.available = available;
        }
    }

    public static class RoomStatsResponse {
        public final long totalActiveRooms;

        public RoomStatsResponse(long totalActiveRooms) {
            this.totalActiveRooms = totalActiveRooms;
        }
    }
}