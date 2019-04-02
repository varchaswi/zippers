var Tags = require('../models/Tags');
var moment = require('moment');

module.exports = {

    getDetails: function (req, res, next) {
        
        Tags.findOne({ tagID: req.body.tagID }, { tagType: true, isExpired: true, validTill: true,assignedTo:true }, function (err, data) {
            if (err) { return res.json(500, { message: 'Unable to process request' }) }
            if (data) {
                return res.json({ message: "valid", data });
            } else {
                return res.json({ message: "invalid" })
            }
        })
    },
    addTag: function (req, res, next) {
        let tag = new Tags(req.body);
        tag.save(function (err) {
            if (err) {
                if (err.code === 11000) {
                    return res.json(409, { message: 'tag exists' })
                }
                else {
                    return res.json(400, { message: err.message })
                }
            }
            else {
                return res.json({ message: 'tag added' });
            }
        });

    },
    removeTag: function (req, res, next) {
        Tags.findOneAndUpdate({ tagID: req.body.tagID }, {isExpired:true,validTill:moment()}, function (err, data) {
            if (err) {
                return res.json({ message: 'update failed', code: 0 });
            }
            return res.json({ message: 'updated', code: 1 })
        })
    }, getOne: function (req, res, next) {
        Tags.findOne({ tagID: res.tagID }, function (err, data) {
            if (err) {
                console.log({ error: err.message });
                res.json({ message: 'remove failed' })
            } else {
                if (data) {
                    res.json(data);
                }
                else {
                    res.json({ message: 'not found' });
                }
            }
        })
    },
    getAll: function (req, res, next) {
        Tags.find({}, function (err, tags) {
            if (err) {
                return res.json({ message: 'failed to fetch', code: 0 })
            }
            return res.json(tags);
        })

    },
    updateOne: function (req, res, next) {
        Tags.findOneAndUpdate({ tagID: req.body.tagID }, req.body,{upsert:true} ,function (err, data) {
            if (err) {
                console.log(err.message);
                return res.json({ message: 'update failed', code: 0 });
            }
            return res.json({ message: 'updated', code: 1 })
        })
    },
    getWorker:function(ID,client){
        Tags.findOne({tagID:ID},{assignedTo:true,_id:false},function(err,data){
            if(err){
                console.log(err);
            }
            if(data){
                client.publish("rollopen/setWorkerDetails", JSON.stringify(data))
            }else {
                client.publish("rollopen/invalid"," ");
            }
        })
        
    }
};