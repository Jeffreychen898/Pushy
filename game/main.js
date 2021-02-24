let camera;
const CAM_SIZE = 700;
let player;

let socket;

let position_list = [];
let id = "";

function setup() {
  socket = io.connect("http://localhost:8080");
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

  socket.on("get_id", getID);
  socket.on("new_position_data", getPos);
}
function getPos(data) {
  position_list = data;
}
function getID(data) {
  id = data;
}
function someone(data) {
  position_list = data;
}
function draw() {
  background(0);

  let player_position = player.getPosition();
  socket.emit("position", {id: id, x: player_position.x, y:player_position.y});

  player.render(camera);

  fill(255, 255, 0);
  for(let i=0;i<position_list.length;i++) {
    if(position_list[i].id == id) continue;
    camera.drawRect(position_list[i].x, position_list[i].y, 40, 40);
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
