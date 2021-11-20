

class Asteroid {

    constructor() {
        this.MAXSIZE = 40
        this.pos = createVector(random(0, width), random(-1000, -50))
        this.vel = createVector(0, random(1, 5))
        this.size = createVector(random(10, this.MAXSIZE), random(10, this.MAXSIZE))
        this.spacing = random(50, 130)
    }

    show() {
        push()
        stroke(155, 103, 60)

        noFill()
        beginShape()
        let spacing = this.spacing

        for (let a = 0; a < 360; a += spacing) {
            let x = this.size.x * sin(a) + this.pos.x
            let y = this.size.y * cos(a) + this.pos.y
            vertex(x, y)
        }

        endShape(CLOSE)
        pop()

        // rect(this.pos.x, this.pos.y, this.size.x, this.size.y)
    }

    move() {
        this.pos.add(this.vel)

        if (this.pos.y + this.size > height) {
            this.pos = createVector(random(0, width), random(-1000, -50))
            this.vel = createVector(0, random(1, 5))
            this.size = createVector(random(10, this.MAXSIZE), random(10, this.MAXSIZE))
            this.spacing = random(50, 130)
        }

    }
    checkHit(ship) {
        let d_top = dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y)
        let d_bottom = dist(this.pos.x, this.pos.y - 40, ship.pos.x, ship.pos.y)

        if (d_top <= this.MAXSIZE || d_bottom <= (this.MAXSIZE + 20)) {
            return true
        }

    }
    checkBoarder() {

    }
    resetPos() {
        this.pos = createVector(random(0, width), random(-1000, -50))
        this.vel = createVector(0, random(1, 5))
        this.size = createVector(random(10, this.MAXSIZE), random(10, this.MAXSIZE))
        this.spacing = random(50, 130)
    }
}