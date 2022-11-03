var express = require('express');
var router = express.Router();

// another routes also appear here
// this script to fetch data from MySQL databse table
router.get('/scholarships', function(req, res, next) {
    var sql='SELECT * FROM scholarships';
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('scholarships', { title: 'User List', userData: data});
  });
});
module.exports = router;