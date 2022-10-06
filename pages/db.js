
/* i had to do this on my mac toget node up:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password'; 
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;

YOU GUYS MAY NOT NEED TO DO THIS ON WINDOWS/LINUX

to do SQL queries in js here, it's 'con.query('SELECT * FROM user_login');'
you can create, do anything or do it in terminal if you want to after typing 'mysql'

also 127.0.0.1 may need to be 'localhost', experiment
*/

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "password",
  database: "capdb"
});

/* &&&&&& ONLY RUN ONE TIME &&&&&&  CREATES A MYSQL DATABASE CALLED capdb

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

con.connect(function(err){
  if (err) throw err;
  console.log("Setting privileges for james");
  con.query("GRANT ALL PRIVILEGES ON `capdb` . * TO 'james'@'localhost';");
})

