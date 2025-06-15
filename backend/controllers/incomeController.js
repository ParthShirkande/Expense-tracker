const Income = require('../models/Income');
const User = require('../models/User');


exports.addIncome = async (req, res) => {
    const userId = req.user._id;
    try{
        const { amount, source, icon ,date } = req.body;

        if (!amount || !source || !date) {
            return res.status(400).json({ message: 'Amount and source are required' });
        }

        const newIncome = new Income({
            user: userId,
            amount,
            source,
            icon,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(201).json({ message: 'Income added successfully', newIncome });
    }
    catch (error) {
        console.error('Error adding income:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
 
// -----------------------------------------------------------------------------


exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ user: userId }).sort({ date: -1 });
        res.status(200).json(income);
    } catch (error) {
        console.error('Error fetching income:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



// ----------------------------------------------------------------------------------------


exports.deleteIncome = async (req, res) => {
    const userId = req.user._id;
    try{
        const incomeId = req.params.id;

        const income = await Income.findById(incomeId);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        if (income.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this income' });
        }

        await Income.findByIdAndDelete(incomeId);
        res.status(200).json({ message: 'Income deleted successfully' });
    }
    catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ message: 'Server error' });
}
};



// ----------------------------------------------------------------------------------------


const ExcelJS = require('exceljs');

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ user: userId });

        if (income.length === 0) {
            return res.status(404).json({ message: 'No income records found' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Income');

        // Define columns
        worksheet.columns = [
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Source', key: 'source', width: 20 },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Icon', key: 'icon', width: 10 }
        ];

        // Add rows
        income.forEach(item => {
            worksheet.addRow({
                amount: item.amount,
                source: item.source,
                date: item.date.toISOString().split('T')[0],
                icon: item.icon || 'N/A'
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=income.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error downloading income Excel:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
