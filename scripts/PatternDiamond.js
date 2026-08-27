class PatternDiamond {

  constructor(x, y, width, height, rotation, imgTop, imgBottom, tileSize = 25) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.patternTop = PatternShape.buildPattern(imgTop, tileSize);
    this.patternBottom = PatternShape.buildPattern(imgBottom, tileSize);
  }

  display() {
    push();
    noStroke();
    translate(this.x, this.y);
    rotate(this.rotation);

    let halfW = this.width / 2;
    let halfH = this.height / 2;

    // Top triangle: apex at top, base is the horizontal midline
    drawingContext.fillStyle = this.patternTop;
    triangle(0, -halfH, -halfW, 0, halfW, 0);

    // Bottom triangle: apex at bottom, base is the horizontal midline
    drawingContext.fillStyle = this.patternBottom;
    triangle(0, halfH, -halfW, 0, halfW, 0);

    pop();
  }
}