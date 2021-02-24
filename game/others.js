function Others(x, y, id) {
  let m_position = createVector(x, y);
  let m_id = id;

  this.render = (camera) => {
    fill(255, 255, 0);
    camera.drawEllipse(m_position.x, m_position.y, 50, 50);
  }

  this.getID = () => {
    return m_id;
  }
}
