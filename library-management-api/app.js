const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const loanRoutes = require('./routes/loans');
const analyticsRoutes = require('./routes/analytics');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/loans', loanRoutes);
app.use('/analytics', analyticsRoutes);

app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;
