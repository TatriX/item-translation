var mongoose = require('mongoose');


var invalidScheme = new mongoose.Schema({
    "nameEng": String,
    "translations": [{
        "variant": String,
        "count": Number,
        _id: false
    }],  versionKey: false
},  
           { collection : "Russian" });

var old = mongoose.model("Old",invalidScheme);

var validScheme = new mongoose.Schema({
	"currentTranslation":  String ,
    "nameEng": String,
    "translations": [{
        "variant": String ,
        "count":   Number
    }] 
} );
           
 var current =  mongoose.model("Current",validScheme,"Russian");
 let MongooseScheme = {"current": current, "old": old}
 
 
module.exports = MongooseScheme;
