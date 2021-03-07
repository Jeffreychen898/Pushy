const CAM_SIZE = 700;
let mainClass;

function Main() {
  let m_camera;
  let m_player;
  let m_socket
  let m_other_players;
  let m_id;
  let m_map;
  let m_otherBullets;
  let m_tileMaps;
  let m_eachTiles;
  let m_backgroundImage;

  this.setup = () => {
    m_socket = io.connect("http://localhost:8080/");
    createCanvas(windowWidth, windowHeight, P2D);
    /* setup the camera */
    m_camera = new Camera(0, 0, 0, 0);
    setupCamera();
    /* setup the player */
    m_player = new Player(0, 0);
    m_other_players = [];
    /* other bullets */
    m_otherBullets = [];
    /* set the socket io callback functions */
    m_socket.on("new_position_data", newPositionData);
    m_socket.on("get_id", getID);
    m_socket.on("get_map", (data) => {
      m_map = data;
    })
    m_socket.on("new_bullet_emit", new_bullet);

    /* tilemaps */
    m_eachTiles = [m_tileMaps.get(0, 0, 16, 16), m_tileMaps.get(16, 0, 16, 16), m_tileMaps.get(32, 0, 16, 16)];

    noSmooth();
  }

  this.update = () => {
    let deltaTime = 1 / frameRate();
    if(deltaTime == Infinity) {
      deltaTime = 1;
    }
    /* emit the position to the server */
    let player_position = m_player.getPosition();
    let dataToPass = {
      x: player_position.x,
      y: player_position.y,
    };
    m_socket.emit("position", dataToPass);

    m_player.update(deltaTime);

    /* change the camera location */
    m_camera.relocate(m_player.getPosition().x, m_player.getPosition().y);

    /* bullet expiration */
    for(let i=0;i<m_otherBullets.length;i++) {
      if(m_otherBullets[i].isExpired()) {
        m_otherBullets.splice(i, 1);
        i --;
      }
    }
  }

  this.draw = () => {
    noStroke();
    /* draw the background */
    background(0);
    drawbackgroundWallPaper();

    if(m_map) {
      let camera_position = m_camera.getPosition();
      let camera_size = m_camera.getSize();
      let starting_index = {
        x: Math.floor((camera_position.x - camera_size.width / 2) / 100),
        y: Math.floor((camera_position.y - camera_size.height / 2) / 100)
      };
      let ending_index = {
        x: Math.floor((camera_position.x + camera_size.width / 2) / 100) + 1,
        y: Math.floor((camera_position.y + camera_size.height / 2) / 100) + 1
      }

      for(let i=0;i<50;i++) {
        for(let j=0;j<50;j++) {
          if(i > -1 && j > -1 && i < 50 && j < 50) {
            if(m_map[i][j] == 1) {
              m_camera.drawImage(m_eachTiles[0], j * 100, i * 100, 101, 101);
            } else if(m_map[i][j] == 2) {
              m_camera.drawImage(m_eachTiles[1], j * 100, i * 100, 101, 101);
            } else if(m_map[i][j] == 3) {
              m_camera.drawImage(m_eachTiles[2], j * 100, i * 100, 101, 101);
            }
          }
        }
      }
    }

    /*update the player*/
    m_player.render(m_camera);

    /* render the other players */
    let deltaTime = 1 / frameRate();
    for(let i=0;i<m_other_players.length;i++) {
      if(m_other_players[i].getID() == m_id) continue;
      m_other_players[i].render(m_camera);
    }

    /* draw the other player's bullets */
    for(let i=0;i<m_otherBullets.length;i++) {
      m_otherBullets[i].render(m_camera);
    }
  }

  /* preload */
  this.preload = () => {
    m_tileMaps = loadImage("../game_sprites/tiles.png");
    m_backgroundImage = loadImage("../game_sprites/background.png");
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

  this.mousePressed = () => {
    let bullet_information = m_player.shoot(m_camera);
    m_socket.emit("new_bullet", bullet_information);
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

  function drawbackgroundWallPaper() {
    let wallpaper_width = width;
    let wallpaper_height = height;
    if(width > height * 2) {
      wallpaper_height = width / 2;
    } else {
      wallpaper_width = height * 2;
    }
    image(m_backgroundImage, 0, 0, wallpaper_width, wallpaper_height);
  }

  /* socket io callback functions */
  function newPositionData(data) {
    m_other_players = [];
    for(let i=0;i<data.length;i++) {
      let other_one = new Others(data[i].x, data[i].y, data[i].id);
      m_other_players.push(other_one);
    }
  }
  function new_bullet(data) {
    let bullet_position = createVector(data.position.x, data.position.y);
    let bullet_vector = createVector(data.vector.x, data.vector.y);
    let bullet = new Bullet(bullet_position, bullet_vector, data.time);
    m_otherBullets.push(bullet);
  }
  function getID(data) {
    m_id = data;
  }
}

//====================================================================================================
function preload() {
  mainClass = new Main();
  mainClass.preload();
}
function setup() {
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
function mousePressed() {
  mainClass.mousePressed();
}
function windowResized() {
  mainClass.windowResized();
}
