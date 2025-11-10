import React, { useState } from "react";
import { Modal, Button } from "antd";
import BookingForm from "./BookingForm";

// Example: How to integrate BookingForm in RoomsPage or RoomList

const RoomCard = ({ room }) => {
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

  const handleBookNow = () => {
    setIsBookingModalVisible(true);
  };

  const handleBookingSuccess = (reservation) => {
    setIsBookingModalVisible(false);
    // Navigate to bookings page or show success message
    console.log("Booking successful:", reservation);
  };

  const handleBookingCancel = () => {
    setIsBookingModalVisible(false);
  };

  return (
    <div className="room-card">
      {/* Room details */}
      <h3>{room.roomNumber}</h3>
      <p>{room.category}</p>
      <p>₹{room.basePrice}/night</p>

      {/* Book Now Button */}
      <Button type="primary" onClick={handleBookNow}>
        Book Now
      </Button>

      {/* Booking Modal */}
      <Modal
        title="Book Your Room"
        open={isBookingModalVisible}
        onCancel={handleBookingCancel}
        footer={null}
        width={900}
        destroyOnHidden
      >
        <BookingForm
          room={room}
          onSuccess={handleBookingSuccess}
          onCancel={handleBookingCancel}
        />
      </Modal>
    </div>
  );
};

export default RoomCard;
