const db = require('../config/db');

// Get all menu items
const getAllItems = (req, res) => {
  db.query('SELECT * FROM menu_items', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error', details: err });
    } else {
      res.status(200).json(results);
    }
  });
};

// Get menu items by category
const getItemsByCategory = (req, res) => {
  const { category } = req.params;
  db.query('SELECT * FROM menu_items WHERE category = ?', [category], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error', details: err });
    } else {
      res.status(200).json(results);
    }
  });
};

// Get a menu item by ID
const getMenuItemById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM menu_items WHERE item_id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error', details: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Menu item not found' });
    } else {
      res.status(200).json(results[0]); // Return the first item (since IDs are unique)
    }
  });
};


// Get menu items for a specific restaurant
const getMenuItemsByRestaurant = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT item_id, name, description, price, category, availability, image FROM menu_items WHERE restaurant_id = ? AND availability = 1",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching menu items by restaurant:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    }
  );
};


module.exports = {
  getAllItems,
  getItemsByCategory,
  getMenuItemById,
  getMenuItemsByRestaurant
};
