package com.hotel.reservation.service;

import com.hotel.reservation.model.Hotel;
import com.hotel.reservation.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class HotelService {

    private final HotelRepository hotelRepository;

    /**
     * Get all active hotels
     */
    public List<Hotel> getAllActiveHotels() {
        return hotelRepository.findByIsActiveTrue();
    }

    /**
     * Get hotel by ID
     */
    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findByIdAndIsActiveTrue(id);
    }

    /**
     * Search hotels by name
     */
    public List<Hotel> searchHotelsByName(String name) {
        return hotelRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name);
    }

    /**
     * Search hotels by location
     */
    public List<Hotel> searchHotelsByLocation(String location) {
        return hotelRepository.findByAddressContainingIgnoreCaseAndIsActiveTrue(location);
    }

    /**
     * Get hotels by location (alias for search)
     */
    public List<Hotel> getHotelsByLocation(String location) {
        return searchHotelsByLocation(location);
    }

    /**
     * Get hotels by city
     */
    public List<Hotel> getHotelsByCity(String city) {
        return hotelRepository.findByAddressContainingIgnoreCaseAndIsActiveTrue(city);
    }

    /**
     * Get hotels by rating range
     */
    public List<Hotel> getHotelsByRatingRange(Double minRating, Double maxRating) {
        return hotelRepository.findByRatingBetweenAndIsActiveTrue(minRating, maxRating);
    }

    /**
     * Get top-rated hotels
     */
    public List<Hotel> getTopRatedHotels() {
        return hotelRepository.findTopRatedHotels();
    }

    /**
     * Get hotels with minimum rating
     */
    public List<Hotel> getHotelsByMinRating(Double minRating) {
        return hotelRepository.findByMinRating(minRating);
    }

    /**
     * Create new hotel (Admin only)
     */
    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    /**
     * Update hotel (Admin only)
     */
    public Optional<Hotel> updateHotel(Long id, Hotel hotelDetails) {
        return hotelRepository.findById(id)
                .map(hotel -> {
                    hotel.setName(hotelDetails.getName());
                    hotel.setAddress(hotelDetails.getAddress());
                    hotel.setEmail(hotelDetails.getEmail());
                    hotel.setPhone(hotelDetails.getPhone());
                    hotel.setRating(hotelDetails.getRating());
                    hotel.setAmenities(hotelDetails.getAmenities());
                    hotel.setDescription(hotelDetails.getDescription());
                    hotel.setImageUrl(hotelDetails.getImageUrl());
                    hotel.setIsActive(hotelDetails.getIsActive());
                    return hotelRepository.save(hotel);
                });
    }

    /**
     * Soft delete hotel (Admin only)
     */
    public boolean deleteHotel(Long id) {
        return hotelRepository.findById(id)
                .map(hotel -> {
                    hotel.setIsActive(false);
                    hotelRepository.save(hotel);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Get hotel statistics
     */
    public long getTotalActiveHotels() {
        return hotelRepository.findByIsActiveTrue().size();
    }
}
