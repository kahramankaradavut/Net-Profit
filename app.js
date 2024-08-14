const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./config/db');

const app = express();
app.use(bodyParser.json());

//işlem ekleme
app.post('/transactions', async (req, res) => {
    const { cash_payment, account_balance, date } = req.body;
    try {
        const newTransaction = await pool.query(
            'INSERT INTO transactions (cash_payment, account_balance, date) VALUES ($1, $2, $3) RETURNING *',
            [cash_payment, account_balance, date]
        );
        res.json(newTransaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// İşlemleri çekme
app.get('/transactions', async (req, res) => {
    try {
        const transactions = await pool.query('SELECT * FROM transactions');
        res.json(transactions.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});