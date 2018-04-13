var express = require('express');
var router = express.Router(); 
var MONGOOSE = require('./schema')





//////Вернуть варианты перевода 
router.post('/:specifiedItem',function(req,res,next){
	 MONGOOSE.model.find({"nameEng": req.params.specifiedItem  
                    }  , function(err, found) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        const requestedVariants = found[0].translations; 
                        return res.send(requestedVariants);
                    });
});





module.exports = router;
