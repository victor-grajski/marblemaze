// Making Connection
const socket = io();
socket.emit("joined");

let players = []; // All players in the game
let currentPlayer; // Player object for individual players

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

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener("devicemotion", event => {
                        players[currentPlayer.id].x = Math.round(event.accelerationIncludingGravity.x * (10 ^ 2)) / (10 ^ 2);
                        players[currentPlayer.id].y = Math.round(event.accelerationIncludingGravity.y * (10 ^ 2)) / (10 ^ 2);

                        currentPlayer.x = Math.round(event.accelerationIncludingGravity.x * (10 ^ 2)) / (10 ^ 2);
                        currentPlayer.y = Math.round(event.accelerationIncludingGravity.y * (10 ^ 2)) / (10 ^ 2);

                        socket.emit("phonemove", currentPlayer);

                        
                        document.getElementById("current-player-x").innerHTML = `X: ${players[currentPlayer.id].x}`;
                        document.getElementById("current-player-y").innerHTML = `Y: ${players[currentPlayer.id].y}`;
                    });
                }
            })
            .catch(console.error);
    } else {

    }
});

// socket events
socket.on("join", (data) => {
    players.push(new Player(data.id, data.x, data.y));

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
      players.push(new Player(index, player.x, player.y));
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
