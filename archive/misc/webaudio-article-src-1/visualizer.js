'use strict';

function setup(args, ctx) {
  args = validateArguments(args);

  ctx.visualizationElements = setUpVisualizationElements(args.spacing, ctx);

  startListeningToVisualizer(args, ctx);
};

function cleanup(args, ctx) {
  stopListeningToVisualizer(ctx);
};

var parameters = [
  { key: 'spacing', type: 'float', default: 2.0, name: 'Spheres Spacing' },
  { key: 'maxHeight', type: 'float', default: 4.0, name: 'Spheres Height' }
];

function startListeningToVisualizer(args, ctx) {
  if (document.getElementById("micInputVisualizer")) {
    // Passing the events to Visualizer.js via the blank div
    ctx.worldData.micInputVisualizer = document.getElementById("micInputVisualizer");
    ctx.worldData.micInputVisualizer.addEventListener("VisualizeBuffer", (e) => { visualizeBuffer(e.detail, args.maxHeight, ctx) });
  }
}

function stopListeningToVisualizer(ctx) {
  if (ctx.worldData.micInputVisualizer) {
    ctx.worldData.micInputVisualizer.removeEventListener("VisualizeBuffer", visualizeBuffer);
  }
}

function visualizeBuffer(buffer, maxHeight, ctx) {
  let vizBuffer = downsampledBuffer(buffer, ctx.visualizationElements.length);

  assignBufferValuesToVizElements(ctx.visualizationElements, maxHeight, vizBuffer);
  
}

function downsampledBuffer(buffer, numElements) {
  let increment = Math.round(buffer.length / numElements);
  let downsampledBuffer = new Float32Array(numElements).fill(0);

  for (let i = 0; i < numElements; i++) {
    downsampledBuffer[i] = buffer[i * increment];
  }

  return downsampledBuffer;
}

function assignBufferValuesToVizElements(vizElementsArray, maxHeight, values) {
  if (values.length != vizElementsArray.length) {
    throw "The number of visualization elements does not match the length of buffer array used for visualization";
  }
  
  if (values.includes(NaN)) return;

  for (let i = 0, numElements = vizElementsArray.length; i < numElements; i++) {
    let x = vizElementsArray[i].getTranslation().x;
    let z = vizElementsArray[i].getTranslation().z;
    vizElementsArray[i].setTranslation(new sumerian.Vector3(x, maxHeight * values[i], z));
  }
}

function setUpVisualizationElements(spacing, ctx) {
  const element1 = ctx.world.by.name('Sphere').first();
  const element2 = ctx.world.by.name('Sphere 2').first();
  const element3 = ctx.world.by.name('Sphere 3').first();
  const element4 = ctx.world.by.name('Sphere 4').first();
  const element5 = ctx.world.by.name('Sphere 5').first();

  const vizElements = [element1, element2, element3, element4, element5];

  for (let i = 0; i < vizElements.length; i++) {
    vizElements[i].setTranslation(new sumerian.Vector3(vizElements[0].getTranslation().x + (spacing * i), 0, 0));
  }

  return vizElements;
}

function validateArguments(args) {
  if (!Number(args.spacing)) {
    throw "Please input a float or integer value for spacing between elements of mic output visualization";
  }

  if (!Number(args.maxHeight)) {
    throw "Please input a float or integer value for max height value used for mic output visualization";
  }

  return args;
}