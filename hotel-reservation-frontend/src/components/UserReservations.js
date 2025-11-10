// src/components/UserReservations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserReservations({ userId }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:8080/api/reservations/user/${userId}`)
      .then(response => {
        setReservations(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch reservations: ' + err.message);
        setLoading(false);
      });
  }, [userId]);

  if (!userId) return <p>Please select a user</p>;
  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-reservations">
      <h2>Your Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations found</p>
      ) : (
        <ul>
          {reservations.map(reservation => (
            <li key={reservation.id} className="reservation-item">
              <h3>Reservation #{reservation.id}</h3>
              <p>Room: {reservation.room.number}</p>
              <p>Check-in: {reservation.checkIn}</p>
              <p>Check-out: {reservation.checkOut}</p>
              <p>Status: {reservation.payment.status}</p>
              <p>Amount: ₹{reservation.payment.amount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserReservations;