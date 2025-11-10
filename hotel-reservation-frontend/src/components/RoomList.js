import React, { useEffect, useState } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';

function RoomList({ onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/rooms/available')
      .then(response => response.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch rooms: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center">Loading rooms...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">Available Rooms</h2>
      <ListGroup>
        {rooms.map(room => (
          <ListGroup.Item key={room.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Room #{room.number}</Card.Title>
                <Card.Text>
                  <strong>Category:</strong> {room.category}<br />
                  <strong>Price:</strong> ₹{room.price}/night
                </Card.Text>
                <Button 
                  variant="primary" 
                  onClick={() => onSelectRoom(room.id)}
                  className="float-end"
                >
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
       </ListGroup>

      </div>
      )
}

export default RoomList;