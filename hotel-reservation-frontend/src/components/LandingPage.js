import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <Container>
        <Row className="align-items-center min-vh-100">
          <Col md={6}>
            <h1 className="display-4 mb-4">Welcome to Our Hotel</h1>
            <p className="lead mb-4">
              Experience luxury and comfort in our beautifully designed rooms.
              Book your stay today!
            </p>
            <Link to="/bookings" className="btn btn-primary btn-lg">
              Book Now
            </Link>
          </Col>
          <Col md={6}>
            <Image
              src="https://source.unsplash.com/1600x900/?hotel,room"
              fluid
              rounded
              className="landing-image"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;