const Income = require('../models/Income');
const Expense = require('../models/Expense');

const {isValidObjectId,Types} = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

// Validate userId
if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
}

        // Fetch total income
        const totalIncome = await Income.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Fetch total expenses
        const totalExpenses = await Expense.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);


        // Fetch last 60 days income transactions
        const last60DaysIncomeTransactions = await Income.find
        ({
            user:userId,
            date: {
                $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) 
            }
        }).sort({ date: -1 });

        //get last 60 days total income
        const last60DaysTotalIncome = last60DaysIncomeTransactions.reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);



        // Fetch last 30 days expense transactions
        const last30DaysExpenseTransactions = await Expense.find
        ({
            userId,
            date: {
                $gte: new Date(Date.now() - 60 * 24 * 60 * 30 * 1000) 
            }
        }).sort({ date: -1 });

        //get last 30 days total expenses
        const last30DaysTotalExpenses = last30DaysExpenseTransactions.reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);



        //fetch last 5 transactions (income + expenses)
        const last5Income = await Income.find({ user: userId })
          .sort({ date: -1 })
          .limit(5);
            
        const last5Expenses = await Expense.find({ userId: userId })
          .sort({ date: -1 })
          .limit(5);
            
        // Tag each transaction with its type
        const taggedIncome = last5Income.map(item => ({
          ...item.toObject(),
          type: 'income',
        }));
        
        const taggedExpenses = last5Expenses.map(item => ({
          ...item.toObject(),
          type: 'expense',
        }));
        
        // Combine, sort by date, and take the latest 5
        const last5Transactions = taggedIncome
          .concat(taggedExpenses)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        
        
        res.status(200).json({
            totalBalance: last60DaysTotalIncome - last30DaysTotalExpenses,
            totalIncome: totalIncome[0] ? totalIncome[0].total : 0,
            totalExpenses: totalExpenses[0] ? totalExpenses[0].total : 0,
            last60DaysIncome: {
                transactions: last60DaysIncomeTransactions,
                total: last60DaysTotalIncome
            },
            last30DaysExpenses: {
                transactions: last30DaysExpenseTransactions,
                total: last30DaysTotalExpenses
            },
            recentTransactions: last5Transactions
        });
    } 
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}