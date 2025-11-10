import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RoomList from './RoomList';
import UserReservations from './UserReservations';
import BookingModal from './BookingModal';

function BookingPage() {
  const [userId, setUserId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleBooking = (roomId) => {
    setSelectedRoomId(roomId);
    setShowModal(true);
  };

  const handleBookingSuccess = () => {
    setShowModal(false);
    setSelectedRoomId(null);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <RoomList onSelectRoom={handleBooking} />
        </Col>
        <Col md={4}>
          <div className="user-section mb-4">
            <h3>Enter User ID:</h3>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="form-control"
              placeholder="Enter your user ID"
            />
          </div>
          {userId && <UserReservations userId={userId} />}
        </Col>
      </Row>
      <BookingModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        roomId={selectedRoomId}
        onSuccess={handleBookingSuccess}
      />
    </Container>
  );
}

export default BookingPage;