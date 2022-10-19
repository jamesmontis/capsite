
const mysql = require('mysql');
var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
const session = require('express-session');

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

router.use(session({
	secret: 'secret',
	resave: true,
    loggedin: false,
	saveUninitialized: true
}));
router.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path));

app.use("/",router);

/* app.use("*",function(req,res){
  res.sendFile(path + "404.html");
}); */

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
}); 

router.get("/login",function(req,res){
    res.sendFile(path + "login.html");
  });

router.get("/userdashboard",function(req,res){
    res.sendFile(path + "userdashboard.html");
  });

  router.get("/about",function(req,res){
	res.sendFile(path + "about.html");
  });

router.get("/scholarships",function(req,res){
	res.sendFile(path + "scholarships.html");
});


// http://localhost:3306/home
router.get('/home', function(request, response) {
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




app.post('/auth', function(request, response) {
	// Capture the input fields

	let username = request.body.username;
	let password = request.body.password;

    console.log("username: ", username, "pw: ", password );
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

app.listen(3000,function(){
  console.log("running on :3000 port");
});

module.exports = app;