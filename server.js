// server.js
const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a MySQL connection to the CG_EM database
const db = mysql.createConnection({
    host: 'localhost', // Change this if your MySQL server is on a different host
    user: 'root', // Replace with your MySQL username
    password: 'Emily*19', // Replace with your MySQL password
    database: 'CG_EM' // Connect to the CG_EM database
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database CG_EM');
});

// Define the homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Ensure you have an index.html in the 'public' directory
});

// Define the payment submission route
app.post('/submit_payment', (req, res) => {
    const { amount, card, expiry, cvv } = req.body;
    console.log(`Payment received: Amount: ${amount}, Card: ${card}, Expiry: ${expiry}, CVV: ${cvv}`);

    // Insert payment details into the payments table
    const paymentQuery = 'INSERT INTO payments (amount, card, expiry, cvv) VALUES (?, ?, ?, ?)';
    db.query(paymentQuery, [amount, card, expiry, cvv], (err, paymentResults) => {
        if (err) {
            console.error('Error inserting payment:', err);
            return res.status(500).send('Database error');
        }

        // Get the last inserted payment ID
        const paymentId = paymentResults.insertId;

        // Insert transaction details into the transactions table
        const transactionQuery = 'INSERT INTO transactions (payment_id, transaction_amount, transaction_type) VALUES (?, ?, ?)';
        const transactionType = 'Payment'; // Adjust this based on your application logic

        db.query(transactionQuery, [paymentId, amount, transactionType], (err) => {
            if (err) {
                console.error('Error inserting transaction:', err);
                return res.status(500).send('Database error');
            }

            res.send('Payment successful!');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
