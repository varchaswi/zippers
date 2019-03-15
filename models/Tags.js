const mongoose = require('mongoose')
, moment = require('moment');
//const counter = require('./Counter');

Schema = mongoose.Schema;

const TagsSchema = new Schema({
    tagID:{ type: String, required: true, unique: true },
    tagType:{type:String, enum:["M","S","E","A"],required:true, default:"E"},
    passType:{type:String,enum:["IN","OUT"],required:true},
    assignedTo:{type:String},
    machineCode:{type:String},
    lastState:{type:Boolean,default:false},
    createdOn :{type:Date,default:moment()},
    isExpired:{type:Boolean,default:false},
    validTill:{type:Date,default:moment().add(1,'year')},
    seqNo:{type:Number}
    });

  /*  TagsSchema.pre('save', function(next) {
        var doc = this;
        counter.findByIdAndUpdate({_id: 'tags'}, {$inc: { seq: 1} }, function(error, counter)   {
            if(error)
                return next(error);
            doc.seqNo = counter.seq;
            next();
        });
    });
*/
module.exports = mongoose.model('Tags',TagsSchema);    