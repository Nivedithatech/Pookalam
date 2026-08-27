class PatternSquare {
  constructor(x, y, size, rotation, img, tileSize = 25) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rotation = rotation;
    this.pattern = PatternShape.buildPattern(img, tileSize);
  }

  display() {
    push();
    noStroke();
    translate(this.x, this.y);
    rotate(this.rotation);
    drawingContext.fillStyle = this.pattern;
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
  }
}

class LayerTwo {
  constructor(centerX, centerY, ringRadius, steps, tileSize = 25) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.ringRadius = ringRadius;
    this.steps = steps;       // explicit array — one entry per square
    this.tileSize = tileSize;
    this.squares = [];
  }

  async create() {
    let count = this.steps.length;

    this.steps.forEach((step, i) => {
      // Auto-distribute evenly around the ring unless an angle is given
      let angle = step.angle !== undefined
        ? radians(step.angle)
        : (TWO_PI / count) * i;

      let x = this.centerX + this.ringRadius * cos(angle);
      let y = this.centerY + this.ringRadius * sin(angle);
      let rotation = radians(step.rotation ?? 45);
      let size = step.size ?? 60;
      let tileSize = step.tileSize ?? this.tileSize;

      this.squares.push(new PatternSquare(x, y, size, rotation, step.img, tileSize));
    });
  }

  display() {
    for (let sq of this.squares) {
      sq.display();
    }
  }
}