var express = require('express');
var router = express.Router(); 
var MONGOOSE = require('./schema');
const mongoose = require('mongoose');

 
router.get('/:lang', function(req, res, next) {  
	let langModel = mongoose.model(req.params.lang,MONGOOSE.schema,req.params.lang);
    langModel.find({}, function(err, found) {
        if (err) {
            return console.error(err)
        }; 
          const json = JSON.stringify(
      found
    );
        const buf = Buffer.from(json); 
res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': 'attachment; filename=dist.json'
    });
res.write(buf);
    res.end();

    });  
 

 
});

module.exports = router;
