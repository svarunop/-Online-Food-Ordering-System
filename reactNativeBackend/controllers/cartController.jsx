const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.addToCart = (req, res) => {
  const { user_id, restaurant_id, item_id, quantity } = req.body;

  db.query(
    'INSERT INTO Cart (user_id, restaurant_id, item_id, quantity) VALUES (?, ?, ?, ?)',
    [user_id, restaurant_id, item_id, quantity],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ cart_id: results.insertId, message: 'Item added to cart successfully' });
    }
  );
};

exports.updateCartItemQuantity = (req, res) => {
  const { item_id, user_id, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  const query = `UPDATE Cart SET quantity = ? WHERE user_id = ? AND item_id = ?`;

  db.query(query, [quantity, user_id, item_id], (err, result) => {
    if (err) {
      console.error("Error updating quantity:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.json({ message: "Quantity updated successfully" });
  });
};


exports.getCartItems = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT c.cart_id, c.user_id, c.restaurant_id, c.item_id, c.quantity, c.total_price,
           m.name, m.price, m.image
    FROM Cart c
    JOIN menu_items m ON c.item_id = m.item_id
    WHERE c.user_id = ?;
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(results);
  });
};
