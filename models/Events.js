const mongoose = require('mongoose'),

Schema = mongoose.Schema;

const EventSchema = new Schema({
    issue:{type:String,required:true},
    from:{ type:String},
    for:{type:String},
    at:{type:Date,default:Date.now},
    pcs:{type:Number,default:0}
});

const EventModel = mongoose.model('Event' , EventSchema)
module.exports = EventModel;

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}