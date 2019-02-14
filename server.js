var http = require('http');
var express = require('express');

var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');

var app = express();
app.use(express.static('public'));
var server = http.createServer(app);

var backend = new ShareDB();
var connection = backend.connect();

var doc = connection.get('examples', 'randomABC');
doc.fetch(function(err) {
  if (err) throw err;
  if (doc.type === null) {
    doc.create({ content: '' });
    return;
  }
});

// Connect any incoming WebSocket connection to ShareDB
var wss = new WebSocket.Server({server: server});
wss.on('connection', function(ws, req) {
  var stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

server.listen(7873);
console.log('Listening on http://localhost:7873');
