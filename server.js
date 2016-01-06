var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var elasticsearch = require('elasticsearch');
var bodyParser = require("body-parser");

/*
  Setup delle variabili prese dall'environment
*/
var server_port = 8080;
var server_ip_address = '127.0.0.1';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

var socketCount = 0;

// CONNESSIONE AL SERVER
http.listen(server_port, server_ip_address, function () {
    console.log("Example app listening at http://%s:%s", server_ip_address, server_port);
});

var client = new elasticsearch.Client({
  host: 'http://elastic-insquare.rhcloud.com',
  log: 'trace'
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity,
  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

router.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket,req,res) {
  console.log('a user connected');
  socketCount++;
  io.emit('users connected', socketCount);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    client.create({
      index: 'message',
      type: 'messages',
      body: {
        text: msg,
        user: '',
        square:"Roma",
        timestamp: new Date()
      }
    });
  });
  socket.on('disconnect', function() {
    socketCount--;
    io.emit('users connected', socketCount)
    console.log('user disconnected');
  });
});

/*
    POST request per l'invio di un messaggio
    prende dalla query 'numericid' e 'message', connette al db, crea la query, la svolge restituendo un errore o la conferma
*/
router.post('/inviaMessaggio', function(req,res) {
    console.log("richiesta di invio di un messaggio");
    var message = req.query.message;

    connection.query(query, function(error) {
        if (error) {
            res.send(error);
        } else {
            var response = vsprintf('inserito messaggio: %s', [message]);
            res.send(response);
        }
    });
});

router.get('/getMessageHistory', function(req,res) {
  console.log("chiamata a getMessageHistory");
  client.search({
    index: 'message',
    type: 'messages',
    body: {
      query: {
        match_all:{}
      }
    }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.send(resp);
    }, function (err) {
      console.trace(err.message);
      res.send(err);
    });
});

/*
    GET request per ottenere i messaggi nella table
*/
router.get('/messages', function(req,res) {
    console.log("chiamata a getMessaggi");
    client.search({
      index: 'message',
      type: 'messages',
      body: {
        query: {
          match_all:{}
        }
      }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.send(resp);
    }, function (err) {
      console.trace(err.message);
      res.send(err);
    });
});
