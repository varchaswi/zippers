var GappingOrder = require('../models/GappingOrders');
var moment = require('moment');
const { roleopenLogger, ordersLogger, redLogger, blueLogger, greenLogger, whiteLogger } = require('../outputs/output');

module.exports = {

    dump_events_to_excel: function (data) {
        let event = JSON.parse(data);
        GappingOrder.findOne({ machine: event.machine, completed: false }, 'orderId pcs', { sort: { time: 1 } }, function (err, db_res) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                if (db_res) {
                    let csv = "";
                    csv += db_res.orderId + ",";
                    csv += event.machine + ",";
                    csv += db_res.pcs + ",";
                    csv += event.issue;
                    if (event.issue === "JOINT") {
                        csv += event.length;
                    }
                    ordersLogger.info(csv)
                } else {
                    client.publish("UIerror", "No green orders");
                }
            }
        });
    },
    addEvent: function (body, issue,client) {
        var data = JSON.parse(body);
        var json = {};
        json.rollNo = data.rollNo;
        json.joint = data.joint;
        if (data.rollNo === data.orderSize) {
            GappingOrder.findOneAndUpdate({ orderId: data.orderID },
                {
                        status: 'RUNNING',
                        prevState: JSON.stringify(json),
                       // time: new Date().getTime()
                }, {new:true},function (err,doc) {
                    if (err) {
                        console.error(err.message);
                    }
                });
        }
        else if (data.rollNo === 1) {
            GappingOrder.findOneAndUpdate({ orderId: data.orderID },
                {
                    
                        status: "RUNNING",
                        prevState: JSON.stringify(json)
                    
                },{new:true}, function (err,doc) {
                    if (err) {
                        console.error(err.message);
                    }
                });
        } else {
            GappingOrder.findOneAndUpdate({ orderId: data.orderID },
                {
                
                        prevState: JSON.stringify(json)
                    
                },{new:true}, function (err,doc) {
                    if(err){
                    console.error(err);}
                });
        }
        data.issue = issue;
        let csv = '';
        try {
            csv = "";
            csv += data.orderID + ",";
            csv += data.issue + ",";
            csv += data.rollNo + ",";
            csv += data.joint + ","
            csv += data.workerName
            roleopenLogger.info(csv);
        } catch (err) {
            console.error(err);
        }

    },

    addHold: function (body, stage, issue, machine) {
        var data = JSON.parse(body);
        var roStage = stage;
        var json = {};
        json.rollNo = data.rollNo;
        json.joint = data.joint;
        data.machine = machine;
        data.createdOn = moment();
        Order.updateOne({ orderID: data.orderID },
            {
                $set: {
                    state: stage,
                    prevState: JSON.stringify(json)
                }
            }, function (err) {
                console.log(err);
            });
        data.orderStage = roStage;
        data.issue = issue;
        let csv = '';
        try {
            data.createdOn = moment().format('DD-MM-YYYY HH:mm:ss');
            csv = parser.parse(data);
            roleopenLogger.info(csv);
        } catch (err) {
            console.error(err);
        }

    },
    updateROMqttOrder: function (data) {
        var json = JSON.parse(data);
        json.status = 'GAPPING';
        GappingOrder.findOneAndUpdate({ orderId: json.orderID }, {rodamage:json.damage,machine:json.machine,time:new Date().getTime(),status:"GAPPING"},
            {
                new: true,
                projections: {
                    _id: false,prevState:true
                }
            }, function (err, doc) {
                if (err) {
                    console.log("check please");
                }
                if (doc) {
                    var pjs = JSON.parse(doc.prevState);
                    let csv = '';
                    csv += json.orderID + ",";
                    csv += "DONE" + ",";
                    csv += pjs.rollNo + ",";
                    csv += pjs.joint + ","
                    csv += json.workerName +","
                    csv += json.damage+","
                    csv += json.machine
                    roleopenLogger.info(csv);
                    try {
                    } catch (err) {
                        console.error(err);
                    }
                }
            })
    }
}