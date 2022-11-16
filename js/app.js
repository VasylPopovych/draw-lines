const canvas = document.getElementById("canvas");
const collapseButton = document.querySelector(".button");
const ctx = canvas.getContext("2d");

let coordinates = {};
let lines = [];
let previewLines = [];
let intersections = [];
let previewIntersections = [];

const drawLine = (line) => {
  ctx.beginPath();
  ctx.moveTo(line.x1 - canvas.getBoundingClientRect().x, line.y1 - canvas.getBoundingClientRect().y);
  ctx.lineTo(line.x2 - canvas.getBoundingClientRect().x, line.y2 - canvas.getBoundingClientRect().y);
  ctx.stroke();
};

const drawIntersection = (intersection) => {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.arc(
    Math.round(intersection.x) - canvas.getBoundingClientRect().x,
    Math.round(intersection.y) - canvas.getBoundingClientRect().y,
    5,
    0 * Math.PI,
    2 * Math.PI
  );
  ctx.fill();
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //draw lines
  for (let line of lines) {
    drawLine(line);
  }
  //draw preview line
  if (previewLines.length > 0) drawLine(previewLines[0]);
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
    coordinates = {};
    previewLines = [];
    //re-draw all lines
    draw();
    drawIntersections();
  } else if (e.button === 2) {
    coordinates = {};
    previewLines = [];
    previewIntersections = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    drawIntersections();
  }
};

const mouseMoveHandler = (e) => {
  if (coordinates.x) {
    previewLines = [];
    previewIntersections = [];
    intersections = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const previewLine = {
      x1: coordinates.x,
      y1: coordinates.y,
      x2: e.pageX,
      y2: e.pageY,
    };
    previewLines.push(previewLine);
    draw();
    if (lines.length > 0) drawIntersections();
  }
};

const getDistanceToCentre = (line) => {
  //get 1%, in px, distance to centre of line
  const lineCentreX = (line.x1 + line.x2) / 2;
  const lineCentreY = (line.y1 + line.y2) / 2;
  const distanceToCentreX = (line.x1 - lineCentreX) / 100;
  const distanceToCentreY = (line.y1 - lineCentreY) / 100;
  return { x: distanceToCentreX, y: distanceToCentreY };
};

const collapseLines = () => {
  if (lines.length === 0) return;
  let timerId = setInterval(() => {
    coordinates = [];
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
    coordinates = {};
  }, 3000);
};

// Functions for INTERSECTIONS

function checkIntersectsExist(a, b, c, d, p, q, r, s) {
  //this function checks if two lines has intersect
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
}

function getIntersection(lineA, lineB) {
  //this function get intersection of two lines
  if (
    lines.length > 0 &&
    checkIntersectsExist(lineA.x1, lineA.y1, lineA.x2, lineA.y2, lineB.x1, lineB.y1, lineB.x2, lineB.y2)
  ) {
    let c2x = lineB.x1 - lineB.x2;
    let c3x = lineA.x1 - lineA.x2;
    let c2y = lineB.y1 - lineB.y2;
    let c3y = lineA.y1 - lineA.y2;

    let d = c3x * c2y - c3y * c2x;

    if (d == 0) {
      throw new Error("Number of intersection points is zero or infinity.");
    }

    let u1 = lineA.x1 * lineA.y2 - lineA.y1 * lineA.x2;
    let u4 = lineB.x1 * lineB.y2 - lineB.y1 * lineB.x2;

    let px = (u1 * c2x - c3x * u4) / d;
    let py = (u1 * c2y - c3y * u4) / d;

    let intersectionPoint = { x: px, y: py };
    return intersectionPoint;
  }
}

const getAllLinesIntersections = () => {
  //fucntion for checking all lines for intersection
  for (let i = 0; i < lines.length; i++) {
    for (let line of lines) {
      let intersection = getIntersection(lines[i], line);
      //check intersections for dublicates
      if (intersection && !intersections.find((item) => item.x === intersection.x && item.y === intersection.y)) {
        intersections.push(intersection);
      }
    }
  }
  if (previewLines.length === 0) return;
  for (let line of lines) {
    let intersection = getIntersection(previewLines[0], line);
    if (intersection) previewIntersections.push(intersection);
  }
};

const drawIntersections = () => {
  getAllLinesIntersections();
  //draw intersections
  for (let intersection of intersections) {
    drawIntersection(intersection);
  }
  //draw preview intersections
  for (let intersection of previewIntersections) {
    drawIntersection(intersection);
  }
};

canvas.addEventListener("mouseup", clickHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);
collapseButton.addEventListener("click", collapseLines);
