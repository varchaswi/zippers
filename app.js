require('dotenv').config();

const express = require('express'),

    app = express(),
    path = require('path');
    broker = require('./mqtt/broker');
    serverclient = require('./mqtt/server-client');
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Agenda = require('agenda'),
 //   agenda = require('./app/agenda'),
 //   Agendash = require('agendash'),
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const db = mongoose.connect(process.env.DB_URI);
const conn = mongoose.connection;
conn.on('error', console.log.bind(console, '**Could not connect to MongoDB. Please ensure mongod is running and restart MEAN app.**\n'));

orderMap = require('./orders/oqueue');
orderMap.then(function(result){
    console.log(result);
})

//app.use('/dash', Agendash(agenda));

app.listen(port, () => {
    console.error(`App is  on http://localhost:${port}`);
});
