function Player(x, y) {
  let m_position = createVector(x, y);
  let m_velocity = createVector(0, 0);

  /* top bottom left right */
  let m_movements = [false, false, false, false];

  this.applyForce = (x, y) => {
    m_velocity.x += x;
    m_velocity.y += y;
  }
  this.update = (deltaTime) => {
    if(m_movements[0]) {//top
      this.applyForce(0, -5);
    }
    if(m_movements[1]) {//bottom
      this.applyForce(0, 5);
    }
    if(m_movements[2]) {//left
      this.applyForce(-5, 0);
    }
    if(m_movements[3]) {//right
      this.applyForce(5, 0);
    }

    m_velocity.mult(0.5);

    m_position.add(m_velocity);
  }
  this.render = (camera) => {
    rectMode(CENTER);
    fill(255);
    camera.drawEllipse(m_position.x, m_position.y, 50, 50);
  }
  this.move = (index, boolean) => {
    m_movements[index] = boolean;
  }

  this.getPosition = () => {
    return { x: m_position.x, y: m_position.y };
  }
}
