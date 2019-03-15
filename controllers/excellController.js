'use strict';
//var Orders = require('../models/Order');
var moment = require('moment');
var jsonexport = require("jsonexport");
const GappingOrder = require('../models/GappingOrders');
const EventModel = require('../models/Events');
const Tags = require('../models/Tags');
const Json2csvParser = require('json2csv').Parser;
const roOrderFields = ["from", "startedAt", "finishedAt", "orderID", "workerName", "issue", "damage", "machine"];
const eventFields = ["issue", "from", "for", "at", "pcs"];
const eventOpts = { eventFields, header: false };
const eventParser = new Json2csvParser(eventOpts);
const rfidFields = ["inout", "from", "for", "at", "pcs", "worker"];
const rfidOpts = { rfidFields, header: false };
const rfidParser = new Json2csvParser(rfidOpts);
const roOpts = { roOrderFields, header: false, excelStrings: true };
const roOrderparser = new Json2csvParser(roOpts);

const excelToJson = require('convert-excel-to-json');
//const client = require('../mqtt/server-client');

var fs = require("fs"),
    path = require('path');
//  path.join(__dirname, '../inputs/TODAY.xlsx');
const filePath = '../inputs/TODAY.xlsx';
const gappingOrdersfile = '../inputs/GAPPING_ORDERS.xlsx';
const { roleopenLogger, ordersLogger, diagnosticsLogger, redLogger, blueLogger, greenLogger, whiteLogger } = require('../outputs/output');

module.exports = {
    dump_events_to_excel: function (data) {
        let event = JSON.parse(data);
        GappingOrder.findOne({ machine: event.machine, completed: false },'orderId pcs', { sort: { time: 1 } }, function (err, db_res) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                if (db_res) {
                            let csv = "";
                            csv += db_res.orderId + ",";
                            csv += event.machine + ",";
                            csv += db_res.pcs+",";
                            csv += event.issue;
                            if(event.issue === "JOINT"){
                                csv += event.length;
                            }
                            ordersLogger.info(csv)
                } else {
                    client.publish("UIerror", "No green orders");
                }
            }
        });
    },
    dump_rfid_to_excel: function (data, client, ) {
        let event = JSON.parse(data);
        GappingOrder.findOne({ machine: event.machine, completed: false },'orderId pcs', { sort: { time: 1 } }, function (err, db_res) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                if (db_res) {
                    Tags.findOne({ tagID: event.ID }, { assignedTo: true, lastState: true, _id: true }, function (err, res) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (res) {
                            let csv = "";
                            csv += db_res.orderId + ",";
                            csv += event.machine + ",";
                            csv += db_res.pcs+",";
                            csv += res.lastState ? "OUT" : "IN";
                            res.lastState = !res.lastState;
                            res.save(function (err, doc) {
                                if (err) {
                                    return console.log(err);           
                                }
                            })
                            csv += "," + res.assignedTo;
                            ordersLogger.info(csv)
                        } else {
                            client.publish("UIerror", "no such card ");
                        }
                    })
                } else {
                    client.publish("UIerror", "No green orders");
                }
            }
        });
    },
    pickup_gapping_orders: function (client) {
        if (!fs.existsSync(gappingOrdersfile)) {
            client.publish("UIerror", "no file");
            return
        }
        const result = excelToJson({
            sourceFile: gappingOrdersfile,
            sheets: [{
                name: "Sheet1",
                columnToKey: {
                    A: 'orderId',
                    B: 'machine'
                }
            }]
        });
        fs.unlinkSync(gappingOrdersfile);
        result["Sheet1"].forEach((element, index) => {
            setTimeout(function () {
                let gappingOrder = new GappingOrder(element);
                gappingOrder.time = new Date().getTime();
                gappingOrder.save(function (err) {
                    if (err) {
                        if (err.name === 'MongoError' && err.code === 11000) {
                            client.publish('UIerrors', 'Duplicate Order ' + element.orderId);
                        } else {
                            client.publish('UIerrors', err.name + " " + err.code);
                        }
                    }
                })
            }, 5 * index)
        });
    }
}