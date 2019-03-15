const GappingOrder = require('../models/GappingOrders');
const { roleopenLogger, ordersLogger, diagnosticsLogger, redLogger, blueLogger, greenLogger, whiteLogger } = require('../outputs/output');

module.exports = {
    pcs_count: function (machineCode) {
        GappingOrder.findOneAndUpdate({ machine: machineCode, completed: false }, { $inc: { pcs: 1 } }, { sort: { time: 1 } }, function (err, db_res) {
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
        GappingOrder.findOneAndUpdate({ machine: json.machine, completed: false }, { $set: { completed: true } }, { sort: { time: 1 } }, function (err, db_res) {
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
        GappingOrder.findOne({ machine: machineCode, completed: false }, 'orderId', { sort: { time: 1 } }, function (err, data) {
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