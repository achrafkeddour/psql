const express = require('express');
const { Pool } = require('pg');
const fs = require("fs");
const bodyParser = require('body-parser');

const app = express();
const b = fs.readFileSync('index.html', 'utf8');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({ //you should host a database to do this
    host: 'your hostname here',
    user: 'username ta3k also',
    password: 'password ta3k',
    database: 'your database here',
    port: 5432, // PostgreSQL port
    ssl: {
        rejectUnauthorized: false // For Render's PostgreSQL SSL
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    const userData = [username, email, password];

    try {
        const client = await pool.connect();
        await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', userData);
        console.log('User data inserted');
        const a = `\n job is done thank you ${req.body.username} ! `
        const responseHTML = ` ${b.replace('</form>', `
         ${a}</form>`)}`;
        res.send(responseHTML);
        client.release();
    } catch (error) {
        console.error('Error:', error.stack);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
