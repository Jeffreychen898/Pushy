let camera;
const CAM_SIZE = 700;
let player;

let socket;

let other_players = [];

let id = "";

function setup() {
  socket = io.connect("http://localhost:8080/");
  createCanvas(windowWidth, windowHeight);
  camera = new Camera(0, 0, 0, 0);
  //set the camera size
  if(width > height) {
    let aspect_ratio = height / width;
    camera.resize(CAM_SIZE, aspect_ratio * CAM_SIZE);
  } else {
    let aspect_ratio = width / height;
    camera.resize(aspect_ratio * CAM_SIZE, CAM_SIZE);
  }

  player = new Player(0, 0);

  socket.on("new_position_data", getPos);
  socket.on("get_id", getID);

  function getID(data) {
    id = data;
  }

  function getPos(data) {
    other_players = [];
    for(let i=0;i<data.length;i++) {
      let other_one = new Others(data[i].x, data[i].y, data[i].id);
      other_players.push(other_one);
    }
  }
}
function draw() {
  background(0);

  let player_position = player.getPosition();
  socket.emit("position", {x: player_position.x, y:player_position.y});

  player.render(camera);

  for(let i=0;i<other_players.length;i++) {
    if(other_players[i].getID() == id) continue;
    other_players[i].render(camera);
  }
}
function keyPressed() {
  playerMovement(key, 5);
}
function keyReleased() {
  playerMovement(key, -5);
}
function playerMovement(k, speed) {
  switch(k) {
    case "w":
    player.applyForce(0, -speed);
    break;
    case "a":
    player.applyForce(-speed, 0);
    break;
    case "s":
    player.applyForce(0, speed);
    break;
    case "d":
    player.applyForce(speed, 0);
    break;
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  //resize the camera
  if(width > height) {
    let aspect_ratio = height / width;
    camera.resize(CAM_SIZE, aspect_ratio * CAM_SIZE);
  } else {
    let aspect_ratio = width / height;
    camera.resize(aspect_ratio * CAM_SIZE, CAM_SIZE);
  }
}
