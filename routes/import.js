var express = require('express');
var router = express.Router(); 
var MongooseScheme = require('./schema')





router.post('/:lang', function(req, res, next) {  
	console.log("import/" + req.params.lang);
/**	
	function fn(language) {
		let  database = mongoose.model("Current",{"collection":language});
	  Mongoose.current.find({},function(err,found) {
		  console.log(Object.keys(found)[0]);
		  });
		}
	**/
 
 switch (req.params.lang) {
    case "Russian":  
   Object.keys(req.body).map(function(key, index) {
  MongooseScheme.current.update({"nameEng":key}, {$set : {"name":key,"currentTranslation": req.body[key]}, $addToSet: {"translations":{"variant":req.body[key],"count":1, _id : false, _v: false}}} , { upsert : true },e=>console.log(e)); 
});
   break;
   case "Japanese":
   
   break; 
    }

 
    fn();
});









module.exports = router;
