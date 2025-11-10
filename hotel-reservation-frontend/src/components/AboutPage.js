import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

function AboutPage() {
  return (
    <Container className="mt-4">
      <h2>About Our Hotel</h2>
      <Row className="mt-4">
        <Col md={8}>
          <p className="lead">
            Welcome to our luxurious hotel where comfort meets elegance.
            Our hotel offers a wide range of amenities and services to make
            your stay memorable.
          </p>
          <ul className="list-unstyled">
            <li>24/7 Customer Support</li>
            <li>Free WiFi</li>
            <li>Free Parking</li>
            <li>Restaurant and Bar</li>
            <li>Spa and Wellness Center</li>
          </ul>
        </Col>
        <Col md={4}>
          <Image
            src="https://source.unsplash.com/800x600/?hotel,lobby"
            fluid
            rounded
          />
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;