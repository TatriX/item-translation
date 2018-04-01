var mongoose = require('mongoose');


var itemSchema = new mongoose.Schema({
    "nameEng": String,
    "translations": [{
        "variant": String,
        "count": Number,
        _id: false
    }]
}, {
    versionKey: false
});

var Item = mongoose.model('Item', itemSchema);


module.exports = Item;
