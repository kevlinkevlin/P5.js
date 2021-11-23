let video, music, filter, poseNet, poses = [];
let centerX = 0, centerY = 0, headW = 0, stepSize = 0;
let rotateCount = 0;

function preload() {
  soundFormats('mp3');
  music = loadSound('./Sound/sound.mp3')
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
  frameRate(60);
  createCanvas(windowWidth, windowHeight, WEBGL);

  filter = new p5.LowPass();
  video = createCapture(VIDEO);
  video.size(width, height);
  // BlackHole.blackHoleifyImage('test', './Image/bird.png'); 
  poseNet = ml5.poseNet(video, modelReady);

  music.play();
  music.loop();
  music.disconnect();
  music.connect(filter);
  video.hide();
}

function draw() {
  background(255);

  tint(0, 153, 204);

  video.loadPixels();
  rotateY(PI);

  // Blur(5);
  imageMode(CENTER);
  // image(video, 0, 0);

  // rotateZ(millis() / 1000);
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
  stepSize = int(map(noseY, 0, height, 5, 5));

  // music.setVolume(volume);

  filter.set(filterFreq, filterRes);
  // pixelToCenterDegree = 
  // pixelToCenterDistance = dist(column, row,
  //   poses[0].pose.nose.x, poses[0].pose.nose.y)

  // translate(noseX, noseY);
  for (let row = 0; row < video.height; row += stepSize) {
    for (let column = 0; column < video.width; column += stepSize) {

      drawPixel(row, column);
    }
  }
  /*var canvas		= document.getElementById("canvas");
  var context		= canvas.getContext("2d");
  console.log(typeof(context))
   const timer = setInterval(() => {
          context.drawImage(video.pixels, 0, 0)
        }, 100)
  Image(video.pixels, 0, 0);*/
  //var pinched = pinch(video, 0, 0, 0, -60, 1.5);
  //context.drawImage(pinched, 0, 0);
  noStroke();

  rotateCount = (rotateCount + 1) % 360 * PI / 180
}







function drawPixel(row, column) {
  scale = 0.9
  let distance = dist(column, row, centerX, centerY);
  let flip_column = (video.width - 1) - column;
  if (distance <= headW) {
    //version1
    color_column = column - centerX
    color_row = row - centerY;
    percent = 1.0 + ((0.9 - (headW / distance) * 1.5)) * scale;
    color_column = color_column * percent;
    color_row = color_row * percent;
    color_column = color_column + centerX
    color_row = color_row + centerY;

    //console.log("center", centerY, centerX)
    //console.log("dis", distance)
    //console.log(row, column, parseInt(color_row), parseInt(color_column))

    //version2
    // let radiusToCenter = sqrt((centerX - column) * (centerX - column) + (centerY - row) * (centerY - row))
    // let v2 = createVector(radiusToCenter * cos(radians(millis() / 1000)), radiusToCenter * sin(radians(millis() / 1000)))
    // color_column = parseInt(v2.x)
    // color_row = parseInt(v2.y);
    // percent = 1.0 + ((0.5 - (headW / distance) * 0.5)) * scale;
    // color_column = color_column * percent;
    // color_row = color_row * percent;
    // color_column = color_column + centerX
    // color_row = color_row + centerY;

    pixelInfo = new getPixelInfo(parseInt(color_row), parseInt(color_column));
    //console.log(pixelInfo)
    // stroke(pixelInfo.colorR, pixelInfo.colorG, pixelInfo.colorB)
    fill(color(pixelInfo.colorR, pixelInfo.colorG, pixelInfo.colorB));
    push();
    let v1 = createVector((centerX - column) / 10000 * (millis() % 1000), (centerY - row) / 10000 * (millis() % 1000));


    // print(v2.x, v2.y)
    // print(v1);
    // translate(v1);
    // translate(p5.Vector.fromAngle(millis() / 1000, 40));
    let darkness = map((pixelInfo.colorR + pixelInfo.colorG + pixelInfo.colorB) / 3, 0, 255, 1, 0);
    rect(column - video.width / 2, row - video.height / 2, stepSize * darkness);
    //fill(color(255, 255, 255));
    //rect(column - video.width / 2, row - video.height / 2, 3);
    /*
     highp vec2 textureCoordinateToUse = textureCoordinate;
     highp float dist = distance(center, textureCoordinate);
     textureCoordinateToUse -= center;
     if (dist < radius)
     {
         highp float percent = 1.0 + ((0.5 - dist) / 0.5) * scale;

         textureCoordinateToUse = textureCoordinateToUse * percent;
     }
     textureCoordinateToUse += center;
     */
    pop();
  }
}

function getPixelInfo(row, column) {
  let index = (row * video.width + column) * 4;
  this.colorR = video.pixels[index];
  this.colorG = video.pixels[index + 1];
  this.colorB = video.pixels[index + 2];
  this.colorA = video.pixels[index + 3];
  // console.log(this.colorR)
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

function pinch(source, x, y, radius, strength, quality) {
  // variables
  var width = source.width;
  var height = source.height;
  var easeW = (strength / width) * 4;	// easeWidth???
  var wh = width / 2;				// width half ??
  var hh = height / 2;				// height half ??
  var stepUnit = (0.5 / wh) * quality;	// ???

  // temporary canvas
  var tempCanvas = document.createElement("canvas");
  var context = tempCanvas.getContext("2d");
  tempCanvas.width = width;
  tempCanvas.height = height;
  Image(source, 0, 0);

  // pinching ??
  for (var i = 0; i < 0.5; i += stepUnit) {
    var r = i * 2;
    var x = r * wh;
    var y = r * hh;
    var xw = width - (x * 2);
    var rx = x * easeW;
    var ry = y * easeW;
    var rw = width - (rx * 2);
    var rh = height - (ry * 2);
    context.save();
    context.beginPath();
    context.arc(wh, hh, xw / 2, 0, Math.PI * 2);
    context.clip();
    Image(source, rx, ry, rw, rh, 0, 0, width, height);
    context.restore();
  }
  return tempCanvas;
}
