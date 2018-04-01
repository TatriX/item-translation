var express = require('express');
var router = express.Router();

var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();
var db = mongoose.connect("mongodb://username:password@ds135830.mlab.com:35830/translations");
 
 var Item = require('./schema')



router.get('/', function(req, res, next) {
Item.find({},function (err, found) {
  if (err) {return console.error(err)};
  res.send(found)
}); 
});


module.exports = router;
