const GappingOrder = require('../models/GappingOrders');
var gappingOrdersList = ["green", "red", "blue", "white"];
var orderMap = {};
function loadQueues(list) {
    var promise = new Promise(function (resolve, reject) {
        list.forEach(element => {
            GappingOrder.find({ machine: element, completed: false }, { orderId: true, _id: false }, { sort: { time: 1 } }, function (err, data) {
                if (err) return console.log(err);
                else {
                    if (data) {
                        let toArray = [];
                        toArray = data.map(function (tokenObject) { return tokenObject.orderId; });
                        orderMap[element] = toArray;
                    } else {
                        client.publish("UIerrors", "No orders for `element`");
                    }
                }
            });
        });
        resolve(orderMap);
    })
    return promise;
}

module.exports = loadQueues(gappingOrdersList);

