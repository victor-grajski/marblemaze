const express = require("express");
const socket = require("socket.io");
const http = require("http");

const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);

const SerialPort = require('serialport');	// serial library
const ParserReadline = require('@serialport/parser-readline')

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Set static folder
app.use(express.static("public"));

// check to make sure that the user calls the serial port for the arduino when
// running the server
if(!process.argv[2]) {
  console.error('Usage: node ' + process.argv[1] + ' SERIAL_PORT');
  process.exit(1);
}

// start the serial port connection and read on newlines
const port = new SerialPort(process.argv[2]);
const parser = port.pipe(new ParserReadline({
  delimiter: '\r\n'
}));

// Socket setup
const io = socket(server);

// Players array
let users = [];

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

io.on("connection", (socket) => {
  console.log("Made socket connection", socket.id);

  socket.on("join", (data) => {
    users.push(data);

    if (users.length === 2) {
      readline.question(`Ready to start? (y/n)`, response => {
        if (response === 'y') {
          ee.emit("ready");
        } else {
          ee.emit("notready");
        }
  
        readline.close()
      })
    }

    io.sockets.emit("join", data);
  });

  socket.on("joined", () => {
    socket.emit("joined", users);
  });

  socket.on("phonemove", data => {
    // console.log(data);
  });

  socket.on("restart", () => {
    users = [];
    io.sockets.emit("restart");
  });
});

// servo controller
ee.on("ready", () => {
  console.log("ready!");

  x = (users[0].x + users[1].x) / 2;
  x = map(x, -10, 0, 10, 180);
  console.log(x);

  y = (users[0].y + users[1].y) / 2;
  y = map(y, -10, 0, 10, 180);
  console.log(y);

  // port.write(x);
  // port.write(y);
});

// this is the serial port event handler.
// read the serial data coming from arduino - you must use 'data' as the first argument
// and send it off to the client using a socket message
// parser.on('data', function(data) {
//   console.log('data:', data);
//   io.emit('server-msg', data);
// });

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
