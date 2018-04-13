var express = require('express');
var router = express.Router(); 
var MONGOOSE = require('./schema')


 
router.get('/', function(req, res, next) {  
    MONGOOSE.model.find({}, function(err, found) {
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
