
let distortionShader, img, fft, audio, toggleBtn

function preload() {
  audio = loadSound('Sound/music.mp3')
  distortionShader = loadShader('shaders/base.vert', 'shaders/distortion.frag')
  img = loadImage('img/distortion.jpg')
}
function setup() {

  getAudioContext().resume()
  pixelDensity(1)
  createCanvas(windowWidth, windowHeight, WEBGL)

  toggleBtn = document.querySelector('#toggle-btn')
  toggleBtn.addEventListener('click', () => {
    this.toggleAudio()
  })

  fft = new p5.FFT()
  shader(distortionShader)
  distortionShader.setUniform('u_resolution', [windowWidth, windowHeight])
  distortionShader.setUniform('u_texture', img)
  distortionShader.setUniform('u_tResolution', [img.width, img.height])


}

function draw() {
  fft.analyze();

  const bass = fft.getEnergy("bass")
  const treble = fft.getEnergy("treble")
  const mid = fft.getEnergy("mid")

  const mapBass = map(bass, 0, 255, 0, 15.0)
  const mapTremble = map(treble, 0, 255, 0, 0.0)
  const mapMid = map(mid, 0, 255, 0.0, 0.2)

  distortionShader.setUniform('u_time', frameCount / 20)
  distortionShader.setUniform('u_bass', mapBass)
  distortionShader.setUniform('u_tremble', mapTremble)
  distortionShader.setUniform('u_mid', mapMid)
  rect(0, 0, width, height)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  distortionShader.setUniform('u_resolution', [windowWidth, windowHeight])
}
function toggleAudio() {
  if (!audio.isPlaying()) {
    audio.loop()
  }
  else {
    audio.pause()
  }
}