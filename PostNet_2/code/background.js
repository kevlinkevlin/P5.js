class BG {
    constructor() {

    }
    show() {
        push()
        stroke(0, 255, 0)
        strokeWeight(.01)
        for (let i = 0; i < width; i += 10) {
            line(i, 0, i, height)
            line(0, i, width, i)
        }
        pop()
    }
}