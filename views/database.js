
const mysql = require('mysql');
const conn = mysql.createConnection({
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

conn.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
  });
  module.exports = conn;