const PLAYER_SPEED = 500;
function Player(x, y) {
  let m_position = createVector(x, y);
  let m_velocity = createVector(0, 0);

  /* top bottom left right */
  let m_movements = [false, false, false, false];

  /* bullets */
  let m_bullets = [];

  this.applyForce = (x, y) => {
    m_velocity.x += x;
    m_velocity.y += y;
  }
  this.update = (deltaTime) => {
    if(m_movements[0]) {//top
      this.applyForce(0, -PLAYER_SPEED * deltaTime * 60);
    }
    if(m_movements[1]) {//bottom
      this.applyForce(0, PLAYER_SPEED * deltaTime * 60);
    }
    if(m_movements[2]) {//left
      this.applyForce(-PLAYER_SPEED * deltaTime * 60, 0);
    }
    if(m_movements[3]) {//right
      this.applyForce(PLAYER_SPEED * deltaTime * 60, 0);
    }

    /* friction */
    m_velocity.mult(1 / (1 + (deltaTime * 50)));

    m_position.x += m_velocity.x * deltaTime;
    m_position.y += m_velocity.y * deltaTime;

    /* updating the bullets */
    for(let i=0;i<m_bullets.length;i++) {
      if(m_bullets[i].isExpired()) {
        m_bullets.splice(i, 1);
        i --;
      }
    }
  }
  this.render = (camera) => {
    rectMode(CENTER);
    fill(255);
    camera.drawEllipse(m_position.x, m_position.y, 50, 50);

    /* bullet rendering */
    for(let i=0;i<m_bullets.length;i++) {
      m_bullets[i].render(camera);
    }
  }

  this.shoot = (camera) => {
    /* mouse coordinates to world */
    let mouse_in_world = camera.toWorldCoordinates(mouseX, mouseY);
    /* get the direction of the vector */
    let bullet_direction = createVector(mouse_in_world.x - m_position.x, mouse_in_world.y - m_position.y);
    bullet_direction.normalize();
    /* time */
    let spawn_time = new Date().getTime();
    /* create and store the bullet */
    let new_bullet = new Bullet(m_position, bullet_direction, spawn_time);
    m_bullets.push(new_bullet);

    let bullet_information = {
      position: {
        x: m_position.x,
        y: m_position.y
      },
      vector: {
        x: bullet_direction.x,
        y: bullet_direction.y
      },
      time: spawn_time
    }
    return bullet_information;
  }

  this.checkBulletCollision = (bulletPosition) => {
    /* get the distance between bullet and player */
    let player_bullet_distance = dist(m_position.x, m_position.y, bulletPosition.x, bulletPosition.y);
    if(player_bullet_distance < 30) {
      /* get the angle where the bullet is located */
      /* using vectors because it provides me with the components(x, y) */
      let player_bullet_angle = createVector(m_position.x - bulletPosition.x, m_position.y - bulletPosition.y);
      player_bullet_angle.normalize();
      player_bullet_angle.mult(10000);
      /* push the player in that direction */
      this.applyForce(player_bullet_angle.x, player_bullet_angle.y);
      return true;
    }
    return false;
  }

  this.move = (index, boolean) => {
    m_movements[index] = boolean;
  }

  this.setPosition = (positionX, positionY) => {
    m_position.x = positionX;
    m_position.y = positionY;
  }

  this.getPosition = () => {
    return { x: m_position.x, y: m_position.y };
  }
  this.getVelocity = () => {
    return { x: m_velocity.x, y: m_velocity.y };
  }
}
