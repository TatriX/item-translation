var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router(); 
var Item = require('./schema')
 

router.post('/:eng/:ru', function(req, res, next) { 
        Item.find({
            "nameEng": req.params.eng
        }, function(err, found) {
            if (err) {
                return console.error(err)
            };
            if (found.length < 1) {
                const newValue = new Item({
                    "nameEng": req.params.eng,
                    "translations": [{
                        "variant": req.params.ru,
                        "count": 1
                    }]
                });
                newValue.save(function(err, found) {
                    if (err) return console.error(err);
                    res.json({
                        "WRITTEN": newValue.nameEng
                    });
                });

            } else {
                if (found[0].translations.find(o => o.variant == req.params.ru) === undefined) {
                    Item.findOneAndUpdate({
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
                        return res.send("added");
                    });
                }
            }
        })

     
});



module.exports = router;
