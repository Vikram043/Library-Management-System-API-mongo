const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

router.post('/', async (req, res) => {
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.status(200).json({ message: 'Loan recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;

