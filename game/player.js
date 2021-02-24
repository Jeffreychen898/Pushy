let Player = (function() {

  let position;
  let velocity;

  class Player {
    constructor(x, y) {
      position = createVector(x, y);
      velocity = createVector(0, 0);
    }
    applyForce(x, y) {
      velocity.x += x;
      velocity.y += y;
    }
    render(camera) {
      position.add(velocity);

      rectMode(CENTER);
      fill(255);
      camera.drawRect(position.x, position.y, 50, 50);
    }

    getPosition() {
      return { x: position.x, y: position.y };
    }
  }

  return Player;
})();
