const canvas = document.getElementById("canvas");
const collapseButton = document.querySelector(".button");
const ctx = canvas.getContext("2d");

let coordinates = {};
let lines = [];
let previewLines = [];
let allCoordinates;

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let line of lines) {
    ctx.beginPath();
    ctx.moveTo(line.x1 - canvas.getBoundingClientRect().x, line.y1 - canvas.getBoundingClientRect().y);
    ctx.lineTo(line.x2 - canvas.getBoundingClientRect().x, line.y2 - canvas.getBoundingClientRect().y);
    ctx.stroke();
  }
};

const drawPreviewLine = () => {
  ctx.beginPath();
  ctx.moveTo(
    previewLines[0].x1 - canvas.getBoundingClientRect().x,
    previewLines[0].y1 - canvas.getBoundingClientRect().y
  );
  ctx.lineTo(
    previewLines[0].x2 - canvas.getBoundingClientRect().x,
    previewLines[0].y2 - canvas.getBoundingClientRect().y
  );
  ctx.stroke();
};

const clickHandler = (e) => {
  if (e.button === 0 && !coordinates.x) {
    coordinates.x = e.pageX;
    coordinates.y = e.pageY;
  } else if (e.button === 0 && coordinates.x) {
    //add lines to store
    let line = {
      x1: coordinates.x,
      y1: coordinates.y,
      x2: e.pageX,
      y2: e.pageY,
    };
    lines.push(line);
    //empty coordinates
    coordinates = {};
    //re-draw all lines
    draw();
    console.log(line);
  } else if (e.button === 2) {
    coordinates = {};
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  }
};

const mouseMoveHandler = (e) => {
  if (coordinates.x) {
    previewLines = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const previewLine = {
      x1: coordinates.x,
      y1: coordinates.y,
      x2: e.pageX,
      y2: e.pageY,
    };
    previewLines.push(previewLine);
    draw();
    drawPreviewLine();
  }
};

const colapseLines = () => {
  const getDistanceToCentre = (line) => {
    const lineCentreX = (line.x1 + line.x2) / 2;
    const lineCentreY = (line.y1 + line.y2) / 2;
    const distanceToCentreX = (line.x1 - lineCentreX) / 100;
    const distanceToCentreY = (line.y1 - lineCentreY) / 100;
    return { x: distanceToCentreX, y: distanceToCentreY };
  };
  let timerId = setInterval(() => {
    if (lines[0].x1 > getDistanceToCentre(lines[0]).x) {
      for (let line of lines) {
        line.x1 -= getDistanceToCentre(line).x;
        line.y1 -= getDistanceToCentre(line).y;
        line.x2 += getDistanceToCentre(line).x;
        line.y2 += getDistanceToCentre(line).y;
        draw();
      }
    }
  }, 5);
  setTimeout(() => {
    clearInterval(timerId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines = [];
  }, 3000);
};

const getIntersection = () => {};

canvas.addEventListener("mouseup", clickHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);
collapseButton.addEventListener("click", colapseLines);
