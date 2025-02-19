// File: Notifications.js

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import moment from 'moment';

const Notifications = () => {
  const [message, setMessage] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [validityHours, setValidityHours] = useState('');

  const handleSendNotification = async () => {
    try {
      await axios.post('http://13.61.209.211/api/super-admin/send-promo-notification', {
        user_id: 1, // Replace with dynamic user_id
        message,
        discount_percentage: discountPercentage,
        validity_hours: validityHours,
      });
      setMessage('');
      setDiscountPercentage('');
      setValidityHours('');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Notifications</h2>
          <Form>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDiscountPercentage">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter discount percentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formValidityHours">
              <Form.Label>Validity (hours)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter validity in hours"
                value={validityHours}
                onChange={(e) => setValidityHours(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSendNotification}>
              Send Notification
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;