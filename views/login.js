const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { request } = require('http');

const connection = mysql.createConnection({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 10000,
    acquireTimeout  : 60 * 60 * 10000,
    timeout         : 60 * 60 * 10000,
	host     : '127.0.0.1',
	port: 3306,
	user     : 'root',
	password : 'password',
	database : 'nodelogin'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	loggedin: false,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

request.session.loggedin = false;

// http://localhost:3306/ to render login template

 /* app.get('/', function(request, response) {
	console.log("trying to load index.html, did it?");
	response.sendFile(path.join(__dirname + '/login.html'));
});  */

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/index.html'));
});

// http://localhost:3306/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		console.log("made it to u&p");
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				console.log("username and password are valid")
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				console.log("need to load homepage and feed in user data after this")
				response.redirect('/home');
			} else {
				console.log("username and password INVALID")
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3306/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3306); // maybe try 3000 on windows