const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

console.log("made it past includes");

/*
var con  = require('mysql');
var connection = con.createConnection({
  host     : '127.0.0.1', // sometimes this is 'localhost', but on mac 127.0.0.1 works
  user     : 'root',
  port: 3000,
  password : 'password',
  database : 'capdb'
}); */

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

console.log("Connected to nodelogin localhost:3000");
/* connection.query('SELECT now()', function(err, rows) {
  if (err) throw err;

  console.log('Node running... CapDB up', rows[0].solution);
}); */


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

console.log("..passed app.use");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

console.log("..passed static gets");
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + 'login.html'));
});
// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/home
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

app.listen(3000); // port 3306 for testing

/* i had to do this on my mac to get node up:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password'; 
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;

YOU GUYS MAY NOT NEED TO DO THIS ON WINDOWS/LINUX

also 127.0.0.1 may need to be 'localhost', experiment

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "password",
  database: "capdb"
}); 


/* &&&&&& ONLY RUN ONE TIME &&&&&&  CREATES A MYSQL DATABASE CALLED capdb


// CAN ALSO TYPE "mysql.server start" ... "create database capdb" ONE TIME
// THIS BELOW DID NOT WORK FOR ME 
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE capdb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
}); */

/* running 'node db.js' in terminal will create a user login here
  only run this one time

  ctrl-C to exit node in terminal

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to NodeDB");
  con.query("CREATE USER 'james'@'localhost' IDENTIFIED BY 'jamespw';")

}) */

/*

con.connect(function(err){
  if (err) throw err;
  console.log("Setting privileges for james");
  con.query("GRANT ALL PRIVILEGES ON `capdb` . * TO 'james'@'localhost';");
})

 */


