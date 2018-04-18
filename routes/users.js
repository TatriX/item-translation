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
router.get('/:count/:language/:translated/:query', function(req, res, next) { 
	  let LanguageModel = mongoose.model(req.params.language, MONGOOSE.schema,req.params.language);  
	  if (req.params.translated === "false"){
		  if (req.params.query === "SUKABLYA") {
    LanguageModel.find({}).sort({currentTranslation: 1}).limit(Number(req.params.count)).exec(function(err,found) {   
			if (found) {
		res.send(found); 
	} else {res.send('[]')}
		});  } else {
		LanguageModel.find({"nameEng":{$regex: req.params.query, $options: 'i'}}).sort({currentTranslation: 1}).limit(Number(req.params.count)).exec(function(err,found) {   
		if (found) {
		res.send(found); 
	} else {res.send('[]')}
		});	
			}
 } else { 
	   if (req.params.query === "SUKABLYA") {
    LanguageModel.find({"currentTranslation":""}).limit(Number(req.params.count)).exec(function(err,found) {   
		if (found) {
		res.send(found); 
	} else {res.send('[]')}
		});  }
		else {
    LanguageModel.find({"nameEng":{$regex: req.params.query, $options: 'i'},"currentTranslation":""}).limit(Number(req.params.count)).exec(function(err,found) {   
		if (found) {
		res.send(found); 
	} else {res.send('[]')}
		}); 
			}
	 }

 
});

module.exports = router;
