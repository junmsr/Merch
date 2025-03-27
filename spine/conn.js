const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emerchandise'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.post('/api/signup', (req, res) => {
    const { first_name, last_name, student_id, email, password } = req.body;
    const sql = 'INSERT INTO users (first_name, last_name, student_id, email, password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [first_name, last_name, student_id, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User created successfully!' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});