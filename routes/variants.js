var express = require('express');
var router = express.Router(); 
var MONGOOSE = require('./schema');
var mongoose = require('mongoose');





//////Вернуть варианты перевода 
router.post('/:specifiedItem/:language',function(req,res,next){
	  let LanguageModel = mongoose.model(req.params.language, MONGOOSE.schema,req.params.language);  
	 LanguageModel.find({"nameEng": req.params.specifiedItem  
                    }  , function(err, found) {
                        if (err) return res.send(500, {
                            error: err
                        });  
                        const isSubmitedElement =  req.translations.filter(e=>e.nameEng === req.params.specifiedItem)[0];
                        const alreadySubmited = isSubmitedElement ? isSubmitedElement.variants : [];
                        const requestedVariants = found[0].translations; 
                        const mapped = requestedVariants.map(e=> alreadySubmited.indexOf(e.variant) > -1 ?  ({variant:e.variant,count:e.count,submited:true}) :  ({variant:e.variant,count:e.count,submited:false})  );
                       
                        return res.send(mapped);
                    });
});





module.exports = router;
