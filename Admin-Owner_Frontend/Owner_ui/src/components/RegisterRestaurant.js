import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Navbar, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const RegisterRestaurant = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [contact_number, setContactNumber] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:7000/api/super-admin/register-restaurant', {
        name,
        description,
        address,
        contact_number,
      });
      // Reset the form after submission
      setName('');
      setDescription('');
      setAddress('');
      setContactNumber('');
    } catch (error) {
      console.error('Error registering restaurant:', error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand className="mx-3">Super Admin Dashboard - Indian Accent</Navbar.Brand>
        <Nav className="ml-auto">
          <Button variant="outline-light" onClick={() => history.push('/super-admin/dashboard')}>
            Back to Dashboard
          </Button>
        </Nav>
      </Navbar>

      {/* Main Container */}
      <Container className="mt-5">
        <Row>
          <Col>
            <h2>Register New Restaurant</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Restaurant Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter restaurant name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter restaurant description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formAddress" className="mt-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter restaurant address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formContactNumber" className="mt-3">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter contact number"
                  value={contact_number}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4">
                Register Restaurant
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterRestaurant;
