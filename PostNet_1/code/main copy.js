let video, music, filter, poseNet, poses = [];
let centerX = 0, centerY = 0, headW = 0, stepSize = 0;
let rotateCount = 0;
function preload() {
  soundFormats('wav');
  music = loadSound('./Sound/sound.wav')
}

function getPoses(results) {
  poses = results;
  // print(poses[0].pose);
}

function modelReady() {
  print('model ready');
  poseNet.on('pose', getPoses)

}

function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight, WEBGL);
  filter = new p5.LowPass();
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);

  // music.play();
  // music.loop();
  // music.disconnect();
  // music.connect(filter);
  // video.hide();
}

function draw() {
  background(255);

  tint(0, 153, 204);

  video.loadPixels();
  Blur(5);
  rotateY(PI);

  // videoFlip();
  imageMode(CENTER);
  image(video, 0, 0);

  rotateZ(millis() / 1000);
  let noseX, noseY, headWidth;
  if (poses[0]) {
    noseX = poses[0].pose.nose.x;
    noseY = poses[0].pose.nose.y;

    headWidth = dist(poses[0].pose.leftEar.x, poses[0].pose.leftEar.y,
      poses[0].pose.rightEar.x, poses[0].pose.rightEar.y)
  } else {
    noseX = width / 2;
    noseY = height / 2;
    headWidth = 0;
  }
  let filterFreq = map(noseX, 0, width, 10, 22050);
  let filterRes = 5;
  let volume = map(headWidth, 0, width, 0.5, 1);
  centerX = noseX, centerY = noseY, headW = headWidth;
  stepSize = int(map(noseY, 0, height, 10, 10));

  // music.setVolume(volume);

  filter.set(filterFreq, filterRes);

  for (let row = 0; row < video.height; row += stepSize) {
    for (let column = 0; column < video.width; column += stepSize) {

      // drawPixel(row, column);
    }
  }
  noStroke();

  rotateCount = (rotateCount + 1) % 360 * PI / 180
}
function drawPixel(row, column) {
  pixelInfo = new getPixelInfo(row, column);

  let darkness = map((pixelInfo.colorR + pixelInfo.colorG + pixelInfo.colorB) / 3, 0, 255, 1, 0);
  fill(color(pixelInfo.colorR, pixelInfo.colorG, pixelInfo.colorB, pixelInfo.colorA));
  let flip_column = (video.width - 1) - column;
  let distance = dist(column, row, centerX, centerY);
  if (distance <= headW) {

    rect(column - video.width / 2, row - video.height / 2, stepSize * darkness);
  }
}
function getPixelInfo(row, column) {
  let index = (row * video.width + column) * 4;
  this.colorR = video.pixels[index];
  this.colorG = video.pixels[index + 1];
  this.colorB = video.pixels[index + 2];
  this.colorA = video.pixels[index + 3];
}
function videoFlip() {
  for (let row = 0; row < video.height; row++) {
    for (let column = 0; column < video.width / 2; column++) {
      let index = (row * video.width + column) * 4;
      let flip_column = (video.width - 1) - column;
      let flip_index = (row * video.width + flip_column) * 4;

      let tmp_colorR = video.pixels[index];
      let tmp_colorG = video.pixels[index + 1];
      let tmp_colorB = video.pixels[index + 2];
      let tmp_colorA = video.pixels[index + 3];
      video.pixels[index] = video.pixels[flip_index];
      video.pixels[index + 1] = video.pixels[flip_index + 1];
      video.pixels[index + 2] = video.pixels[flip_index + 2];
      video.pixels[index + 3] = video.pixels[flip_index + 3];
      video.pixels[flip_index] = tmp_colorR;
      video.pixels[flip_index + 1] = tmp_colorG;
      video.pixels[flip_index + 2] = tmp_colorB;
      video.pixels[flip_index + 3] = tmp_colorA;
      if (row % stepSize == 0 && column % stepSize == 0) {
        drawPixel(row, column);
        drawPixel(row, flip_column);
      }
    }
  }
}
function Blur(step) {
  for (let row = video.height / 2; row < video.height - step; row++) {
    for (let column = video.width / 2; column < video.width - step; column++) {
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
      let index = (row * video.width + column) * 4;
      for (let i = 0; i < step; i++) {
        for (let j = 0; j < step; j++) {
          let pixel = new getPixelInfo(row + i, column + j);
          sumR += pixel.colorR;
          sumG += pixel.colorG;
          sumB += pixel.colorB;
          sumA += pixel.colorA;
        }
      }
      sumR /= (step * step)
      sumG /= (step * step)
      sumB /= (step * step)
      sumA /= (step * step)

      video.pixels[index] = sumR;
      video.pixels[index + 1] = sumG;
      video.pixels[index + 2] = sumB;
      video.pixels[index + 3] = sumA;
    }
  }
}