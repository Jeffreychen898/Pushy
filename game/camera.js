function Camera(x, y, w, h) {
  let m_cameraPosition = createVector(x, y);
  let m_cameraSize = createVector(w, h);

  this.drawEllipse = (x, y, w, h) => {
    let position = createVector(x, y);
    let size = createVector(w, h);

    let new_coordinate = transformShapes(position, size);

    position = new_coordinate.position;
    size = new_coordinate.size;

    ellipse(position.x, position.y, size.x, size.y);
  }
  this.drawRect = (x, y, w, h) => {
    let position = createVector(x, y);
    let size = createVector(w, h);

    let new_coordinate = transformShapes(position, size);

    position = new_coordinate.position;
    size = new_coordinate.size;

    rect(position.x, position.y, size.x, size.y);
  }
  this.drawImage = (img, x, y, w, h) => {
    let position = createVector(x, y);
    let size = createVector(w, h);

    let new_coordinate = transformShapes(position, size);

    position = new_coordinate.position;
    size = new_coordinate.size;

    image(img, position.x, position.y, size.x, size.y);
  }

  this.resize = (w, h) => {
    m_cameraSize.x = w;
    m_cameraSize.y = h;
  }
  this.relocate = (x, y) => {
    m_cameraPosition.x = x;
    m_cameraPosition.y = y;
  }

  this.getPosition = () => {
    return { x: m_cameraPosition.x, y: m_cameraPosition.y };
  }
  this.getSize = () => {
    return { width: m_cameraSize.x, height: m_cameraSize.y };
  }

  this.toWorldCoordinates = (x, y) => {
    let camera_position = createVector(m_cameraPosition.x / m_cameraSize.x, m_cameraPosition.y / m_cameraSize.y);

    let new_position = createVector(x / width, y / height);

    new_position.x += camera_position.x - 0.5;
    new_position.y += camera_position.y - 0.5;

    new_position.x *= m_cameraSize.x;
    new_position.y *= m_cameraSize.y;

    return new_position;
  }

  function transformShapes(position, size) {
    let camera_position = createVector(m_cameraPosition.x / m_cameraSize.x, m_cameraPosition.y / m_cameraSize.y);

    let new_position = createVector(position.x / m_cameraSize.x, position.y / m_cameraSize.y);
    let new_size = createVector(size.x / m_cameraSize.x, size.y / m_cameraSize.y);

    new_position.x -= camera_position.x - 0.5;
    new_position.y -= camera_position.y - 0.5;

    new_position.x *= width;
    new_position.y *= height;
    new_size.x *= width;
    new_size.y *= height;

    return {
      position: new_position,
      size: new_size
    }
  }
}
