var express = require('express');
var router = express.Router(); 
var MONGOOSE = require('./schema')
var mongoose = require('mongoose');
const languageList = ["Korean","Japanese","Brazilian Portuguese","Chinese traditional","Chinese simplified"];
 
  
  
router.post('/:lang', function(req, res, next) {   
	const requestedLanguage = req.params.lang;  
	
	
	
   
	function fn(language) { 
	  let masterDB;   
	  console.log('fn');
	 let init = () => {
	  console.log('init');
		 
		  mongoose.connect("mongodb://username:password@ds135830.mlab.com:35830/translations", function(err, client) {
    if(err) {
        console.log(err)
    }  
	  console.log('connect');
		   client.db.listCollections().toArray(function(err, collections) {
      const showDBs = collections.filter(e=>languageList.indexOf(e.name) > -1).map(e=>e.name) ;
      
	  console.log(showDBs);
    
	  MONGOOSE.model.find({},function(err,found) {   
		  masterDB = found.map(e=>e.nameEng); 
		  if (language === "Sync") { 
		  languageList.forEach(e=>unifyDB(e));
	  } 
	  else {
			uploadDB(language) 
		  } 
		  
		  
		  });
		  
		  
    });
}); 
	  } 
	    
	  let unifyDB = (language) => {
		  let LanguageModel = mongoose.model(language, MONGOOSE.schema,language);
		  LanguageModel.find({},function(err,found) {  
			  if(err) {  console.log(err)} 
			  let toRemove = found.map(e=>e.nameEng).filter(e=>masterDB.indexOf(e) < 0); 
			  console.log(toRemove);
			  if (toRemove.length > 0) { 
				  toRemove.forEach(function(e) { LanguageModel.remove({"nameEng":e}).exec()});
				  }
				  const foundArray = found.map(e=>e.nameEng);
			   masterDB.filter(e=>foundArray.indexOf(e) < 0).forEach(function (key,index){  
			 LanguageModel.update({nameEng:key},{"$set":{nameEng:key,currentTranslation:""}} ,{upsert:true}).exec();
		 
			 }); 
			  
			  
			  });
			  
			  
		  }
		  
		  
	 let uploadDB = (language) => {
		 console.log('upload');
		let LanguageModel = mongoose.model(language, MONGOOSE.schema,language) ; 
		let inputData = Object.keys(req.body).filter(e=>masterDB.indexOf(e) > 0);
		let toUpload = [...inputData, ...masterDB.filter(e=>inputData.indexOf(e) < 0)];
		 toUpload.forEach(function (key,index){  
			 if (req.body[key]) {
			 LanguageModel.update({nameEng:key},{"$set":{nameEng:key,"currentTranslation": req.body[key].trim()} , $addToSet: {"translations":{"variant":req.body[key].trim(),"count":1,_id : false, _v: false}}} ,{upsert:true}).exec();
		 } else {
			 LanguageModel.update({nameEng:key},{"$set":{nameEng:key,"currentTranslation": ""}} ,{upsert:true}).exec();
		 }
			 }); 
		 } 
	
	
	
	
	init();
	
		}
		
		
		  
	
	 if(requestedLanguage === "Russian"){
		 
		  MONGOOSE.model.find({},function(err,found){ 
			  let ArrayFound = found.map(e=>e.nameEng); 
			  let reqBody= Object.keys(req.body);
		  let toRemove = ArrayFound.filter(e=>reqBody.indexOf(e) < 0);
			  if (toRemove.length > 0) { 
				  toRemove.forEach(function(e) {  MONGOOSE.model.remove({"nameEng":e}).exec()});
				  }
				  console.log(toRemove);
   reqBody.map(function(key, index) { 
	   if (req.body[key] && req.body[key].trim().length > 0){
  MONGOOSE.model.update({"nameEng":key}, {$set : {"name":key,"currentTranslation": req.body[key].trim()}, $addToSet: {"translations":{"variant":req.body[key].trim(),"count":1, _id : false, _v: false}}} , { upsert : true }).exec(); 
} else {
	MONGOOSE.model.update({"nameEng":key}, {$set : {"name":key,"currentTranslation": req.body[key].trim()} } , { upsert : true }).exec(); 
	}
});
}
)

}  else if (requestedLanguage === "Sync" || languageList.indexOf(requestedLanguage) > -1) {fn(requestedLanguage)} 
 
});









module.exports = router;
