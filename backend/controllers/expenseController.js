const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
    const userId = req.user._id;
    try{
        const { amount, category, icon ,date} = req.body;
        if (!amount || !category || !date) {
            return res.status(400).json({ message: 'Amount, category, and date are required' });
        }
        const expense = new Expense({
            userId,
            amount,
            category,
            icon,
            date:new Date(date) 
        });
        await expense.save();
        res.status(201).json({ message: 'Expense added successfully', expense });
    }
    catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
}

//---------------------------------------------------------------------


exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


//---------------------------------------------------------------------

exports.deleteExpense = async (req, res) => {
    const userId = req.user._id;
    const { id: expenseId } = req.params;
    try {
        const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


//---------------------------------------------------------------------

exports.downloadExpenseExcel = async (req, res) => {    
    const userId = req.user._id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found for this user' });
        }

        const excelData = expenses.map(expense => ({
            Date: expense.date.toISOString().split('T')[0],
            Amount: expense.amount,
            Category: expense.category,
            Icon: expense.icon
        }));

        res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        const xlsx = require('xlsx');
        const worksheet = xlsx.utils.json_to_sheet(excelData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Expenses');
        
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.send(buffer);
    } catch (error) {
        console.error('Error downloading expenses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
