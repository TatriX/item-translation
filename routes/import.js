var express = require('express');
var router = express.Router(); 
var MongooseScheme = require('./schema')





router.post('/', function(req, res, next) {  
 
   Object.keys(req.body).map(function(key, index) {
   MongooseScheme.current.update({"nameEng":key}, {$set : {"name":key,"currentTranslation": req.body[key]}, $addToSet: {"translations":{"variant":req.body[key],"count":1}}}, { upsert : true },e=>console.log(req.body[key])); 
});
    
});









module.exports = router;
