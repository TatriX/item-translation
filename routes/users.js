 var express = require('express');
var router = express.Router(); 
var Item = require('./schema')



 // Вернуть полный список, если ничего не выбрано 
router.get('/', function(req, res, next) {  
    Item.find({}, function(err, found) {
        if (err) {
            return console.error(err)
        };
        res.send(found)
    });  
 

 
});
 /////

//////Вернуть варианты перевода 
router.post('/:specifiedItem',function(req,res,next){
	 Item.find({"nameEng": req.params.specifiedItem  
                    }  , function(err, found) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        const requestedVariants = found[0].translations;
                        console.log(requestedVariants.map(e=>e.count)); 
                        return res.send(requestedVariants);
                    });
});

module.exports = router;
