const mongoose = require('mongoose');
const moment = require("moment")
Schema = mongoose.Schema;

const GappingOrderSchema = new Schema({
    orderId:{type:String,unique:true, required : true},
    time:{ 
        type:Number,required:true
    },
    pcs:{type:Number,default:0},
    machine:{type:String},
    status:{type: String, enum: ['DONE','IN PROGRESS','OPEN','HOLD'],default:'OPEN' },
    completed: {type :Boolean,default:false},
    updated_at: { type: Date, default: Date.now },
});

const GappingOrderModel = mongoose.model('GappingOrder' , GappingOrderSchema)
module.exports = GappingOrderModel;
 
function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}