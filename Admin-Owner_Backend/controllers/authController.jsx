const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.superAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log('Super Admin login attempt with email:', email);

  db.query('SELECT * FROM Super_Admin WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      console.log('Found super admin:', results[0]);
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (!validPassword) {
        console.log('Invalid password for super admin');
        return res.status(400).send('Invalid credentials.');
      }

      const token = jwt.sign({ id: results[0].super_admin_id, role: 'super_admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.header('auth-token', token).send({ token, role: 'super_admin' });
    }

    console.log('No super admin found with email:', email);
    return res.status(400).send('Invalid credentials.');
  });
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log('Admin login attempt with email:', email);

  db.query('SELECT * FROM Resto_Signup WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      const admin = results[0];
      console.log('Found restaurant admin:', admin);

      if (admin.status === 'pending') {
        return res.status(400).send('Your registration is still pending approval from the super admin.');
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        console.log('Invalid password for restaurant admin');
        return res.status(400).send('Invalid credentials.');
      }

      const token = jwt.sign({ id: admin.resto_id, role: 'admin', restaurant_id: admin.restaurant_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.header('auth-token', token).send({ token, role: 'admin' });
    }

    console.log('No restaurant admin found with email:', email);
    return res.status(400).send('Invalid credentials.');
  });
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log('User login attempt with email:', email);

  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      console.log('Found user:', results[0]);
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (!validPassword) {
        console.log('Invalid password for user');
        return res.status(400).send('Invalid credentials.');
      }

      const token = jwt.sign({ id: results[0].user_id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.header('auth-token', token).send({ token, role: 'user' });
    }

    console.log('No user found with email:', email);
    return res.status(400).send('Invalid credentials.');
  });
};

exports.registerRestoOwner = async (req, res) => {
  console.log('Request body:', req.body); // Log the request body

  const { restaurant_id, owner_name, email, password, phone_number } = req.body;

  if (!email) {
    return res.status(400).send('Email is required.');
  }

  const normalizedEmail = email.toLowerCase(); // Normalize email

  if (!password) {
    return res.status(400).send('Password is required.');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query(
      'INSERT INTO Resto_Signup (restaurant_id, owner_name, email, password, phone_number, status) VALUES (?, ?, ?, ?, ?, ?)',
      [restaurant_id, owner_name, normalizedEmail, hashedPassword, phone_number, 'pending'],
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

exports.registerSuperAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Request Body:', req.body);
  console.log('Password:', password);

  if (!password) {
    return res.status(400).send('Password is required.');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query(
      'INSERT INTO Super_Admin (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Internal Server Error');
        }
        res.send({ message: 'Super admin registered successfully.' });
      }
    );
  } catch (error) {
    console.error('Error during password hashing:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.registerRestaurant = async (req, res) => {
  const { name, description, address, contact_number } = req.body;

  if (!name || !description || !address || !contact_number) {
    return res.status(400).send('All fields (name, description, address, contact_number) are required.');
  }

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

