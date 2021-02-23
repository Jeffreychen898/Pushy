const express = require("express");
const app = express();
const socket = require("socket.io");
const PORT = 8080;

let server = app.listen(PORT, () => {
  console.log(PORT);
});

app.use("/game", express.static("game"));
app.get("/", (req, res) => {
  res.redirect("/game");
})

let playerDB = [];

let io = socket(server);
io.sockets.on("connection", (client) => {

  let id = client.id;

  newClient(client)

  client.on("position", (data) => {
    //updating
    for(let i=0;i<playerDB.length;i++) {
      if(playerDB[i].id == data.id) {
        playerDB[i].x = data.x;
        playerDB[i].y = data.y;
      }
    }
    //broadcast
    client.broadcast.emit("new_position_data", playerDB);
  })
  client.on("disconnect", () => {
    for(let i=0;i<playerDB.length;i++) {
      if(playerDB[i].id == id) {
        playerDB.splice(i, 1);
        console.log(`${id} has disconnected`);
        break;
      }
    }
  })
})

function newClient(client) {
  console.log(client.id);
  playerDB.push({ id: client.id, x: 0, y:0 });
  client.emit("get_id", client.id);
}
