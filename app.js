
var cfenv = require('cfenv');
var bodyParser = require('body-parser');

var express = require('express');

var socketCtrl = require('./controller/sockeCtrl');
var kafkaCtrl = require('./controller/kafkaCtrl');
var cloudantCtrl = require('./controller/cloudantCtrl');

// create a new express server
var app = module.exports = express.createServer();

app.use(bodyParser.json());

var io = require('socket.io').listen(app);


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
    if (req.method.match(/get/i)) {
        // Set header for prevent caching
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

        res.setHeader("Pragma", "no-cache");

        res.setHeader("Expires", 0);
    }
    next();
});



kafkaCtrl.initKafka();
cloudantCtrl.initDBConnection();

//create lamps list
//var lampCtrl = require('./controller/lampCtrl');
//lampCtrl.createLamps();

var appEnv = cfenv.getAppEnv();


io.sockets.on('connection', function (socket) {
    socketCtrl.setSocket(socket);
});

app.use(express.static(__dirname + '/public'));
require('./routes/route')(app);
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});

