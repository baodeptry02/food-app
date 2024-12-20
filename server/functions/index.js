const functions = require('firebase-functions');

require('dotenv').config();

const express = require('express');
const app = express();

// body parser for our JSON data
app.use(express.json());

// cross orgin
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// api endpoint
app.get('/', (req, res) => {
  return res.send('Hello, world!');
});

const userRoute = require('./routes/user.router');
const productRoute = require('./routes/product.router');
const cartRoute = require('./routes/cart.router');
app.use('/api/users', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', require('./routes/order.router'));
app.use('/api/payment', require('./routes/zalopay.router'));
app.use('/api/transaction', require('./routes/transaction.router'));
exports.app = functions.https.onRequest(app);
