const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.getMenuItems = (req, res) => {
  console.log('Fetching menu items');
  db.query(
    'SELECT * FROM Menu_Items',
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }
      if (results.length > 0) {
        console.log('Fetched menu items:', results);
        res.send(results);
      } else {
        console.log('No menu items found ');
        res.send([]); // Return an empty array if no menu items are found
      }
    }
  );
};

exports.updateProfile = async (req, res) => {
  console.log(req.user); // Log the req.user object

  const { username, password, phone_number } = req.body;
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(401).send('Unauthorized: No user found.');
  }

  let hashedPassword = password;
  if (password) {
    try {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Error during password hashing:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  db.query(
    'UPDATE users SET username=?, password=?, phone_number=? WHERE user_id=?',
    [username, hashedPassword, phone_number, userId],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }
      if (results.affectedRows > 0) {
        res.send({ success: true, message: 'Profile updated successfully' });
      } else {
        res.send({ success: false, message: 'No changes made or user not found' });
      }
    }
  );
};


exports.getOrders = (req, res) => {
  const { restaurant_id } = req.params;

  db.query(
    'SELECT order_id, status, user_id AS customer_id FROM Orders WHERE restaurant_id = ?',
    [restaurant_id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length > 0) {
        console.log('Fetched orders:', results);
        res.send(results);
      } else {
        console.log('No orders found for restaurant_id:', restaurant_id);
        res.status(404).send('No orders found for this restaurant');
      }
    }
  );
};



exports.getRestaurants = (req, res) => {
  db.query(
    'SELECT * FROM restaurants',
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }
      if (results.length > 0) {
        res.send(results);
      } else {
        console.log('No restaurants found ');
        res.send([]); 
      }
    }
  );
};
