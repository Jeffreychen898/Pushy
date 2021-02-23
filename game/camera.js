let Camera = (function() {

  let m_cameraPosition;
  let m_cameraSize;

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

  class Camera {
    constructor(x, y, w, h) {
      m_cameraPosition = createVector(x, y);
      m_cameraSize = createVector(w, h);
    }
    resize(w, h) {
      m_cameraSize.x = w;
      m_cameraSize.y = h;
    }
    relocate(x, y) {
      m_cameraPosition.x = x;
      m_cameraPosition.y = y;
    }

    drawRect(x, y, w, h) {
      let position = createVector(x, y);
      let size = createVector(w, h);

      let new_coordinate = transformShapes(position, size);

      position = new_coordinate.position;
      size = new_coordinate.size;

      rect(position.x, position.y, size.x, size.y);
    }
  }

  return Camera;

})();
