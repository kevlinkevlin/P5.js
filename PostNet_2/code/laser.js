class Laser {
  constructor(_x, _y) {
    this.pos = createVector(_x, _y)
    this.vel = createVector(0, -6)
    this.size = createVector(5, 30)
  }

  show() {
    stroke(255, 255, 0)
    noFill()
    circle(this.pos.x - this.size.x / 2, this.pos.y, this.size.x, this.size.y)
  }

  move() {
    this.pos.add(this.vel)
  }

  checkBorders() {
    if (this.pos.x > width) {
      return true
    }
  }

  checkHit(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y)
    if (d <= asteroid.size.x) {
      return true
    }
  }
}