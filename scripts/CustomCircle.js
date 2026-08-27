class CustomCircle {
  constructor(x, y, diameter, fill, tileSize = 40) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.tileSize = tileSize;
    this.pattern = null;
    this.solidColor = null;

    this._setFill(fill);
  }

  _buildPattern(img, tileSize) {
    let thumb = createImage(img.width, img.height);
    thumb.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    thumb.resize(tileSize, tileSize);
    return drawingContext.createPattern(thumb.canvas, 'repeat');
  }

  _setFill(fill) {
    if (fill && typeof fill === 'object' && fill.width !== undefined) {
      this.pattern = this._buildPattern(fill, this.tileSize);
    } else {
      this.solidColor = fill;
    }
  }

  setImage(img, tileSize = this.tileSize) {
    this.tileSize = tileSize;
    this.pattern = this._buildPattern(img, tileSize);
    this.solidColor = null;
  }

  setColor(c) {
    this.solidColor = c;
    this.pattern = null;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setDiameter(d) {
    this.diameter = d;
  }

  display() {
    push();
    noStroke();
    if (this.pattern) {
      drawingContext.fillStyle = this.pattern;
    } else if (this.solidColor) {
      fill(this.solidColor);
    } else {
      noFill();
    }
    circle(this.x, this.y, this.diameter);
    pop();
  }
}