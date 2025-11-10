package com.hotel.reservation.controller;

import com.hotel.reservation.model.Hotel;
import com.hotel.reservation.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class HotelController {

    private final HotelService hotelService;

    /**
     * Get all active hotels
     */
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllActiveHotels();
        return ResponseEntity.ok(hotels);
    }

    /**
     * Get hotel by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelService.getHotelById(id)
                .map(hotel -> ResponseEntity.ok(hotel))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search hotels by location
     */
    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String name) {
        
        List<Hotel> hotels;
        
        if (location != null && !location.trim().isEmpty()) {
            hotels = hotelService.getHotelsByLocation(location);
        } else if (name != null && !name.trim().isEmpty()) {
            hotels = hotelService.searchHotelsByName(name);
        } else {
            hotels = hotelService.getAllActiveHotels();
        }
        
        return ResponseEntity.ok(hotels);
    }

    /**
     * Get hotels by city
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Hotel>> getHotelsByCity(@PathVariable String city) {
        List<Hotel> hotels = hotelService.getHotelsByCity(city);
        return ResponseEntity.ok(hotels);
    }

    /**
     * Get hotels by rating range
     */
    @GetMapping("/rating")
    public ResponseEntity<List<Hotel>> getHotelsByRating(
            @RequestParam(defaultValue = "0") Double minRating,
            @RequestParam(defaultValue = "5") Double maxRating) {
        
        List<Hotel> hotels = hotelService.getHotelsByRatingRange(minRating, maxRating);
        return ResponseEntity.ok(hotels);
    }

    /**
     * Create new hotel (Admin only)
     */
    @PostMapping
    public ResponseEntity<Hotel> createHotel(@Valid @RequestBody Hotel hotel) {
        try {
            Hotel createdHotel = hotelService.createHotel(hotel);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHotel);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update hotel (Admin only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @Valid @RequestBody Hotel hotelDetails) {
        return hotelService.updateHotel(id, hotelDetails)
                .map(hotel -> ResponseEntity.ok(hotel))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete hotel (Admin only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        boolean deleted = hotelService.deleteHotel(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    /**
     * Get hotel statistics (Admin only)
     */
    @GetMapping("/stats")
    public ResponseEntity<HotelStatsResponse> getHotelStats() {
        long totalHotels = hotelService.getTotalActiveHotels();
        return ResponseEntity.ok(new HotelStatsResponse(totalHotels));
    }
    
    // Response DTO for stats
    private static class HotelStatsResponse {
        public final long totalActiveHotels;
        
        public HotelStatsResponse(long totalActiveHotels) {
            this.totalActiveHotels = totalActiveHotels;
        }
    }
}
