const express = require("express");
const app = express();
const socket = require("socket.io");
const fs = require("fs");
const readline = require("readline");
const PORT = process.env.PORT || 8080;

let arena = [];

let server = app.listen(PORT, () => {
  console.log(PORT);
  parseMap("server_res/arena.txt");
});

function parseMap(file) {
  let fileStream = fs.createReadStream(file);

  let rl = readline.createInterface({
    input: fileStream,
  })

  rl.on("line", function(line) {
    let arr = [];
    for(let i=0;i<line.length;i++) {
      if(line.charAt(i) != " ") {
        arr.push(line.charAt(i));
      }
    }
    arena.push(arr);
  });
}

app.use("/game", express.static("game"));
app.use("/game_sprites", express.static("game_images"));
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
      if(playerDB[i].id == id) {
        playerDB[i].x = data.x;
        playerDB[i].y = data.y;
        break;
      }
    }
    //broadcast
    client.broadcast.emit("new_position_data", playerDB);
  })

  client.on("new_bullet", (data) => {
    client.broadcast.emit("new_bullet_emit", data);
  })

  client.on("disconnect", () => {
    for(let i=0;i<playerDB.length;i++) {
      if(playerDB[i].id == id) {
        playerDB.splice(i, 1);
        //console.log(`${id} has disconnected`);
        client.broadcast.emit("new_position_data", {x: playerDB.x, y: playerDB.y, id: id});
        break;
      }
    }
  })
})

function newClient(client) {
  //console.log(client.id);
  playerDB.push({ id: client.id, x: 0, y:0});
  client.emit("get_id", client.id);
  client.emit("get_map", arena);
  client.emit("new_position_data", playerDB);
}
