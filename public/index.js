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
    socket.emit("join", currentPlayer);
  });


// Listen for events
socket.on("join", (data) => {
    players.push(new Player(players.length, data.x, data.y));


    playersHTML = "";
    players.forEach((player) => {
        console.log(player);
        playersHTML += `<tr><td>${player.id}</td>`;
    });
    document.getElementById("players-table").innerHTML = playersHTML;
});

socket.on("joined", (data) => {
    playersHTML = "";
    data.forEach((player, index) => {
      players.push(new Player(index, player.name, player.pos, player.img));
      console.log(player);
      playersHTML += `<tr><td>${player.id}</td>`;
    });
    document.getElementById("players-table").innerHTML = playersHTML;

  });

// Logic to restart the game
document.getElementById("restart-btn").addEventListener("click", () => {
    socket.emit("restart");
});

socket.on("restart", () => {
    window.location.reload();
});
