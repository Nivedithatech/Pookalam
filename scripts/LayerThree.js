class LayerThree {
  constructor(centerX, centerY, circleDiameter, circleImg, diamondSteps, tileSize = 25) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.circleDiameter = circleDiameter;
    this.circleImg = circleImg;
    this.diamondSteps = diamondSteps;
    this.tileSize = tileSize;

    this.backgroundCircle = null;
    this.diamonds = [];
  }

  async create() {
    this.backgroundCircle = new PatternCircle(
      this.centerX, this.centerY, this.circleDiameter, this.circleImg, this.tileSize
    );

    let count = this.diamondSteps.length;

    this.diamondSteps.forEach((step, i) => {
      let angleDeg = step.angle !== undefined ? step.angle : (360 / count) * i;
      let angle = radians(angleDeg);

      let radius = step.radius ?? this.circleDiameter / 4;
      let x = this.centerX + radius * cos(angle);
      let y = this.centerY + radius * sin(angle);

      // Points outward from center, like star rays — no +45° needed now,
      // since the diamond's natural long axis already points "up" by default
      let rotation = step.rotation !== undefined
        ? radians(step.rotation)
        : angle + radians(90);

      let width = step.width ?? 30;
      let height = step.height ?? 60;
      let imgTop = step.imgTop ?? step.img;
      let imgBottom = step.imgBottom ?? step.img;
      let tileSize = step.tileSize ?? this.tileSize;

      this.diamonds.push(
        new PatternDiamond(x, y, width, height, rotation, imgTop, imgBottom, tileSize)
      );
    });
  }

  display() {
    this.backgroundCircle.display();
    for (let d of this.diamonds) {
      d.display();
    }
  }
}