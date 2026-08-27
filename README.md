# Pookalam in p5.js

A digital Pookalam — the circular floral carpet laid out during Onam — drawn entirely in code with [p5.js](https://p5js.org/).

Instead of flower petals, every shape here is filled with a repeating pattern made from a flower photograph, so the design keeps the layered, concentric feel of a real Pookalam while being generated mathematically.

Built for the online hackathon conducted by **Muthoot Institute of Technology and Science**.

## About

| | |
|---|---|
| **Author** | 1st year B.Tech student, Electronics and VLSI Design & Technology |
| **Institute** | Muthoot Institute of Technology and Science |
| **Event** | Code A Pookalam - Online Hackathon |
| **Built with** | p5.js 2.0, HTML5 Canvas, plain JavaScript |
| **Editor** | Visual Studio Code |

## How it was made

The project was built through a mix of **vibe coding** — describing the design in plain language and iterating on the generated code — and **manual coding**, where the geometry, masking and layout maths were worked out and tuned by hand in VS Code.

Most of the visual decisions came from that back-and-forth: sketch an idea, render it, look at what the canvas actually produced, then adjust the numbers. A lot of the layer geometry went through several rounds of this before it looked right.

## The design

The Pookalam is built as a stack of independent layers, drawn back to front. Each layer is its own class, so it can be positioned, sized and re-imaged without touching the others.

| Layer | What it draws |
|---|---|
| **Layer 1** | Concentric pattern-filled circles forming the base of the design |
| **Layer 2** | A ring of rotated squares (diamonds) around the centre |
| **Layer 3** | A patterned disc with two-tone diamonds radiating out in a star |
| **Layer 4** | Small circles alternating between two images around a ring band |
| **Layer 5** | Half-circle components — nested circles masked by an inner circle, so they read as domes |
| **Layer 6** | Nested diamond components masked by the outer circle, forming the outermost border |

Two ideas do most of the work across the design.

**Pattern fills.** p5.js has no pattern fill of its own, so each shape is filled using the underlying canvas API. A flower image is copied, resized down to a small tile, and turned into a repeating pattern with `createPattern()`, which is then assigned to `drawingContext.fillStyle` before the shape is drawn. `PatternShape.buildPattern()` handles this in one place for every layer.

**Circular masking.** The outer layers use `drawingContext.clip()` to cut shapes against a circle. Layer 5 punches a hole with the even-odd fill rule to keep only what falls *outside* an inner circle, turning full circles into domes. Layer 6 does the reverse, keeping only what falls *inside* the outer circle, which turns diamonds into nested chevrons along the rim.

## Project structure

```
├── index.html          # loads p5.js and every script, in order
├── sketch.js           # setup(), draw(), image loading, layer configuration
├── PatternShape.js     # shared helper — builds a repeating pattern from an image
├── LayerOne.js
├── LayerTwo.js
├── LayerThree.js
├── LayerFour.js
├── LayerFive.js
└── LayerSix.js
```

Load order matters in `index.html`: `PatternShape.js` has to come before any layer that uses it, and all layers before `sketch.js`.

## Running it

Clone the repository:

```bash
git clone https://github.com/Nivedithatech/Pookalam.git
cd Pookalam
```

The flower images are loaded over the network, so opening `index.html` directly from the file system can fail on browser security restrictions. Serve it over HTTP instead:

```bash
# VS Code — right click index.html and choose "Open with Live Server"

# or with Python
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Configuring the layers

Every layer takes a `steps` array, where one entry describes one shape. Adding an entry adds a shape; changing a value changes just that shape. Nothing needs to be counted or spaced by hand — positions are worked out from the array length.

```javascript
// Layer 5 — one entry per half-circle component
let componentSteps = [
  { images: [images[0], images[1], images[2]] },
  { images: [images[3], images[4], images[5]] },
  { images: [images[0], images[2], images[4]] }
];

layerFive = new LayerFive(270, 270, 240, 360, componentSteps, 18);
await layerFive.create();
```

Common options include `sizeScale` for overall size, `ratios` for how the nested shapes step down, `angle` to place a component manually instead of spacing it evenly, and `tileSize` for how fine the flower pattern is.

`LayerSix` can also be rotated as a whole, either fixed or per frame:

```javascript
layerSix = new LayerSix(270, 270, 360, 500, diamondSteps, 18, { rotation: 30 });

// or, inside draw()
layerSix.rotateBy(0.3);
```

## Things learned along the way

- p5.js 2.0 removed `preload()`, so images are now loaded with `async`/`await` inside `setup()`.
- Anything the canvas can do is reachable through `drawingContext`, including patterns, clipping and shadows — p5 doesn't have to expose a feature for it to be usable.
- Two triangles sharing an edge leave a faint anti-aliasing seam; overlapping them very slightly hides it. A single `quad()` avoids the problem entirely when both halves share one fill.
- Loading images from another domain needs that server to allow cross-origin access, or the canvas becomes tainted and patterns fail.

## Acknowledgements

Muthoot Institute of Technology and Science, for hosting the hackathon.
The p5.js community, for the library and its documentation.

*Happy Onam.*