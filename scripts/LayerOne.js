class PatternCircle {
  constructor(x, y, diameter, img, tileSize = 40) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.pattern = PatternShape.buildPattern(img, tileSize);
  }

  display() {
    push();
    noStroke();
    drawingContext.fillStyle = this.pattern;
    circle(this.x, this.y, this.diameter);
    pop();
  }
}

class LayerOne {
  constructor(centerX, centerY, images) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.images = images;

    this.circles = [];
  }

  async create() {
    // Which image goes with which diameter — edit freely
    let steps = [
      { img: this.images[2], dia: 540 , tileSize: 90},
      { img: this.images[8], dia: 500 , tileSize: 90},
      { img: this.images[7], dia: 360 , tileSize: 40},
      { img: this.images[1], dia: 240 , tileSize: 40},
      { img: this.images[9], dia: 180 , tileSize: 90},

    ];

    steps.forEach(step => {
      this.circles.push(
        new PatternCircle(this.centerX, this.centerY, step.dia, step.img, step.tileSize)
      );
    });
  }

  display() {
    for (let c of this.circles) {
      c.display(); // first pushed = back, last pushed = front
    }
  }
}