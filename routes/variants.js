var express = require('express');
var router = express.Router(); 
var MONGOOSE = require('./schema');
var mongoose = require('mongoose');





//////Вернуть варианты перевода 
router.post('/:specifiedItem/:language',function(req,res,next){
	  let LanguageModel = mongoose.model(req.params.language, MONGOOSE.schema,req.params.language); 
	  console.log('got');  
	 LanguageModel.find({"nameEng": req.params.specifiedItem  
                    }  , function(err, found) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        const requestedVariants = found[0].translations; 
                        return res.send(requestedVariants);
                    });
});





module.exports = router;
