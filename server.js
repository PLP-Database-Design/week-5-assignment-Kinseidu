const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Create Express app
const app = express();

// Load environment variables from .env
dotenv.config();

// Create MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID:', db.threadId);
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Hospital API! Use /patients or /providers to access data.');
});

// 1. Retrieve all patients and render them using EJS
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving patients:', err);
            return res.status(500).send(`Error retrieving patients: ${err.message}`);
        }
        res.render('patients', { patients: results });
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    console.log('GET /providers route was called');
    const query = 'SELECT first_name, last_name, provider_speciality FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving providers:', err);
            return res.status(500).send(`Error retrieving providers: ${err.message}`);
        }
        res.render('providers', { providers: results });
    });
});

// 3. Filter patients by first name
app.get('/patients/first-name/:name', (req, res) => {
    const firstName = req.params.name;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
        if (err) {
            console.error('Error retrieving patients by first name:', err);
            return res.status(500).send(`Error retrieving patients by first name: ${err.message}`);
        }
        res.json(results);
    });
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

//To retrieve patients and providers us:
//http://localhost:3300/patients
 //http://localhost:3300/providers

// Start the server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
