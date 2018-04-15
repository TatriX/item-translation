var express = require('express');
var router = express.Router(); 
var MONGOOSE = require('./schema');
var mongoose = require('mongoose');



 // Вернуть полный список 
router.get('/', function(req, res, next) {  
    MONGOOSE.model.find({}, function(err, found) {
        if (err) {
            return console.error(err)
        };
        res.send(found)
    });  
 

 
});
 /////
 //// Вернуть N элементов
router.get('/:count/:language', function(req, res, next) { 
	  let LanguageModel = mongoose.model(req.params.language, MONGOOSE.schema,req.params.language);  
    LanguageModel.find({}).limit(Number(req.params.count)).exec(function(err,found) {   
		res.send(found);
		});  
 

 
});

module.exports = router;
