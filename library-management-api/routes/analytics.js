const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Borrower = require('../models/Borrower');
const mongoose = require('mongoose');

// 1. Books borrowed by each borrower
router.get('/borrowed-books', async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $group: {
          _id: '$borrowerId',
          books: { $push: '$book.title' },
        },
      },
      {
        $lookup: {
          from: 'borrowers',
          localField: '_id',
          foreignField: '_id',
          as: 'borrower',
        },
      },
      { $unwind: '$borrower' },
      {
        $project: {
          borrowerName: '$borrower.name',
          books: 1,
        },
      },
    ]);

    if (result.length === 0) return res.status(200).json({ message: 'No data found' });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 2. Top 3 most borrowed books
router.get('/top-borrowed-books', async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $group: {
          _id: '$bookId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $project: {
          title: '$book.title',
          author: '$book.author',
          timesBorrowed: '$count',
        },
      },
    ]);

    if (result.length === 0) return res.status(200).json({ message: 'No data found' });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 3. Borrower loan history
router.get('/borrower-history/:id', async (req, res) => {
  try {
    const borrowerId = new mongoose.Types.ObjectId(req.params.id);

    const result = await Loan.aggregate([
      { $match: { borrowerId } },
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $project: {
          bookTitle: '$book.title',
          loanDate: 1,
          returnDate: 1,
          status: 1,
        },
      },
    ]);

    if (result.length === 0) return res.status(200).json({ message: 'No data found' });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 4. Frequent borrowers (>5 books)
router.get('/frequent-borrowers', async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $group: {
          _id: '$borrowerId',
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 5 } } },
      {
        $lookup: {
          from: 'borrowers',
          localField: '_id',
          foreignField: '_id',
          as: 'borrower',
        },
      },
      { $unwind: '$borrower' },
      {
        $project: {
          name: '$borrower.name',
          email: '$borrower.email',
          totalLoans: '$count',
        },
      },
    ]);

    if (result.length === 0) return res.status(200).json({ message: 'No data found' });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 5. All loan reports
router.get('/loan-reports', async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $lookup: {
          from: 'borrowers',
          localField: 'borrowerId',
          foreignField: '_id',
          as: 'borrower',
        },
      },
      { $unwind: '$borrower' },
      {
        $project: {
          bookTitle: '$book.title',
          borrowerName: '$borrower.name',
          loanDate: 1,
          returnDate: 1,
          status: 1,
        },
      },
    ]);

    if (result.length === 0) return res.status(200).json({ message: 'No data found' });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
