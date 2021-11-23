let coord = []
let terrainOffset = 0
let boundary = [0, 0, 0, 0]
let A = 0, B = 0, C = 0
class Terrain {
  constructor() {
    terrainOffset = 200
  }

  show(inc, start) {
    push()
    stroke(0, 255, 0)
    fill(0)
    translate(-terrainOffset, 0)
    beginShape()
    var yoff = start
    // let vertexNumber = 0
    for (var y = 0; y < height; y += 10) {

      A = width * 0.4
      B = 0.05
      C = 0
      var x = A * cos(B * (y - 200 * yoff)) + C + noise(yoff) * noise(yoff) * 200


      if (y == 0 || y == height - 1) {

        x = 0
      }

      if (y == height - 10) {
        boundary[0] = x
      }
      if (y == height - 70) {
        boundary[2] = x
      }
      if (y % 20 == 0 || y == height - 1) {
        // vertexNumber++
        // if (vertexNumber % 6 == 0)
        //   stroke(0, 255, 0)}
        // else if (vertexNumber % 6 == 3)
        //   stroke(255, 0, 0)
        vertex(x, y)
      }

      // ellipse(x, y, 1)
      // line(x, 0, x, y)
      yoff -= inc

    }
    endShape()
    pop()


    push()
    stroke(0, 255, 0)
    fill(0)
    translate(-terrainOffset, 0)
    beginShape()
    for (var y = 0; y < height; y += 10) {
      A = width * 0.4
      B = 0.05
      C = width * 0.9
      var x = A * sin(B * (y - 200 * yoff)) + C + noise(yoff) * 200

      if (y == 0 || y == height - 1) {
        x = width
      }
      if (y == height - 10) {
        boundary[1] = x
      }
      if (y == height - 70) {
        boundary[3] = x
      }
      if (y % 20 == 0 || y == height - 1)
        vertex(x, y)



      yoff -= inc
      // coord.push(x, y)

    }
    endShape()
    pop()
  }

  checkHit(ship) {
    // print("ship x = ", ship.pos.x, "bound = ", boundary[0] - terrainOffset, ",", boundary[1] + terrainOffset)
    if (ship.pos.x - 20 < (boundary[0] - terrainOffset) || ship.pos.x + 20 > (boundary[1] - terrainOffset)
      || ship.pos.x < (boundary[2] - terrainOffset) || ship.pos.x > (boundary[3] - terrainOffset)) {
      // print('hit\n')

      return true
    }
  }

}