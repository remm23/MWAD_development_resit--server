const express = require('express');
const bodyParser = require('body-parser');

// database code
const sqlite3 = require('sqlite3').verbose();
const testDB = new sqlite3.Database('./db/test.db', err => {
	if (err) { return console.error('Connection error:',err.message)};
	console.log('Connected to test database');
});

// Create tables in database
testDB.run('CREATE TABLE IF NOT EXISTS cats (id INT, name TEXT, type TEXT);');
testDB.run('CREATE TABLE IF NOT EXISTS users (id INT, email TEXT, password TEXT);');

const columns = '(id INT, firstname TEXT, lastname TEXT,' +
' username TEXT, email TEXT, password TEXT, company TEXT,' +
' address TEXT, postcode TEXT);';
testDB.run('CREATE TABLE IF NOT EXISTS Customers ' + columns);




const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const port = 4000;

app.get('/', (req,res) => {
	res.send('Hello World!');
});

// post request from login
app.post('/login', (req,res) => {
	console.log('Got body', req.body);
	// redirect to route base on user and password
	if (req.body.email == "joeblogs@icloud.com" && req.body.password == "apple") {
		res.redirect('http://localhost:3000/management')
	} else if (req.body.email == "janedoe@googlemail.com" && req.body.password == "google") {
		res.redirect('http://localhost:3000/store')
	} else {
		res.redirect('http://localhost:3000/')
	}
});

// post request to sign new user up
app.post('/signup', (req, res) => {
	const randomID = Math.floor(Math.random() * 100000000);
	const user = req.body;
	const username = user.firstname + randomID;
	console.log("signed up new users email", req.body);

	// testDB.run(`INSERT INTO users (email, password) VALUES ('${req.body.email}', '${req.body.password}');`);

	testDB.run(`INSERT INTO Customers 
	(id, firstname, lastname, username, email, password, company, address, postcode)
	VALUES ('${randomID}', '${user.firstname}', '${user.lastname}', '${username}',
	 '${user.email}', '${user.password}', '${user.company}', '${user.address}', '${user.postcode}')`
	);
	res.redirect('http://localhost:3000/store');
});


app.listen(port,() => {
	console.log(`Listening at http://localhost:${port}`);
});

app.get('/leave', (req, res) => {
	testDB.close(err => {
		if (err) { return console.error('Close connection error',err.message) };
		console.log('Closed connection to database');
	});
});

//close connection to database








