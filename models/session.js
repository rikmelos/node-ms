/*var mongoose    =   require("mongoose");
//mongoose.connect('mongodb://mongodb:27017/MDB');
var mongoSchema =   mongoose.Schema;
var sessionSchema  = {
    "email" : String,
    "sessionToken" : String
};
module.exports = mongoose.model('userSession',sessionSchema);;
*/




var mongoose    =   require('mongoose');
mongoose.Promise = global.Promise;

var sessiondb = mongoose.connect('mongodb://mongodb:27017/MDB');
//var sessiondb = mongoose.createConnection('mongodb://mongodbhost:27017/MDB');

var mongoSchema =   sessiondb.Schema;
var sessionSchema  = {
    "email" : String,
    "sessionToken" : String
};






module.exports = sessiondb.model('userSession',sessionSchema);
