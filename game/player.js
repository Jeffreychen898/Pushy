function Player(x, y) {
  let m_position = createVector(x, y);
  let m_velocity = createVector(0, 0);

  this.applyForce = (x, y) => {
    m_velocity.x += x;
    m_velocity.y += y;
  }
  this.render = (camera) => {
    m_position.add(m_velocity);

    rectMode(CENTER);
    fill(255);
    camera.drawEllipse(m_position.x, m_position.y, 50, 50);
  }

  this.getPosition = () => {
    return { x: position.x, y: position.y };
  }
}
