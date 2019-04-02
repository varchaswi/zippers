var Counter = require('../models/counter');

module.exports = {
    setCounter:function(name){
       let counter = new Counter({_id:name});
       counter.save(function(err){
           if(err) console.error(err.stack);
       })
    }
}