class LayerFour {
  /**
   * @param {number} centerX, centerY - center of the ring
   * @param {number} innerDiameter - inner boundary of the ring band
   * @param {number} outerDiameter - outer boundary of the ring band
   * @param {p5.Image} imgA - first alternating image
   * @param {p5.Image} imgB - second alternating image
   * @param {number} count - how many small circles to place around the ring
   * @param {number} circleSize - diameter of each small circle
   * @param {number} tileSize - pattern tile size
   */
  constructor(centerX, centerY, innerDiameter, outerDiameter, imgA, imgB, count = 12, circleSize = 30, tileSize = 20) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.innerDiameter = innerDiameter;
    this.outerDiameter = outerDiameter;
    this.imgA = imgA;
    this.imgB = imgB;
    this.count = count;
    this.circleSize = circleSize;
    this.tileSize = tileSize;
    this.circles = [];
  }

  async create() {
    let innerRadius = this.innerDiameter / 2;
    let outerRadius = this.outerDiameter / 2;
    let ringRadius = (innerRadius + outerRadius) / 2; // centers sit on the ring midline

    for (let i = 0; i < this.count; i++) {
      let angle = (TWO_PI / this.count) * i;
      let x = this.centerX + ringRadius * cos(angle);
      let y = this.centerY + ringRadius * sin(angle);

      // Alternate: even index = imgA, odd index = imgB
      let img = (i % 2 === 0) ? this.imgA : this.imgB;

      this.circles.push(new PatternCircle(x, y, this.circleSize, img, this.tileSize));
    }
  }

  display() {
    for (let c of this.circles) {
      c.display();
    }
  }
}