var mongoose = require('mongoose');

 
var validSchema = new mongoose.Schema({
	"currentTranslation":  String ,
    "nameEng": String,
    "translations": [new mongoose.Schema({
        "variant": String ,
        "count":   Number 
    },  {_id: false })] 
} );
         
var UserSchema = new mongoose.Schema({
	login: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      secret: {
        type: String,
        required: true
      },
      cookie: String,
      translations: [new mongoose.Schema({
		nameEng: String,
		variants: [] 
		  })] 
	});  
     
 var currentModel =  mongoose.model("Current",validSchema,"Russian"); 
 var User = mongoose.model("User",UserSchema,"Users");
 let MONGOOSE = {model: currentModel, schema: validSchema, user: User}
 
module.exports = MONGOOSE;
