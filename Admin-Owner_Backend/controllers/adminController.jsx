const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * Get dashboard data for the logged-in admin
 */
exports.getDashboard = (req, res) => {
  const { user_id } = req.user;

  db.query('SELECT * FROM Restaurants WHERE owner_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching dashboard data:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(results);
  });
};

exports.getRestaurantDetails = (req, res) => {
  const { admin_id } = req.params;

  db.query(
    'SELECT r.name FROM Restaurants r JOIN resto_signup rs ON r.restaurant_id = rs.restaurant_id WHERE rs.resto_id = ?',
    [admin_id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length > 0) {
        console.log('Fetched restaurant details:', results[0]);
        res.send(results[0]);
      } else {
        console.log('No restaurant found for admin_id:', admin_id);
        res.status(404).send('Restaurant not found');
      }
    }
  );
};

/**
 * Get menu items for the logged-in admin's restaurant
 */


exports.getMenuItems = (req, res) => {
  const { restaurant_id } = req.params;

  console.log('Fetching menu items for restaurant_id:', restaurant_id);

  db.query(
    'SELECT * FROM Menu_Items WHERE restaurant_id = ?',
    [restaurant_id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length > 0) {
        console.log('Fetched menu items:', results);
        res.send(results);
      } else {
        console.log('No menu items found for restaurant_id:', restaurant_id);
        res.send([]); // Return an empty array if no menu items are found
      }
    }
  );
};



exports.addMenuItem = (req, res) => {
  const { name, description, price, category, restaurant_id } = req.body;

  console.log('Received request to add menu item:', req.body);

  if (!name || !description || !price || !category || !restaurant_id) {
    return res.status(400).send('All fields are required.');
  }

  db.query(
    'INSERT INTO Menu_Items (restaurant_id, name, description, price, category) VALUES (?, ?, ?, ?, ?)',
    [restaurant_id, name, description, price, category],
    (err, results) => {
      if (err) {
        console.error('Error adding menu item:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ message: 'Menu item added successfully', item_id: results.insertId });
    }
  );
};

/**
 * Update a menu item (Ensure only the owner can update)
 */
exports.updateMenuItem = (req, res) => {
  const { item_id, name, description, price, category } = req.body;
  const { restaurant_id } = req.user;

  db.query(
    'UPDATE Menu_Items SET name = ?, description = ?, price = ?, category = ? WHERE item_id = ? AND restaurant_id = ?',
    [name, description, price, category, item_id, restaurant_id],
    (err, results) => {
      if (err) {
        console.error('Error updating menu item:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ message: 'Menu item updated successfully' });
    }
  );
};

/**
 * Delete a menu item (Ensure only the owner can delete)
 */
exports.deleteMenuItem = (req, res) => {
  const { item_id } = req.params;
  const { restaurant_id } = req.user;

  db.query(
    'DELETE FROM Menu_Items WHERE item_id = ? AND restaurant_id = ?',
    [item_id, restaurant_id],
    (err, results) => {
      if (err) {
        console.error('Error deleting menu item:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ message: 'Menu item deleted successfully' });
    }
  );
};

/**
 * Get orders for the logged-in admin's restaurant
 */


// exports.getOrders = (req, res) => {
//   const { restaurant_id } = req.params;

//   db.query(
//     'SELECT order_id, status, user_id AS customer_id FROM Orders WHERE restaurant_id = ?',
//     [restaurant_id],
//     (err, results) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).send('Internal Server Error');
//       }

//       if (results.length > 0) {
//         console.log('Fetched orders:', results);
//         res.send(results);
//       } else {
//         console.log('No orders found for restaurant_id:', restaurant_id);
//         res.status(404).send('No orders found for this restaurant');
//       }
//     }
//   );
// };


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


/**
 * Update order status (Ensure admin can only update their restaurant's orders)
 */

exports.updateMenuItemAvailability = (req, res) => {
  const { item_id, availability } = req.body;

  console.log('Updating menu item availability:', item_id, availability);

  db.query(
    'UPDATE Menu_Items SET availability = ? WHERE item_id = ?',
    [availability, item_id],
    (err, results) => {
      if (err) {
        console.error('Error updating menu item availability:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ message: 'Menu item availability updated successfully' });
    }
  );
};

exports.updateOrderStatus = (req, res) => {
  const { order_id, status } = req.body;
  const { restaurant_id } = req.user;

  db.query(
    'UPDATE Orders SET status = ? WHERE order_id = ? AND restaurant_id = ?',
    [status, order_id, restaurant_id],
    (err, results) => {
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ message: 'Order status updated successfully' });
    }
  );
}; 

exports.deleteMenuItem = (req, res) => {
  const { item_id } = req.params;

  db.query(
    'DELETE FROM Menu_Items WHERE item_id = ?',
    [item_id],
    (err, results) => {
      if (err) {
        console.error('Error deleting menu item:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ message: 'Menu item deleted successfully' });
    }
  );
};

// exports.deleteMenuItem = (req, res) => {
//   const { item_id } = req.params;

//   db.query(
//     'DELETE FROM Menu_Items WHERE item_id = ?',
//     [item_id],
//     (err, results) => {
//       if (err) {
//         console.error('Error deleting menu item:', err);
//         return res.status(500).send('Internal Server Error');
//       }
//       res.send({ message: 'Menu item deleted successfully' });
//     }
//   );
// };
