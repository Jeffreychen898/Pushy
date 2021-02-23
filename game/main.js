let camera;
const CAM_SIZE = 700;
let player_position;

let socket;

let movement = [false, false, false, false];
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

  player_position = createVector(0, 0);

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

  if(movement[0]) {
    player_position.y -= 5;
  }
  if(movement[1]) {
    player_position.x -= 5;
  }
  if(movement[2]) {
    player_position.y += 5;
  }
  if(movement[3]) {
    player_position.x += 5;
  }
  socket.emit("position", {id: id, x: player_position.x, y:player_position.y});
  rectMode(CENTER);
  fill(255);
  camera.drawRect(player_position.x, player_position.y, 40, 40);
  fill(255, 255, 0);
  for(let i=0;i<position_list.length;i++) {
    camera.drawRect(position_list[i].x, position_list[i].y, 40, 40);
  }
}
function keyPressed() {
  toggleMovemnet(key, true);
}
function keyReleased() {
  toggleMovemnet(key, false);
}
function toggleMovemnet(k, bool) {
  switch(k) {
    case "w":
    movement[0] = bool;
    break;
    case "a":
    movement[1] = bool;
    break;
    case "s":
    movement[2] = bool;
    break;
    case "d":
    movement[3] = bool;
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
