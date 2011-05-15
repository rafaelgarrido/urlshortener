var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Url = new Schema({
    id          : ObjectId
   ,key         : { type: String, index: { unique: true } }
   ,url         : String
   ,hits        : { type: Number, index: true }
   ,malicious   : Boolean
   ,createdDate : { type: Date, default: Date.now }
});

Url.pre('save', function(next) {
    if (!this.key) {
       this.key = 'ABCD';
    } else {
       this.hits.increment();
       console.log('should be incremented!');
     }
    // error - next(new Error('Unable to generate key'));
    next();
});

exports.Model = function(db) {
    return db.model('Url');
};

mongoose.model('Url', Url);
