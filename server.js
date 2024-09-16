const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Emily*19', // Your MySQL password
    database: 'CG_EM',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database CG_EM');
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.session.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied');
}

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/apply_loan', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'apply_loan.html'));
});

app.get('/payment', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

app.get('/admin_dashboard', isAuthenticated, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin_dashboard.html'));
});

// POST /register
app.post('/register', (req, res) => {
    const { name, id_number, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO customers (name, id_number, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [name, id_number, hashedPassword, 'client'], (err, results) => {
        if (err) {
            console.error('Error inserting customer:', err.message);
            return res.status(500).send('Error registering customer');
        }
        res.redirect('/login');
    });
});

// POST /login
app.post('/login', (req, res) => {
    const { id_number, password } = req.body;

    const query = 'SELECT * FROM customers WHERE id_number = ?';
    db.query(query, [id_number], (err, results) => {
        if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).send('Error logging in');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid ID number or password');
        }

        const user = results[0];
        if (bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id_number;
            req.session.role = user.role; // Store user role in session
            res.redirect(user.role === 'admin' ? '/admin_dashboard' : '/apply_loan');
        } else {
            res.status(401).send('Invalid ID number or password');
        }
    });
});

// POST /submit_loan (client-only)
app.post('/submit_loan', isAuthenticated, (req, res) => {
    const { loan_amount, loan_date, repayment_term } = req.body;

    const query = 'INSERT INTO loans (customer_id, loan_amount, loan_date, repayment_term) VALUES (?, ?, ?, ?)';
    db.query(query, [req.session.userId, loan_amount, loan_date, repayment_term], (err, results) => {
        if (err) {
            console.error('Error inserting loan:', err.message);
            return res.status(500).send('Error applying for loan');
        }
        res.redirect('/');
    });
});

// POST /submit_payment (client-only)
app.post('/submit_payment', isAuthenticated, (req, res) => {
    const { amount, card_number, expiry_date, cvv } = req.body;

    // Payment processing logic here
    console.log(`Processing payment of ${amount} for card ${card_number}`);

    res.redirect('/');
});

// Admin-only route to update customer details
app.post('/update-customer', isAuthenticated, isAdmin, (req, res) => {
    const { customer_id, county, constituency, salesperson, credit_officer, contract_number, phone_number, number_of_cows } = req.body;

    const query = 'UPDATE customers SET county = ?, constituency = ?, salesperson = ?, credit_officer = ?, contract_number = ?, phone_number = ?, number_of_cows = ? WHERE id_number = ?';
    db.query(query, [county, constituency, salesperson, credit_officer, contract_number, phone_number, number_of_cows, customer_id], (err, results) => {
        if (err) {
            console.error('Error updating customer:', err.message);
            return res.status(500).send('Error updating customer details');
        }
        res.send('Customer details updated successfully');
    });
});

// Admin-only routes to get data
app.get('/admin/customers', isAuthenticated, isAdmin, (req, res) => {
    const query = 'SELECT * FROM customers';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving customers:', err.message);
            return res.status(500).send('Error retrieving customers');
        }
        res.json(results);
    });
});

app.get('/admin/loans', isAuthenticated, isAdmin, (req, res) => {
    const query = 'SELECT * FROM loans';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving loans:', err.message);
            return res.status(500).send('Error retrieving loans');
        }
        res.json(results);
    });
});

app.get('/admin/payments', isAuthenticated, isAdmin, (req, res) => {
    const query = 'SELECT * FROM payments';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving payments:', err.message);
            return res.status(500).send('Error retrieving payments');
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
