class PatternShape {
  static buildPattern(img, tileSize) {
    let thumb = createImage(img.width, img.height);
    thumb.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    thumb.resize(tileSize, tileSize);
    return drawingContext.createPattern(thumb.canvas, 'repeat');
  }
}