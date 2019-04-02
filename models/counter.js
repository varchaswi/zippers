const mongoose = require('mongoose')


Schema = mongoose.Schema;
var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 1 }
});

module.exports = mongoose.model('Counter',CounterSchema);  
