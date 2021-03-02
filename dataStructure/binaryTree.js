function BinaryTree() {
  let m_seed = null;
  this.add = (data, value) => {
    if(m_seed == null) {
      //if the seed doesn't exist
      let new_leaf = new Leaf(data, value);
      m_seed = new_leaf;
    } else {
      //find a leaf with an empty branch
      let current_leaf = m_seed;
      while(true) {
        if(value < current_leaf.getValue()) {
          /* go to the right */
          if(current_leaf.getRight() == null) {
            let new_leaf = new Leaf(data, value);
            current_leaf.setRight(new_leaf);
          } else {
            current_leaf = current_leaf.getRight();
          }
        } else {
          /* go to the left */
          if(current_leaf.getLeft() == null) {
            let new_leaf = new Leaf(data, value);
            current_leaf.setLeft(new_leaf);
          } else {
            current_leaf =  current_leaf.getLeft();
          }
        }
      }
    }
  }
  this.delete = () => {
    //
  }
  this.get = (value) => {
    let current = m_seed;
    while(current.getValue() != value) {
      if(value < current.getValue()) {
        /* search right */
        if(current.getLeft() == null) {
          return null;
        } else {
          current = current.getLeft();
        }
      } else {
        /* search left */
        if(current.getRight() == null) {
          return null;
        } else {
          current = current.getRight();
        }
      }
    }
    /* the current node is found */
    return current.getData();
  }
}
function Leaf(data, value) {
  let m_data = data;
  let m_value = value;
  let m_left = null;
  let m_right = null;
  this.getValue = () => {
    return m_value;
  }
  this.getData = () => {
    return m_data;
  }
  /* setters */
  this.setLeft = (left) => {
    m_left = left
  }
  this.setRight = (right) => {
    m_right = right;
  }
  /* getters */
  this.getLeft = (left) => {
    return m_left;
  }
  this.getRight = (right) => {
    return m_right;
  }
}
