var createError = require('http-errors');
var express = require('express');
var path = require('path'); 
var router = express.Router(); 
var MONGOOSE = require('./schema');
var mongoose = require('mongoose');

 

router.post('/:eng/:ru/:language', function(req, res, next) {  
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
                        return res.json({"variant":"added"});
                    });
					}
					////////////
					//////  Плюс 1 к существующему варианту
					else {
						 LanguageModel.findOneAndUpdate({
                        "nameEng": req.params.eng,
                        "translations.variant": req.params.ru
                    }, {
                        $inc: {    
							  "translations.$.count": 1
                        }
                    }, function(err, doc) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        return res.json({"variant":"increased"});
                    });
						}
						///////
             
        })    
}  



);



module.exports = router;
