const BULLET_SPEED = 1000;
const BULLET_RANGE = 500;
function Bullet(position, normalVector, time) {
  let m_position = position.copy();
  let m_normalVector = normalVector.copy();
  let m_startTime = time;
  this.render = (camera) => {
    /* difference in time */
    let current_time = new Date().getTime();
    let change_in_time = (current_time - m_startTime) / 1000;
    /* calculate position */
    let calculated_position_x = m_position.x + m_normalVector.x * BULLET_SPEED * change_in_time;
    let calculated_position_y = m_position.y + m_normalVector.y * BULLET_SPEED * change_in_time;

    fill(255, 255, 0);
    camera.drawEllipse(calculated_position_x, calculated_position_y, 10, 10);
  }
  this.isExpired = () => {
    let current_time = new Date().getTime();
    let change_in_time = (current_time - m_startTime) / 1000;
    let distance_traveled = BULLET_SPEED * change_in_time;
    return distance_traveled > BULLET_RANGE;
  }
}
