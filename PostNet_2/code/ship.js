class Ship {
  constructor() {
    this.pos = createVector(width / 2, height / 2)
    // this.r = 20
  }

  show(_x, _y) {
    // fill(255)
    push()
    fill(0, 0)
    stroke(255)
    this.pos.x = _x
    this.pos.y = _y

    beginShape(TRIANGLES)

    vertex(this.pos.x, this.pos.y)
    vertex(this.pos.x - 10, this.pos.y + 20)
    vertex(this.pos.x + 10, this.pos.y + 20)

    vertex(this.pos.x, this.pos.y + 40)
    vertex(this.pos.x - 10, this.pos.y + 20)
    vertex(this.pos.x + 10, this.pos.y + 20)

    vertex(this.pos.x, this.pos.y + 40)
    vertex(this.pos.x - 20, this.pos.y + 40)
    vertex(this.pos.x - 10, this.pos.y + 20)

    vertex(this.pos.x, this.pos.y + 40)
    vertex(this.pos.x + 20, this.pos.y + 40)
    vertex(this.pos.x + 10, this.pos.y + 20)

    endShape(CLOSE)
    pop()
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.pos.x -= 5;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.pos.x += 5;
    }

    if (keyIsDown(UP_ARROW)) {
      this.pos.y -= 5;
    }

    if (keyIsDown(DOWN_ARROW)) {
      this.pos.y += 5;
    }
  }

  checkBorders() {
    if (this.pos.x <= 10) {
      this.pos.x = 10
    }
    if (this.pos.x >= width - 10) {
      this.pos.x = width - 10
    }
    if (this.pos.y <= 0) {
      this.pos.y = 0
    }
    if (this.pos.y >= height) {
      this.pos.y = height
    }
  }





}