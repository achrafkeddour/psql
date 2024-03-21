const express = require('express');
const mysql = require('mysql2/promise');
const fs = require("fs");
const bodyParser = require('body-parser');

const app = express();
const b = fs.readFileSync('index.html', 'utf8');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
    host: 'dpg-cnu9h5a0si5c73ds58mg-a',
    user: 'keddour',
    password: 'ajHdWafoMvmbFB8erfBgqkdjafOUxdzU',
    database: 'achraf_16qa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    const userData = [username, email, password];

    try {
        const connection = await pool.getConnection();
        await connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', userData);
        console.log('User data inserted');
        const a = `\n job is done thank you ${req.body.username} ! `
        const responseHTML = ` ${b.replace('</form>', `
         ${a}</form>`)}`;
        res.send(responseHTML);
        connection.release();
    } catch (error) {
        console.error('Error:', error.stack);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
