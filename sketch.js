let imgURLs = [
  "https://citylineflorist.imgix.net/assets/img/symbolism/red-flowers.jpg",
  "https://citylineflorist.imgix.net/assets/img/symbolism/orange-flowers.jpg",
  "https://citylineflorist.imgix.net/assets/img/symbolism/green-flowers.jpg",
  "https://citylineflorist.imgix.net/assets/img/symbolism/blue-flowers.jpg",
  "https://citylineflorist.imgix.net/assets/img/symbolism/purple-flowers.jpg",
  "https://citylineflorist.imgix.net/assets/img/symbolism/indigo-flowers.jpg",
  "https://hips.hearstapps.com/hmg-prod/images/white-chrysanthemums-royalty-free-image-1722970619.jpg",
  "https://images.unsplash.com/photo-1678715065824-21653c018e84?fm=jpg",
  "https://media.istockphoto.com/id/2197194487/photo/chrysanthemum.jpg",
  "https://t4.ftcdn.net/jpg/00/63/96/83/360_F_63968347_Kt6RJf2ZO61Fy9V4KYns23PXo6bmnCEy.jpg"
];

let images = [];
let layerOne, layerTwo;
let diamondCircle;
async function setup() {
  createCanvas(540, 540);
  angleMode(RADIANS);

  images = await Promise.all(imgURLs.map(url => loadImage(url)));

  layerOne = new LayerOne(270, 270, images);
  await layerOne.create();

  // Explicit control over every square — count = array length
  let squareSteps = [
    { img: images[8], size: 48, rotation: 75 },
    { img: images[0], size: 48, rotation: 65 },
    { img: images[8], size: 48, rotation: 75 },
    { img: images[0], size: 48, rotation: 85 },
    { img: images[8], size: 48, rotation: 95 },
    { img: images[0], size: 48, rotation: 105 },
    { img: images[8], size: 48, rotation: 115 },
    { img: images[0], size: 48, rotation: 125 },
    { img: images[8], size: 48, rotation: 135 },
    { img: images[0], size: 48, rotation: 145 }
  ];

  layerTwo = new LayerTwo(270, 270, 57.5, squareSteps, 25);
  await layerTwo.create();
  //---------------------


  // Pattern-filled circle
  diamondCircle = new CustomCircle(270, 270, 120, images[2], 30);

  // Diamonds arranged like a star inside a patterned background circle
  let diamondSteps = [
    { img: images[6], width: 30, height: 70, radius: 35 },
    { img: images[6], width: 30, height: 70, radius: 35 },
    { imgTop: images[6], imgBottom: images[6], width: 30, height: 70, radius: 35 }, // split fill!
    { img: images[6], width: 30, height: 70, radius: 35 },
    { img: images[6], width: 30, height: 70, radius: 35 },
    { img: images[6], width: 30, height: 70, radius: 35 }
  ];

  layerThree = new LayerThree(270, 270, 90, images[3], diamondSteps, 40);

  await layerThree.create();

  layerFour = new LayerFour(270, 270, 180, 240, images[6], images[5], 16, 25, 20);
  await layerFour.create();

  //layer five
  let componentSteps = [
    { images: [images[2], images[9], images[7]] },
    { images: [images[2], images[9], images[7]] },
    { images: [images[2], images[9], images[7]] },
    { images: [images[2], images[9], images[7]] },
    { images: [images[2], images[9], images[7]] },
    { images: [images[2], images[9], images[7]] },
    { images: [images[2], images[9], images[7]] }
  ];

  layerFive = new LayerFive(270, 270, 240, 360, componentSteps, 18, { sizeScale: 1});
  await layerFive.create();

  

  let diamondSteps2 = [
    { images: [images[4], images[0], images[7]] },
    { images: [images[4], images[0], images[7]] },
    { images: [images[4], images[0], images[7]] },
    { images: [images[4], images[0], images[7]] },
    { images: [images[4], images[0], images[7]] },
    { images: [images[4], images[0], images[7]] },
    { images: [images[4], images[0], images[7]] }
  ];

  layerSix = new LayerSix(270, 270, 360, 500, diamondSteps2, 18 , { rotation: 30 });
  await layerSix.create();
}

function draw() {
    background(255);
    layerOne.display();
    layerTwo.display();
    diamondCircle.display();
    layerThree.display();
    layerFour.display();
    layerFive.display();
   
    layerSix.rotateBy(0.3);
    layerSix.display();
}