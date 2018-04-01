 var express = require('express');
var router = express.Router(); 
var Item = require('./schema')



router.get('/', function(req, res, next) {
    Item.find({}, function(err, found) {
        if (err) {
            return console.error(err)
        };
        res.send(found)
    });
});


module.exports = router;
