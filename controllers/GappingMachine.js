const GappingOrder = require('../models/GappingOrders');
const { roleopenLogger, ordersLogger, diagnosticsLogger, redLogger, blueLogger, greenLogger, whiteLogger } = require('../outputs/output');

module.exports = {
    get_ro_next:function(client,seqNo){
        var sequence = parseInt(seqNo);
        var types = [];
        types.push('RUNNING');
        types.push('HOLD');
        types.push('OPEN');

        GappingOrder.findOne({ status: { $in: types }, seqNo: { $gt: sequence } },
            {orderId:true,prevState:true,_id:false,seqNo:true,orderSize:true},
            { "sort": "time" },
            function (err, data) {
                if (data) {
                    var send = data.toObject();
                    if (data.prevState) {
                        var json = JSON.parse(data.prevState);
                        send.rollNo = json.rollNo || 0;
                        send.joint = json.joint || 0;
                    }
                    delete send['prevState'];
                    client.publish("rollopen/setOrderDetails", JSON.stringify(send))
                } if (!data) {
                    if (sequence > 0) {
                        client.publish("rollopen/setSeq", "0");
                    } else {
                        client.publish("rollopen/noOrders", "");
                    }
                }
            })
    },
    pcs_count: function (machineCode) {
        GappingOrder.findOneAndUpdate({ machine: machineCode, completed: false,status:"GAPPING" }, { $inc: { pcs: 1 } }, { sort: { time: 1 } }, function (err, db_res) {
            if (err) {
                throw err;
            }
            else {
                /*let dataString = "";
                dataString += "PCS,";
                dataString += db_res.orderId;
                switch (machineCode) {
                    case "green":
                        greenLogger.info(dataString)

                        break;
                    case "white":
                        whiteLogger.info(dataString)

                        break;
                    case "blue":
                        blueLogger.info(dataString)

                        break;
                    case "red":
                        redLogger.info(dataString)

                        break;

                    default:
                        break;*/
                
            }
        });

    },
    set_next: function (client,msg) {
        let json = JSON.parse(msg);
        GappingOrder.findOneAndUpdate({ machine: json.machine, completed: false,status:"GAPPING" }, { $set: { completed: true } }, { sort: { time: 1 } }, function (err, db_res) {
            if (err) {
                throw err;
            }
            else {
                let dataString = "";
                dataString+=db_res.orderId+",";
                dataString+=db_res.machine+",";
                dataString+=db_res.pcs+",";
                dataString+="NEXT ORDER";
                ordersLogger.info(dataString);
            }
        })

    },
    get_gapping_orders: function (client, machineCode) {
        GappingOrder.findOne({ machine: machineCode, completed: false,status:"GAPPING" }, 'orderId', { sort: { time: 1 } }, function (err, data) {
            if (err) return console.log(err);
            else {
                if (data) {
                    client.publish("greenOrders", data.orderId);
                } else {
                    client.publish("greenNoOrders", "");
                }
            }
        });
    },
}