var express = require('express');
var router = express.Router(); 
var MongooseScheme = require('./schema')





//////Вернуть варианты перевода 
router.post('/:specifiedItem',function(req,res,next){
	 MongooseScheme.current.find({"nameEng": req.params.specifiedItem  
                    }  , function(err, found) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        const requestedVariants = found[0].translations; 
                        return res.send(requestedVariants);
                    });
});





module.exports = router;
