// Making Connection
const socket = io.connect("http://localhost:3000");
socket.emit("joined");

let players = []; // All players in the game
let currentPlayer; // Player object for individual players
let numPlayers = 0;

class Player {
    constructor(id, x, y) {
      this.id = id;
      this.x = x;
      this.y = y;
    }
}

document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("start-btn").hidden = true;
    currentPlayer = new Player(players.length, 0, 0);
    document.getElementById(
      "current-player"
    ).innerHTML = `<p>Anyone can roll</p>`;
    socket.emit("join", currentPlayer);

    numPlayers++;
  });


// Listen for events
socket.on("join", (data) => {
    players.push(new Player(players.length, data.x, data.y));
});