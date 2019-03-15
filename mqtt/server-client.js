var mqtt = require('mqtt'); 
var gappingController = require("../controllers/GappingMachine");
var excellController = require("../controllers/excellController");
var settingsController = require("../controllers/settingsController");
var Topic = '#'; //subscribe to all topics
var Broker_URL = 'mqtt://localhost';
//var Database_URL = '192.168.1.123';

var options = {
    clientId: 'MyMQTT',
    port: 1883,
    //username: 'mqtt_user',
    //password: 'mqtt_password',	
    keepalive: 60
};

var client = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
    //console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
};

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) { console.log(err); }
};

function mqtt_reconnect(err) {
    //console.log("Reconnect MQTT");
    //if (err) {console.log(err);}
    client = mqtt.connect(Broker_URL, options);
};

function mqtt_error(err) {
    //console.log("Error!");
    //if (err) {console.log(err);}
};

function after_publish() {
    //do nothing
};

function mqtt_messsageReceived(topic, message, packet) {
    var message_str = message.toString(); //convert byte array to string
    message_str = message_str.replace(/\n$/, ''); //remove new line
    if(topic === "pcs"){
        json = JSON.parse(message_str)
        gappingController.pcs_count(json.machine);
    }
    if(topic === "gappingOrders"){
        excellController.pickup_gapping_orders(client);
    }
    if(topic === "gappingNext"){
        gappingController.set_next(client,message_str);
    }
    if(topic === "event"){
        excellController.dump_events_to_excel(message_str)
    }if(topic === "rfid"){
        excellController.dump_rfid_to_excel(message_str,client);
    }if(topic === "settings/rfid"){
        settingsController.update_rfid(client) 
    }

};

function mqtt_close() {
    //console.log("Close MQTT");
};

module.exports = client;




