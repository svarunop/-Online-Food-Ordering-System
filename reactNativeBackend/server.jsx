const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const menuRoutes = require('./routes/menuRoutes');
const path = require('path');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/menu', menuRoutes);

app.use('/public', express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
