var mongoose    =   require('mongoose');
mongoose.Promise = global.Promise;
exports.database    =   mongoose.createConnection('mongodb://mongodbhost:27017/MDB');
