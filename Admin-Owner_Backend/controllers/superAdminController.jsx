const db = require('../config/db');
const jwt = require('jsonwebtoken');
const cron = require("node-cron");
const moment = require("moment-timezone");

require('dotenv').config();

exports.getRequests = (req, res) => {
  db.query('SELECT * FROM Resto_Signup WHERE status = ?', ['pending'], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
};


exports.getNotifications = (req,res)=>{
  db.query('SELECT * FROM notifications', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
};

exports.approveRequest = (req, res) => {
  const { resto_id } = req.params;

  db.query('UPDATE Resto_Signup SET status = ? WHERE resto_id = ?', ['approved', resto_id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
};

exports.rejectRequest = (req, res) => {
  const { resto_id } = req.params;

  db.query('UPDATE Resto_Signup SET status = ? WHERE resto_id = ?', ['rejected', resto_id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
};

exports.pushNotification = (req, res) => {
  const { message } = req.body;

  db.query('INSERT INTO Super_Admin_Actions (super_admin_id, action_type, target_id, details) VALUES (?, ?, ?, ?)', 
    [req.user.super_admin_id, 'push_notification', 0, message], 
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
};

exports.registerRestaurant = async (req, res) => {
  const { name, description, address, contact_number } = req.body;

  db.query(
    'INSERT INTO Restaurants (name, description, address, contact_number, status) VALUES (?, ?, ?, ?, ?)',
    [name, description, address, contact_number, 'open'],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send({ message: 'Restaurant registered successfully.', restaurant_id: results.insertId });
    }
  );
};

exports.registerRestoOwner = async (req, res) => {
  const { restaurant_id, owner_name, email, password, phone_number } = req.body;

  // Debug: Log the request body and password
  console.log('Request Body:', req.body);
  console.log('Password:', password);

  // Check if the password is undefined or empty
  if (!password) {
    return res.status(400).send('Password is required.');
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query(
      'INSERT INTO Resto_Signup (restaurant_id, owner_name, email, password, phone_number, status) VALUES (?, ?, ?, ?, ?, ?)',
      [restaurant_id, owner_name, email, hashedPassword, phone_number, 'pending'],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Internal Server Error');
        }
        res.send({ message: 'Registration request submitted successfully. Awaiting approval.' });
      }
    );
  } catch (error) {
    console.error('Error during password hashing:', error);
    res.status(500).send('Internal Server Error');
  }
};

// File: superAdminController.js

// exports.sendPromoNotification = (req, res) => {
//   const { user_id, message, discount_percentage, validity_hours } = req.body;

//   if (!user_id || !message || !discount_percentage || !validity_hours) {
//     return res.status(400).send('All fields (user_id, message, discount_percentage, validity_hours) are required.');
//   }

//   const validityEnd = new Date();
//   validityEnd.setHours(validityEnd.getHours() + parseInt(validity_hours));

//   const fullMessage = `${message} Discount: ${discount_percentage}%`;

//   db.query(
//     'INSERT INTO Notifications (user_id, message, validity_end) VALUES (?, ?, ?)',
//     [user_id, fullMessage, validityEnd],
//     (err, results) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).send('Internal Server Error');
//       }
//       res.send({ message: 'Notification sent successfully.' });
//     }
//   );
// };


// exports.createOfferNotification = (req, res) => {
//   const { super_admin_id, offer_name, discount, expires_at , promocode} = req.body;

//   if (!super_admin_id || !offer_name || !discount || !expires_at || !promocode) {
//       return res.status(400).send("All fields (super_admin_id, offer_name, discount, expires_in_hours ,promocode) are required.");
//   }

//   if (discount < 1 || discount > 100) {
//       return res.status(400).send("Discount should be between 1 and 100%.");
//   }

//   // Calculate expiry time
//   const expiresAt = new Date();
//   expiresAt.setHours(expiresAt.getHours() + parseInt(expires_at));

//   db.query(
//       `INSERT INTO Notifications (super_admin_id, offer_name, discount, expires_at , promocode) VALUES (?, ?, ?, ?,?)`,
//       [super_admin_id, offer_name, discount, expiresAt , promocode],
//       (err, results) => {
//           if (err) {
//               console.error("Database error:", err);
//               return res.status(500).send("Internal Server Error");
//           }
//           res.send({ message: "Offer notification created successfully.", offer_id: results.insertId });
//       }
//   );
// };

exports.createOfferNotification = (req, res) => {
  const { super_admin_id, offer_name, discount, extra_minutes , promocode } = req.body;

  if (!super_admin_id || !offer_name || !discount || !extra_minutes || !promocode) {
      return res.status(400).json({ message: "All fields are required." });
  }

  // Get current time in IST
  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  const expiresAt = moment(createdAt).add(extra_minutes, "minutes").format("YYYY-MM-DD HH:mm:ss");

  const query = `
      INSERT INTO Notifications (super_admin_id, offer_name, discount,  expires_at, promocode )
      VALUES (?, ?, ?, ?,?)
  `;

  db.query(query, [super_admin_id, offer_name, discount, expiresAt ,promocode], (err, result) => {
      if (err) {
          console.error("❌ Error inserting notification:", err);
          return res.status(500).json({ message: "Database error." });
      }
      res.status(201).json({ message: "✅ Notification added successfully!", notification_id: result.insertId });
  });
};

// 2️⃣ Auto-Update Expired Notifications (Runs Every Minute)
cron.schedule("* * * * *", () => {
  const updateQuery = `
      UPDATE Notifications 
      SET status = 0 
      WHERE status = 1 AND expires_at <= NOW();
  `;

  db.query(updateQuery, (err, result) => {
      if (err) {
          console.error("❌ Error updating expired notifications:", err);
      } else if (result.affectedRows > 0) {
          console.log(`✅ ${result.affectedRows} notifications expired and updated.`);
      }
  });
});
