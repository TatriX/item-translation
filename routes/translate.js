var createError = require('http-errors');
var express = require('express');
var path = require('path'); 
var router = express.Router(); 
var MONGOOSE = require('./schema');
var mongoose = require('mongoose');

 

router.post('/:eng/:ru/:language', function(req, res, next) {   
	const isExist = req.translations.filter(e=>e.nameEng === req.params.eng); 
	const hasVariant = isExist.length > 0 ? isExist[0].variants.filter(e=>e === req.params.ru) : false;
 
					   const incOrSucc = !hasVariant ? 1 : hasVariant.length < 1 ? 1 : -1; 
	function writeUser() {
		
		if  (isExist.length > 0) {
		
	 if (incOrSucc === -1) {MONGOOSE.user.findOneAndUpdate({"cookie":req.cookies.auth, "translations.nameEng": req.params.eng}, { $pull:{"translations.$.variants" : req.params.ru}},(err,found)=>console.log(err) ); 
	 } else { MONGOOSE.user.findOneAndUpdate({"cookie":req.cookies.auth, "translations.nameEng": req.params.eng}, { $push:{"translations.$.variants" : req.params.ru}},(err,found)=>console.log(err)  )
	   }
					   }
			else {
				console.log('hui');
				
 MONGOOSE.user.findOneAndUpdate({"cookie":req.cookies.auth}, { $push:{"translations" : {"nameEng": req.params.eng, "variants": [req.params.ru]}}  },(err,found)=>console.log(err) );
				
				
				
				}				   
						   
						   
		}
	  let LanguageModel = mongoose.model(req.params.language, MONGOOSE.schema,req.params.language);  
        LanguageModel.find({}, function(err, found) {
            if (err) {
                return console.error(err)
            };
            //Проверка элемента в бд
            const requiredItem = found.find(e=>e.nameEng == req.params.eng);
             if(!requiredItem) {res.json({"Element Not Found":req.params.eng}); next();}
              //Существует ли вариант перевода в бд 
             const variant = requiredItem.translations.find(e=>e.variant == req.params.ru);  
             //Добавить несуществующий вариант перевода
                if (!variant) {
					 LanguageModel.findOneAndUpdate({
                        "nameEng": req.params.eng
                    }, {
                        $push: {
                            "translations": {
                                "variant": req.params.ru,
                                "count": 1
                            }
                        }
                    }, function(err, doc) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        writeUser();
                        return res.json({"variant":"added"});
                    });
					}
					////////////
					//////  Плюс 1 к существующему варианту
					else {   
						if (incOrSucc === -1 && variant.count -1 < 1) {
							 LanguageModel.findOneAndUpdate({
                        "nameEng": req.params.eng
                    }, {
                        $pull: {
                            "translations": {
                                "variant": req.params.ru 
                            }
                        }
                    }, function(err, doc) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        writeUser();
                        return res.json({"variant":"added"});
                    });
							}
					   //
					   else {
						 LanguageModel.findOneAndUpdate({
                        "nameEng": req.params.eng,
                        "translations.variant": req.params.ru
                    }, {
                        $inc: {    
							  "translations.$.count": incOrSucc
                        }
                    }, function(err, doc) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        writeUser();
                        return res.json({"variant":"increased"});
                    });
					}
						
					 
						
						}
						///////
             
        })    
}  



);



module.exports = router;
