/*jshint node:true*/

var express = require("express");
var bodyParser = require('body-parser');
var apiv1 = require('./routes/apiv1.js');
var EJS = require('ejs');

var Logger = require('logdna');
var options = {
    hostname: myHostname,
    ip: ipAddress,
    mac: macAddress,
    app: appName,
    env: envName
};
apikey= "9b631129805c57c9b36a14471dbd35f2";

// Defaults to false, when true ensures meta object will be searchable
options.index_meta = true;

// Add tags in array or comma-separated string format:
options.tags = ['logging', 'nodejs', 'logdna'];
// or:
options.tags = 'logging,nodejs,logdna';

// Define a singleton instance
var logger = Logger.setupDefaultLogger(apikey, options);

// Create multiple loggers with different options
var logger = Logger.createLogger(apikey, options);

EJS.open = "<ejs>";
EJS.close = "</ejs>";

var host = process.env.PORT ? '0.0.0.0' : 'localhost';
var port = (process.env.PORT || 3456);
var url = require('url').format({hostname: host, port: port, protocol: 'http'});

var app = express();
app.use(express.static('static'));
app.set('view engine', 'ejs');

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/api/v1/', apiv1.router);

var http = require('http');
var server = http.createServer(app);
server.listen(port, function () {
    console.log('Weather Report listening on ' + url);
});

app.get("/", function(req, res) {
    return res.render('main');
});
