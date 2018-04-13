var express = require('express');
var router = express.Router(); 
var MONGOOSE = require('./schema')
var mongoose = require('mongoose');





router.post('/:lang', function(req, res, next) {  
	console.log("import/" + req.params.lang); 
	function fn(language) { 
		let Japanese = mongoose.model('Japanese', MONGOOSE.schema, 'Japanese') ;  
	 
	  MONGOOSE.model.find({},function(err,found) {  
		  let nameEng = found.map(e=>e.nameEng);
		  let object = req.body;
		    Object.keys(req.body).filter(e=>nameEng.indexOf(e) < 0).forEach(e=>delete object[e]) ;
		   object = Object.keys(object); 
		 nameEng.filter(e=>object.indexOf(e) < 0).map(function (key,index){
			 Japanese.update({},{nameEng:key},{upsert:true});
			 })
		  });
		}
	
	/**
 switch (req.params.lang) {
    case "Russian":  
   Object.keys(req.body).map(function(key, index) {
  MongooseScheme.update({"nameEng":key}, {$set : {"name":key,"currentTranslation": req.body[key]}, $addToSet: {"translations":{"variant":req.body[key],"count":1, _id : false, _v: false}}} , { upsert : true },e=>console.log(e)); 
});
   break;
   case "Japanese":
   
   break; 
    }
**/
    fn();
});









module.exports = router;
