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
router.get('/:count/:language/:untranslated', function(req, res, next) { 
	  let LanguageModel = mongoose.model(req.params.language, MONGOOSE.schema,req.params.language);  
	  if (req.params.untranslated === "false"){
    LanguageModel.find({}).limit(Number(req.params.count)).sort({currentTranslation: 1}).exec(function(err,found) {   
		res.send(found);
		});  
 } else { 
    LanguageModel.find({"currentTranslation":""}).limit(Number(req.params.count)).sort({currentTranslation: 1}).exec(function(err,found) {   
		res.send(found);
		});  
	 }

 
});

module.exports = router;
