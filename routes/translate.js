var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();
var db = mongoose.connect("mongodb://username:password@ds135830.mlab.com:35830/translations");
 var Item = require('./schema')
var defaultList = {
    "Spiced wolf meat": "Волчатина с пряностями",
    "Paprika": "Паприка",
    "Wolf meat": "Волчатина",
    "Dead meat": "Мертвечина",
    "Raw coconut cookies": "Сырое кокосовое печенье", 
    "Coconut cookies": "Кокосовое печенье",  
    "Change character": "Сменить персонажа",  
    "Blacksmith": "Кузнец",  
    "Tailor": "Портной",  
    "Alchemyst": "Алхимик",  
    "Farmer": "Фермер" //
};  
  

router.post('/:eng/:ru', function(req, res, next) {
	 
   if (!defaultList[req.params.eng]) {
	   res.json({"error":"wrong item"})
	   }
	   else { 
		   Item.find({"nameEng":req.params.eng},function (err, found) {
  if (err) {return console.error(err)};
    if (found.length < 1) { 
		const newValue = new Item({ "nameEng": req.params.eng, "translations": [{"variant": req.params.ru, "count": 1}] });
		newValue.save(function (err, found) {
    if (err) return console.error(err); 
    res.json({"WRITTEN":newValue.nameEng});
  });

		} else {  
			if (found[0].translations.find(o=> o.variant == req.params.ru)  === undefined) {
				Item.findOneAndUpdate({"nameEng":req.params.eng},{ $push: {"translations":{"variant": req.params.ru, "count": 1}}}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("added"); 
  }); 
				} 
			}
})
		 
		   }
});



module.exports = router; 
