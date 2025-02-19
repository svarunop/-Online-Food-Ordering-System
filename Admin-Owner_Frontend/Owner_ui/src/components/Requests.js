import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:7000/api/super-admin/requests')
      .then(response => setRequests(response.data))
      .catch(error => console.error('Error fetching requests:', error));
  }, []);

  const handleApprove = async (resto_id) => {
    try {
      await axios.put(`http://localhost:7000/api/super-admin/approve-request/${resto_id}`);
      setRequests(requests.filter(request => request.resto_id !== resto_id));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (resto_id) => {
    try {
      await axios.put(`http://localhost:7000/api/super-admin/reject-request/${resto_id}`);
      setRequests(requests.filter(request => request.resto_id !== resto_id));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Registration Requests</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Restaurant ID</th>
                <th>Owner Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.resto_id}>
                  <td>{request.resto_id}</td>
                  <td>{request.owner_name}</td>
                  <td>{request.email}</td>
                  <td>
                    <Button variant="success" onClick={() => handleApprove(request.resto_id)}>
                      Approve
                    </Button>
                    <Button variant="danger" onClick={() => handleReject(request.resto_id)}>
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Requests;