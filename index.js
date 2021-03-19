const express = require('express');
const bodyParser = require('body-parser')

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
})

// post request to sign new user up
app.post('/signup', (req, res) => {
	console.log("signed up new user", req.body);
	res.redirect('http://localhost:3000/store');
})


app.listen(port,() => {
	console.log(`Listening at http://localhost:${port}`);
});