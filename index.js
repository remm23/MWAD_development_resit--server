const express = require('express');
const bodyParser = require('body-parser');

// required for sending data to client
const cors = require('cors');

// database code
const sqlite3 = require('sqlite3').verbose();
const testDB = new sqlite3.Database('./db/test.db', err => {
	if (err) { return console.error('Connection error:',err.message)};
	console.log('Connected to test database');
});

// Create tables in database
testDB.run('CREATE TABLE IF NOT EXISTS cats (id INT, name TEXT, type TEXT);');
testDB.run('CREATE TABLE IF NOT EXISTS users (id INT, email TEXT, password TEXT);');

// query for creating the customer table
const columns = '(id INT, firstname TEXT, lastname TEXT,' +
' username TEXT, email TEXT, password TEXT, company TEXT,' +
' address TEXT, postcode TEXT);';
testDB.run('CREATE TABLE IF NOT EXISTS Customers ' + columns);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
const port = 4000;

app.get('/', (req,res) => {
	res.send('Hello World!');
});

app.get('/customers', (req,res) => {
	// Get all customers from database
	testDB.all('SELECT * FROM Customers', (err,rows) => {
		let customers = [];
		if (err) {
			return res.sendStatus(400);
		}
		rows.forEach(row => 
			customers.push(row)
		)
		// send customers back to client
		res.send(customers);
	})
});

// post request from login
app.post('/login', (req,res) => {
	console.log('Got body', req.body);
	// would redirect to route base on user and password
	// customers go to the /store
	// management goes to /management
});

// post request to sign new user up
app.post('/signup', (req, res) => {
	// create a random 8 digit id
	const randomID = Math.floor(Math.random() * 100000000);
	const user = req.body;
	const username = user.firstname + randomID;
	// console.log("signed up new users email", req.body);

	// insert new user into customer database
	testDB.run(`INSERT INTO Customers 
	(id, firstname, lastname, username, email, password, company, address, postcode)
	VALUES ('${randomID}', '${user.firstname}', '${user.lastname}', '${username}',
	 '${user.email}', '${user.password}', '${user.company}', '${user.address}', '${user.postcode}')`
	);
	// redirect customer to the store
	res.redirect('http://localhost:3000/store');
});

app.listen(port,() => {
	console.log(`Listening at http://localhost:${port}`);
});

// route for closing the connection to  the database
app.get('/leave', (req, res) => {
	testDB.close(err => {
		if (err) { return console.error('Close connection error',err.message) };
		console.log('Closed connection to database');
	});
});
