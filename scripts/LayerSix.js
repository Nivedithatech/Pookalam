class DiamondStackComponent {
  /**
   * Three (or more) CONCENTRIC diamonds, largest first, all sharing one centre
   * that sits on the outer mask circle.
   *
   * The mask keeps only what is INSIDE maskRadius, so each diamond loses its
   * outward half and what remains is a triangle pointing inward — nested
   * chevrons under the arc, exactly like the masked reference.
   *
   * The diamond's long axis is rotated to the component's angle, so the tip
   * aims at the centre of the layout.
   *
   * @param {number} centerX, centerY - center of the whole ring layout
   * @param {number} angle - direction (radians) this component points, from center outward
   * @param {number} maskRadius - the outer clip circle (500 diameter -> 250)
   * @param {number} innerRadius - inner boundary of the band, used for default sizing
   * @param {p5.Image[]} images - one per diamond, ordered largest -> smallest
   * @param {number[]} sizes - explicit heights (largest first); omit to use ratios
   * @param {number} tileSize - pattern tile size
   * @param {object} opts - { sizeScale, ratios, widthRatio, centerOffset }
   */
  constructor(
    centerX, centerY, angle,
    maskRadius, innerRadius,
    images, sizes, tileSize = 20, opts = {}
  ) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.angle = angle;
    this.maskRadius = maskRadius;
    this.innerRadius = innerRadius;
    this.images = images;
    this.sizes = sizes;
    this.tileSize = tileSize;

    this.sizeScale = opts.sizeScale ?? 1;
    this.ratios = opts.ratios ?? [1, 0.66, 0.3]; // proportions from the reference
    this.widthRatio = opts.widthRatio ?? 1;      // 1 = square diamond; <1 narrow, >1 wide
    // slide the shared centre in/out from the mask circle.
    // 0 = centre sits on the arc, so every diamond is cut exactly in half.
    this.centerOffset = opts.centerOffset ?? 0;

    this.diamonds = [];
    this._build();
  }

  _defaultSizes(count, span) {
    // visible half of the biggest diamond fills the band exactly
    let base = span * 2;
    let out = [];
    for (let i = 0; i < count; i++) {
      let r = this.ratios[i] ?? Math.pow(0.66, i);
      out.push(base * r);
    }
    return out;
  }

  _build() {
    // accept { images: [...] }, { img: single }, or a bare array/image
    let imgs = this.images;
    if (imgs && !Array.isArray(imgs)) imgs = [imgs];
    if (imgs) imgs = imgs.filter(im => im && im.width !== undefined);

    if (!imgs || imgs.length === 0) {
      throw new Error(
        'LayerSix: each componentSteps entry needs an images array, e.g. ' +
        '{ images: [images[0], images[2], images[4]] }. ' +
        'Also check that the images finished loading before create() ran.'
      );
    }
    this.images = imgs;

    let count = imgs.length;
    let span = this.maskRadius - this.innerRadius;

    let sizes = (this.sizes && this.sizes.length === count)
      ? this.sizes.slice()
      : this._defaultSizes(count, span);

    sizes = sizes
      .map(s => s * this.sizeScale)
      .sort((a, b) => b - a); // largest -> smallest, so each nests in the last

    // one shared centre for all of them, on the mask arc by default
    let r = this.maskRadius + this.centerOffset;
    let x = this.centerX + r * cos(this.angle);
    let y = this.centerY + r * sin(this.angle);

    // long axis points along the component's direction
    let rotation = this.angle + radians(90);

    for (let i = 0; i < count; i++) {
      let h = sizes[i];
      let w = h * this.widthRatio;
      let pattern = PatternShape.buildPattern(this.images[i], this.tileSize);
      this.diamonds.push({ x, y, w, h, rotation, pattern });
    }
  }

  display() {
    push();
    noStroke();

    // keep only what falls INSIDE the outer circle
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(this.centerX, this.centerY, this.maskRadius, 0, TWO_PI);
    drawingContext.clip();

    // largest first, so the smaller ones stack on top
    for (let d of this.diamonds) {
      push();
      translate(d.x, d.y);
      rotate(d.rotation);
      drawingContext.fillStyle = d.pattern;

      let halfW = d.w / 2;
      let halfH = d.h / 2;
      quad(0, -halfH, halfW, 0, 0, halfH, -halfW, 0); // one shape, no seam
      pop();
    }

    drawingContext.restore();
    pop();
  }
}

class LayerSix {
  /**
   * @param {number} centerX, centerY
   * @param {number} innerDiameter - inner boundary of the band (e.g. 360)
   * @param {number} outerDiameter - the mask circle (e.g. 500)
   * @param {Array} componentSteps - one per component:
   *        { images: [big, mid, small], sizes?, angle?, tileSize?,
   *          sizeScale?, ratios?, widthRatio?, centerOffset? }
   * @param {number} tileSize - default pattern tile size
   * @param {object} opts - defaults applied to every component,
   *                        plus { rotation } in degrees for the whole layer
   */
  constructor(
    centerX, centerY,
    innerDiameter, outerDiameter,
    componentSteps, tileSize = 20, opts = {}
  ) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.innerRadius = innerDiameter / 2;
    this.maskRadius = outerDiameter / 2;
    this.componentSteps = componentSteps;
    this.tileSize = tileSize;
    this.opts = opts;
    this.components = [];

    // whole-layer spin, in radians internally
    this.rotation = radians(opts.rotation ?? 0);
  }

  // set an absolute angle, in degrees
  setRotation(deg) {
    this.rotation = radians(deg);
  }

  // nudge it, in degrees — handy per frame in draw()
  rotateBy(deg) {
    this.rotation += radians(deg);
  }

  async create() {
    let count = this.componentSteps.length;
    this.components = [];

    this.componentSteps.forEach((step, i) => {
      // allow a bare array of images per component, not just { images: [...] }
      let cfg = Array.isArray(step) ? { images: step } : step;

      let angle = cfg.angle !== undefined
        ? radians(cfg.angle)
        : (TWO_PI / count) * i;

      let comp = new DiamondStackComponent(
        this.centerX, this.centerY, angle,
        this.maskRadius, this.innerRadius,
        cfg.images ?? cfg.img,
        cfg.sizes,
        cfg.tileSize ?? this.tileSize,
        {
          sizeScale:    cfg.sizeScale    ?? this.opts.sizeScale ?? 1,
          ratios:       cfg.ratios       ?? this.opts.ratios,
          widthRatio:   cfg.widthRatio   ?? this.opts.widthRatio,
          centerOffset: cfg.centerOffset ?? this.opts.centerOffset,
        }
      );

      this.components.push(comp);
    });
  }

  display() {
    push();

    // spin the whole layer about the layout centre.
    // the mask is a circle centred on the same point, so it is unaffected.
    if (this.rotation !== 0) {
      translate(this.centerX, this.centerY);
      rotate(this.rotation);
      translate(-this.centerX, -this.centerY);
    }

    for (let c of this.components) {
      c.display();
    }

    pop();
  }
}