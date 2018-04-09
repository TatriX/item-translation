var express = require('express');
var router = express.Router(); 
var MongooseScheme = require('./schema')



 // Вернуть полный список 
router.get('/', function(req, res, next) {  
    MongooseScheme.current.find({}, function(err, found) {
        if (err) {
            return console.error(err)
        };
        res.send(found)
    });  
 

 
});
 /////
 //// Вернуть N элементов
router.get('/:count', function(req, res, next) {  
    MongooseScheme.current.find({}).limit(Number(req.params.count)).exec(function(err,found) {
	 
		res.send(found)
		});  
 

 
});

module.exports = router;
