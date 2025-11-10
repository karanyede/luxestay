package com.hotel.reservation;

import com.hotel.reservation.model.*;
import com.hotel.reservation.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;

    public DataInitializer(RoomRepository roomRepository, UserRepository userRepository, HotelRepository hotelRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("=== DataInitializer START ===");
        try {
            // Create hotels first
            Hotel hotel1 = hotelRepository.save(Hotel.builder()
                    .name("Grand Palace Hotel")
                    .address("123 Main Street, New York, NY")
                    .email("info@grandpalace.com")
                    .phone("+1-555-0123")
                    .rating(4.5)
                    .isActive(true)
                    .build());
            
            Hotel hotel2 = hotelRepository.save(Hotel.builder()
                    .name("Luxury Resort & Spa")
                    .address("456 Beach Avenue, Miami, FL")
                    .email("info@luxuryresort.com")
                    .phone("+1-555-0456")
                    .rating(4.8)
                    .isActive(true)
                    .build());
            
            // Create rooms with hotel references
            roomRepository.save(Room.builder().roomNumber("101").category("SINGLE").basePrice(new java.math.BigDecimal("1000")).capacity(1).hotel(hotel1).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("102").category("DOUBLE").basePrice(new java.math.BigDecimal("1500")).capacity(2).hotel(hotel1).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("103").category("SUITE").basePrice(new java.math.BigDecimal("2500")).capacity(3).hotel(hotel1).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("104").category("SINGLE").basePrice(new java.math.BigDecimal("1200")).capacity(1).hotel(hotel1).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("105").category("DOUBLE").basePrice(new java.math.BigDecimal("1700")).capacity(2).hotel(hotel1).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("201").category("SUITE").basePrice(new java.math.BigDecimal("3000")).capacity(4).hotel(hotel2).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("202").category("SINGLE").basePrice(new java.math.BigDecimal("1100")).capacity(1).hotel(hotel2).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("203").category("DOUBLE").basePrice(new java.math.BigDecimal("1600")).capacity(2).hotel(hotel2).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("204").category("SUITE").basePrice(new java.math.BigDecimal("3500")).capacity(4).hotel(hotel2).isActive(true).build());
            roomRepository.save(Room.builder().roomNumber("205").category("SINGLE").basePrice(new java.math.BigDecimal("1050")).capacity(1).hotel(hotel2).isActive(true).build());
            
            userRepository.save(User.builder()
                    .fullName("Alice Johnson")
                    .email("alice@example.com")
                    .phone("+1-555-0111")
                    .isActive(true)
                    .build());
            userRepository.save(User.builder()
                    .fullName("Bob Smith")
                    .email("bob@example.com")
                    .phone("+1-555-0222")
                    .isActive(true)
                    .build());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error while initializing sample data: " + e.getMessage());
        }
        System.out.println("=== DataInitializer END ===");
    }
}