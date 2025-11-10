import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

function BookingModal({ show, handleClose, roomId, onSuccess }) {
  const [formData, setFormData] = useState({
    userId: '',
    checkIn: '',
    checkOut: '',
    amount: 1000 // Default amount
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/reservations/book?userId=${formData.userId}&roomId=${roomId}&checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&amount=${formData.amount}`
      );
      toast.success('Booking successful!');
      onSuccess(response.data);
      handleClose();
    } catch (error) {
      toast.error('Booking failed: ' + (error.response?.data || error.message));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="number"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Check-in Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.checkIn}
              onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Check-out Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.checkOut}
              onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              disabled
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Confirm Booking
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default BookingModal;