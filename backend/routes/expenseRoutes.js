const express = require('express');
const { getAllExpense, addExpense, downloadExpenseExcel, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', protect, addExpense);
router.get('/get', protect, getAllExpense);
router.get('/download-expense-excel', protect, downloadExpenseExcel);
router.delete('/:id', protect, deleteExpense);

module.exports = router;