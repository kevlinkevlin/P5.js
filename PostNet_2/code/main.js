let ship;
let asteroids = [];
let lasers = [];
let score = 0;
let video;
let flippedVideo;
let poseNet;
let pose;
let classifier;
let inc = 0.05
let start = 0
let terrain;
// let bg;
let shootCount = 0;
let shootInterval = 50;
//smoothing the pose position due to the noise
// let smoothCount = 0;
// let smoothInterval = 50;
// let smoothSum = 0;
// let smoothPoseNoseX = 0;
// let smoothTmp = [];


// Teachable Machine model URL:
let soundModel = 'https://teachablemachine.withgoogle.com/models/fmups_mbN/';

function preload() {
  // Load the model
  classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
  createCanvas(700, 700);
  // opacitySlider = createSlider(0, 255, 255, 1)
  video = createCapture(VIDEO)
  video.size(width, height)
  video.hide();
  poseNet = ml5.poseNet(video, { flipHorizontal: true }, modelLoaded);
  poseNet.on('pose', gotPoses);
  classifier.classify(gotResult);
  ship = new Ship()
  terrain = new Terrain()
  // bg = new BG()
  angleMode(DEGREES)
  resetSketch()
  for (let i = 0; i < 10; i++) {
    asteroids.push(new Asteroid())
  }
}

function draw() {
  // opacity = opacitySlider.value()
  // flippedVideo = ml5.flipImage(video); ``
  // image(flippedVideo, 0, 0, width, height)
  background(0, 50)
  // bg.show()
  terrain.show(inc, start)
  noStroke()
  shootCount++;
  //Auto Shoot
  if (shootCount % shootInterval == 0) lasers.push(new Laser(ship.pos.x, ship.pos.y))

  if (pose) {
    // if (smoothCount < smoothInterval) {
    //   smoothCount++;
    //   smoothTmp.push(pose.nose.x);
    //   smoothSum += pose.nose.x;
    //   smoothPoseNoseX = smoothSum / smoothCount;
    // }
    // else {
    //   smoothSum -= smoothTmp.shift();
    //   smoothTmp.push(pose.nose.x);
    //   smoothSum += pose.nose.x;
    //   smoothPoseNoseX = smoothSum / smoothCount;
    //   // print(smoothPoseNoseX);
    // }


    // ship = new Ship(pose.nose.x, pose.nose.y)
    // ship.show((pose.leftWrist.x + pose.rightWrist.x) / 2, (pose.leftWrist.y + pose.rightWrist.y) / 2)
    leftOrRight = pose.rightEar.x + pose.leftEar.x - 2 * pose.nose.x
    if (abs(leftOrRight) >= 25) {

      if (leftOrRight < 0) {
        ship.pos.x += 5;
        ship.show(ship.pos.x, height * 9 / 10)
      } else {
        ship.pos.x -= 5;
        ship.show(ship.pos.x, height * 9 / 10)
      }
    }
    else {
      ship.show(ship.pos.x, height * 9 / 10)
    }
    //KeyBoard Control
    ship.move()



    ship.checkBorders()
    if (terrain.checkHit(ship)) {
      resetSketch()
    }

    asteroids.forEach((a) => {
      a.show()
      a.move()

      if (a.checkHit(ship)) {
        resetSketch()
      }
    })

    lasers.forEach((l, idxL) => {
      l.show()
      l.move()
      if (l.checkBorders()) {
        lasers.splice(idxL, 1)
      }
      asteroids.forEach((a, idxA) => {
        if (l.checkHit(a)) {
          // asteroids.splice(idxA, 1)
          lasers.splice(idxL, 1)
          a.resetPos()
          score++

        }
      })
    })


  }


  fill(255)
  textSize(32)
  text(score, width / 2, 50)
  start += inc



}

function keyTyped() {
  if (key === ' ') {
    lasers.push(new Laser(ship.pos.x, ship.pos.y))
  }
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log('poseNet ready')
}

function resetSketch() {
  score = 0
  lasers = []
  start = random(100)

  asteroids.forEach((a) => {
    a.resetPos()
  })
}

// The model recognizing a sound will trigger this event
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  if (results[0].label == "piew!" && results[0].confidence > 0.90) {
    lasers.push(new Laser(ship.pos.x, ship.pos.y))
  }

}