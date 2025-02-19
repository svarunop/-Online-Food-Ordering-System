import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ListGroup, Button, Table, Navbar, Nav, Form } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterRestaurant from '../components/RegisterRestaurant';

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const SuperAdminDashboard = () => {
  const { auth } = useAuth();
  const history = useHistory();
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [validityHours, setValidityHours] = useState('');
  const [promocode,setPromoCode] = useState('');

  useEffect(() => {
    axios.get('http://localhost:7000/api/super-admin/requests')
      .then(response => setRequests(response.data))
      .catch(error => console.error('Error fetching requests:', error));

    axios.get('http://localhost:7000/api/notifications')
      .then(response => setNotifications(response.data))
      .catch(error => console.error('Error fetching notifications:', error));
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

  
  //event code
  const sendNotification = async () => {
     const superAdminId = 3;

    if (!newNotification.trim() || !discountPercentage.trim() || !validityHours.trim() || !promocode.trim()){
      console.error("All fields are required.");
      return;
    } 

    const expiresInHours = parseInt(validityHours);
    if (Number.isNaN(expiresInHours)) {
        console.error("Invalid validityHours:", validityHours);
        return;
    }

    try {
        await axios.post("http://localhost:7000/api/super-admin/createOfferNotification", {
            super_admin_id: superAdminId, 
            offer_name: newNotification,
            discount: parseInt(discountPercentage),
            extra_minutes: parseInt(validityHours),
            promocode: promocode.trim() // ✅ Added promocode
            
        });

        setNotifications([{ 
            message: newNotification, 
            promocode: promocode.trim(), 
            timestamp: new Date().toLocaleString() 
        }, ...notifications]);

        setNewNotification("");
        setDiscountPercentage("");
        setValidityHours("");
        setPromoCode(""); 
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};



  return (
    <ErrorBoundary>
      <Router>
        <Switch>
          <Route path="/register-restaurant" component={RegisterRestaurant} />
          <Route path="/" render={() => (
            <>
              {/* Navbar */}
              <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand className="mx-3">Super Admin Dashboard - Indian Accent</Navbar.Brand>
                <Nav className="ml-auto">
                  <Button variant="success" onClick={() => history.push('/register-restaurant')}>
                    Add New Restaurant
                  </Button>
                </Nav>
              </Navbar>

              <Container fluid className="mt-4">
                <Row>
                  {/* Sidebar - Notifications */}
                  <Col md={3}>
                    <Card className="p-3">
                      <h5>Send Notification</h5>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Enter offer description"
                          value={newNotification}
                          onChange={(e) => setNewNotification(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="number"
                          placeholder="Enter discount percentage"
                          value={discountPercentage}
                          onChange={(e) => setDiscountPercentage(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="number"
                          placeholder="Enter validity in hours"
                          value={validityHours}
                          onChange={(e) => setValidityHours(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Enter promocode"
                          value={promocode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                      </Form.Group>
                      <Button variant="primary" className="mt-2" onClick={sendNotification}>
                        Send
                      </Button>

                      <hr />

                      <h5>Recent Notifications</h5>
                      <ListGroup>
                        {notifications.map((notification, index) => (
                          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                            <span>{notification.message}</span>
                            <small className="text-muted">{notification.timestamp}</small>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card>
                  </Col>

                  {/* Main Content - Registration Requests */}
                  <Col md={9}>
                    <Card className="p-3">
                      <h3>Registration Requests</h3>
                      <div className="table-responsive">
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
                                  <Button variant="success" onClick={() => handleApprove(request.resto_id)} className="mx-2">
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
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </>
          )} />
        </Switch>
      </Router>
    </ErrorBoundary>
  );
};

export default SuperAdminDashboard;
