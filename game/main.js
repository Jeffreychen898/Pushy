const CAM_SIZE = 700;
let mainClass;

function Main() {
  let m_camera;
  let m_player;
  let m_socket
  let m_other_players;
  let m_id;
  let m_map;

  this.setup = () => {
    m_socket = io.connect("http://localhost:8080/");
    createCanvas(windowWidth, windowHeight);
    /* setup the camera */
    m_camera = new Camera(0, 0, 0, 0);
    setupCamera();
    /* setup the player */
    m_player = new Player(0, 0);
    m_other_players = [];
    /* set the socket io callback functions */
    m_socket.on("new_position_data", newPositionData);
    m_socket.on("get_id", getID);
    m_socket.on("get_map", (data) => {
      m_map = data;
    })
  }

  this.update = () => {
    /* emit the position to the server */
    let player_position = m_player.getPosition();
    m_socket.emit("position", {x: player_position.x, y:player_position.y});

    m_player.update(0);

    /* change the camera location */
    m_camera.relocate(m_player.getPosition().x, m_player.getPosition().y);
  }

  this.draw = () => {
    noStroke();
    //console.log(frameRate());
    /* draw the background */
    background(0);

    if(m_map) {
      for(let i=0;i<m_map.length;i++) {
        for(let j=0;j<m_map[i].length;j++) {
          if(m_map[i][j] == 0) {
            fill(255, 0, 255);
          } else if(m_map[i][j] == 1) {
            fill(255);
          } else if(m_map[i][j] == 2) {
            fill(255, 0, 0);
          } else if(m_map[i][j] == 3) {
            fill(255, 255, 0);
          }
          m_camera.drawRect(j * 100, i * 100, 101, 101);
        }
      }
    }

    /*update the player*/
    m_player.render(m_camera);

    /* render the other players */
    for(let i=0;i<m_other_players.length;i++) {
      if(m_other_players[i].getID() == m_id) continue;
      console.log(m_other_players[i].getID());
      m_other_players[i].render(m_camera);
    }
  }

  /* events */
  this.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight);
    setupCamera();
  }

  this.keyPressed = () => {
    playerMovement(key, true);
  }

  this.keyReleased = () => {
    playerMovement(key, false);
  }

  /* private methods */
  function playerMovement(k, iskeydown) {
    switch(k) {
      case "w":
      m_player.move(0, iskeydown);
      break;
      case "a":
      m_player.move(2, iskeydown);
      break;
      case "s":
      m_player.move(1, iskeydown);
      break;
      case "d":
      m_player.move(3, iskeydown);
      break;
    }
  }

  function setupCamera() {
    if(width > height) {
      let aspect_ratio = height / width;
      m_camera.resize(CAM_SIZE, aspect_ratio * CAM_SIZE);
    } else {
      let aspect_ratio = width / height;
      m_camera.resize(aspect_ratio * CAM_SIZE, CAM_SIZE);
    }
  }

  /* socket io callback functions */
  function newPositionData(data) {
    m_other_players = [];
    for(let i=0;i<data.length;i++) {
      let other_one = new Others(data[i].x, data[i].y, data[i].id);
      m_other_players.push(other_one);
    }
  }
  function getID(data) {
    m_id = data;
  }
}

//====================================================================================================

function setup() {
  mainClass = new Main();
  mainClass.setup();
}
function draw() {
  mainClass.update();
  mainClass.draw();
}
function keyPressed() {
  mainClass.keyPressed();
}
function keyReleased() {
  mainClass.keyReleased();
}
function windowResized() {
  mainClass.windowResized();
}
