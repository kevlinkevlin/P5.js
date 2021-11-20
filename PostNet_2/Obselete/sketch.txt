let mySpheres = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  mySpheres.push(new Ball(width / 2, height / 2));
}

function draw() {
  background(100);

  mySpheres.forEach((sph) => {
    sph.move();
    sph.display();

    // 			mySquares.forEach((sqr) => {

    // 				if(sph.catch(sqr.pos)){
    // 					sqr.die();
    // 				};
    // 			})
  })
}//end of draw

function mouseReleased() {
  mySpheres.push(new Ball(mouseX, mouseY));
}
class Ball {

  constructor(_x, _y) {
    this.pos = createVector(_x, _y);

    //console.log(this.pos);
    this.vel = createVector(0, 1);
    this.radius = random(20, 40);
    this.constructTime = millis();
    this.canBounce = true;
    this.clr = color(random(255), random(255), random(255));
  }

  display() {
    noStroke();
    fill(this.clr);
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }

  move() {
    let passTime = millis() - this.constructTime;
    if (this.vel.y != 0) {
      this.vel.add(createVector(0, passTime / 1000));
      this.pos.add(this.vel);
    }

    if (this.vel.y > 1) {
      this.canBounce = true;
    }
    if (this.pos.y + this.radius >= height) {
      if (this.canBounce == true) {
        this.canBounce = false;
        this.vel.y = -0.4 * this.vel.y;
        this.constructTime = millis();
      }
      else {
        if (abs(this.vel.y) < 0.1) this.vel.y = 0;

      }

    }
  }
}