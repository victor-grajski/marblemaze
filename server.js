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

// check to make sure that the user calls the serial port for the arduino when running the server
if (!process.argv[2] || !process.argv[3] || !process.argv[4] || !process.argv[5]) {
  console.error(`Usage: node ${process.argv[1]} SERIAL_PORT NUM_PLAYERS PLAYER_ONE PLAYER_TWO`);
  process.exit(1);
}

// start the serial port connection and read on newlines
const port = new SerialPort(process.argv[2], { baudRate: 115200 });
const parser = port.pipe(new ParserReadline({
  delimiter: '\r\n'
}));

// Socket setup
const io = socket(server);

// Players array
let users = [];

let ready = false;

let x;
let y;

const BOOSTER_X_LOW = -0.5;
const BOOSTER_X_HIGH = 0.5;
const BOOSTER_Y_LOW = -2.5;
const BOOSTER_Y_HIGH = -2;

const FOAM_X_LOW = -0.5;
const FOAM_X_HIGH = 0.5;
const FOAM_Y_LOW = -2.5;
const FOAM_Y_HIGH = -2;

const map = (value, x1, x2, y1, y2) => (value - x1) * (y2 - y1) / (x2 - x1) + y1;

io.on("connection", (socket) => {
  console.log("Made socket connection", socket.id);

  socket.on("join", (data) => {
    // num players
    // booster seat vs no booster seat
    users.push(data);

    if (users.length === process.argv[3]) {
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
    if (ready) {
      users[data.id] = data;
      playerOne = process.argv[4];
      playerTwo = process.argv[5];

      if (users.length === 1) {
        x = users[0].x;
        y = users[0].y;

        if (playerOne === "booster") {
          x = map(x, BOOSTER_X_LOW, BOOSTER_X_HIGH, 80, 110);
          y = map(y, BOOSTER_Y_LOW, BOOSTER_Y_HIGH, 75, 110);
        } else {
          x = map(x, FOAM_X_LOW, FOAM_X_HIGH, 80, 110);
          y = map(y, FOAM_Y_LOW, FOAM_Y_HIGH, 75, 110);
        }
      }
      if (users.length === 2) {
        x1 = users[0].x;
        y1 = users[0].y;

        x2 = users[1].x;
        y2 = users[1].y;

        if (playerOne === "booster") {
          x1 = map(x1, BOOSTER_X_LOW, BOOSTER_X_HIGH, 80, 110);
          y1 = map(y1, BOOSTER_Y_LOW, BOOSTER_Y_HIGH, 75, 110);
        } else {
          x1 = map(x1, FOAM_X_LOW, FOAM_X_HIGH, 80, 110);
          y1 = map(y1, FOAM_Y_LOW, FOAM_Y_HIGH, 75, 110);
        }

        if (playerTwo === "booster") {
          x2 = map(x2, BOOSTER_X_LOW, BOOSTER_X_HIGH, 80, 110);
          y2 = map(y2, BOOSTER_Y_LOW, BOOSTER_Y_HIGH, 75, 110);
        } else {
          x1 = map(x1, FOAM_X_LOW, FOAM_X_HIGH, 80, 110);
          y1 = map(y1, FOAM_Y_LOW, FOAM_Y_HIGH, 75, 110);
        }
      }

      x = (x1 + x2) / 2;
      y = (y1 + y2) / 2;

      // console.log(`${x}, ${y}`);
      port.write(`<${x}, ${y}>`);
    }
  });

  socket.on("restart", () => {
    users = [];
    io.sockets.emit("restart");
  });
});

// servo controller
ee.on("ready", () => {
  ready = true;
  console.log("ready!");
});

// this is the serial port event handler.
// read the serial data coming from arduino - you must use 'data' as the first argument
// and send it off to the client using a socket message
parser.on('data', function(data) {
  console.log('data:', data);
  io.emit('server-msg', data);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
