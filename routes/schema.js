var mongoose = require('mongoose');

 
var validSchema = new mongoose.Schema({
	"currentTranslation":  String ,
    "nameEng": String,
    "translations": [new mongoose.Schema({
        "variant": String ,
        "count":   Number 
    },  {_id: false })] 
} );
         
         
     
 var currentModel =  mongoose.model("Current",validSchema,"Russian"); 
 let MONGOOSE = {model: currentModel, schema: validSchema }
 
module.exports = MONGOOSE;
