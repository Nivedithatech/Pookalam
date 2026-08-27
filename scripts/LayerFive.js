class HalfCircleComponent {
 
  constructor(
    centerX, centerY, angle,
    innerRadius, outerRadius,
    images, sizes, tileSize = 20, opts = {}
  ) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.angle = angle;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.images = images;
    this.sizes = sizes;
    this.tileSize = tileSize;

    this.sizeScale = opts.sizeScale ?? 2;          // 2X component
    this.ratios = opts.ratios ?? [1, 0.82, 0.5];   // proportions from the reference
    this.cutRatio = opts.cutRatio ?? 0.35;         // slab depth, as a fraction of the smallest circle
    this.cutDepth = opts.cutDepth;                 // or give it in px, overrides cutRatio
    this.clipOuter = opts.clipOuter ?? false;

    this.circles = [];
    this.reach = 0; // outermost radius the component touches
    this._build();
  }

  _defaultSizes(count, span) {
    let base = span * 1.6;
    let out = [];
    for (let i = 0; i < count; i++) {
      let r = this.ratios[i] ?? Math.pow(0.7, i);
      out.push(base * r);
    }
    return out;
  }

  _build() {
    let count = this.images.length;
    let span = this.outerRadius - this.innerRadius;

    let sizes = (this.sizes && this.sizes.length === count)
      ? this.sizes.slice()
      : this._defaultSizes(count, span);

    sizes = sizes
      .map(s => s * this.sizeScale)
      .sort((a, b) => b - a); // largest -> smallest, so each nests in the last

    let smallest = sizes[count - 1];

    // how far the shared tangent point sits inside the mask line
    let cut = this.cutDepth ?? smallest * this.cutRatio;
    // keep the smallest dome visible, and don't run past the layout centre
    cut = Math.max(0, Math.min(cut, smallest * 0.9, this.innerRadius));

    // the shared bottom tangent point, on the component's axis
    let tangentR = this.innerRadius - cut;
    this.reach = tangentR + sizes[0];

    for (let i = 0; i < count; i++) {
      let size = sizes[i];
      // every circle's bottom edge lands on that same tangent point
      let r = tangentR + size / 2;
      let x = this.centerX + r * cos(this.angle);
      let y = this.centerY + r * sin(this.angle);
      let pattern = PatternShape.buildPattern(this.images[i], this.tileSize);

      this.circles.push({ x, y, size, pattern });
    }
  }

  display() {
    push();
    noStroke();

    drawingContext.save();
    drawingContext.beginPath();

    if (this.clipOuter) {
      drawingContext.moveTo(this.centerX + this.reach, this.centerY);
      drawingContext.arc(this.centerX, this.centerY, this.reach, 0, TWO_PI);
    } else {
      drawingContext.rect(0, 0, width, height);
    }

    // punch the inner hole — this shaves the bottom slab off every circle
    drawingContext.moveTo(this.centerX + this.innerRadius, this.centerY);
    drawingContext.arc(this.centerX, this.centerY, this.innerRadius, 0, TWO_PI);
    drawingContext.clip('evenodd');

    // largest first, so the smaller domes stack on top
    for (let c of this.circles) {
      drawingContext.fillStyle = c.pattern;
      circle(c.x, c.y, c.size);
    }

    drawingContext.restore();
    pop();
  }
}

class LayerFive {
  constructor(
    centerX, centerY,
    innerDiameter, outerDiameter,
    componentSteps, tileSize = 20, opts = {}
  ) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.innerRadius = innerDiameter / 2;
    this.outerRadius = outerDiameter / 2;
    this.componentSteps = componentSteps;
    this.tileSize = tileSize;
    this.opts = opts;
    this.components = [];
  }

  async create() {
    let count = this.componentSteps.length;
    this.components = [];

    this.componentSteps.forEach((step, i) => {
      let angle = step.angle !== undefined
        ? radians(step.angle)
        : (TWO_PI / count) * i;

      let comp = new HalfCircleComponent(
        this.centerX, this.centerY, angle,
        this.innerRadius, this.outerRadius,
        step.images,
        step.sizes,
        step.tileSize ?? this.tileSize,
        {
          sizeScale: step.sizeScale ?? this.opts.sizeScale ?? 2,
          ratios:    step.ratios    ?? this.opts.ratios,
          cutRatio:  step.cutRatio  ?? this.opts.cutRatio,
          cutDepth:  step.cutDepth  ?? this.opts.cutDepth,
          clipOuter: step.clipOuter ?? this.opts.clipOuter ?? false,
        }
      );

      this.components.push(comp);
    });
  }

  display() {
    for (let c of this.components) {
      c.display();
    }
  }
}s