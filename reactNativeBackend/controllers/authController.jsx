// controllers/authController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService'); // Import sendEmail function
require('dotenv').config();

// User login function
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

            // Send a login email notification
            await sendEmail(
                results[0].email,
                'Login Notification',
                'You have successfully logged into your account.'
            );

            const token = jwt.sign({ id: results[0].user_id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.header('auth-token', token).send({
                token,
                role: 'user',
                user_id: results[0].user_id,
                username: results[0].username
            });
            
        }

        console.log('No user found with email:', email);
        return res.status(400).send('Invalid credentials.');
    });
};

// User registration function
exports.registerUser = async (req, res) => {
    const { user_id, username, password, email, phone_number } = req.body;

    console.log('Request Body:', req.body);
    console.log('Password:', password);

    if (!password) {
        return res.status(400).send('Password is required.');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query(
            'INSERT INTO users(user_id, username, password, email, phone_number) VALUES (?, ?, ?, ?, ?)',
            [user_id, username, hashedPassword, email, phone_number],
            async (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Internal Server Error');
                }

                const subject = 'Welcome to Indian Accent';
                const message = 'This is Indian Accent Resto, a warm welcome!!!';

                try {
                    await sendEmail(email, subject, message);
                    res.status(200).send({ message: 'User registered successfully and email sent.' });
                } catch (error) {
                    console.error('Error sending email:', error);
                    res.status(500).send('User registered successfully, but error sending email.');
                }
            }
        );
    } catch (error) {
        console.error('Error during password hashing:', error);
        res.status(500).send('Internal Server Error');
    }
};
