const mongoose = require('mongoose');
const moment = require("moment");
const CounterModel = require('./counter');
Schema = mongoose.Schema;
var GappingOrderSchema = new Schema({
    orderId: { type: String, unique: true, required: true },
    machine: { type: String },
    rodamage: { type: Number },
    time: {
        type: Number
    },
    orderSize:{type:Number},
    color: { type: String },
    prevState: { type: String },
    pcs: { type: Number, default: 0 },
    pcsSize: { type: Number },
    pcsRequired: { type: Number },
    status: { type: String, enum: ['GAPPING', 'IN PROGRESS', 'OPEN', 'HOLD', 'DONE'], default: 'OPEN' },
    completed: { type: Boolean, default: false },
    updated_at: { type: Date, default: Date.now },
    seqNo: { type: Number}
});

GappingOrderSchema.pre('save', function (next) {
    var doc = this;
    console.log("freaking hai");
    CounterModel.findByIdAndUpdate(
        { _id: 'orders' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            console.error(error.stack);
            return next(error);
        }else{
            console.log({counter:counter});
        doc.seqNo = counter.seq;
        doc.time = new Date().getTime();
        next();}
    });
});


module.exports  = mongoose.model('GappingOrder', GappingOrderSchema)

