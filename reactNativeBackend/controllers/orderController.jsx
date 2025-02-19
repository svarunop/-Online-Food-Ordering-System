const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.placeOrder = (req, res) => {
  const { user_id, restaurant_id, total_amount } = req.body;

  db.query(
    'INSERT INTO Orders (user_id, restaurant_id, total_amount) VALUES (?, ?, ?)',
    [user_id, restaurant_id, total_amount],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ order_id: results.insertId, message: 'Order placed successfully' });
    }
  );
};

exports.getOrderDetails = (req, res) => {
  const { order_id } = req.params;

  db.query(
    'SELECT * FROM Orders WHERE order_id = ?',
    [order_id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }
      if (results.length > 0) {
        res.send(results[0]);
      } else {
        res.status(404).send('Order not found');
      }
    }
  );
};
