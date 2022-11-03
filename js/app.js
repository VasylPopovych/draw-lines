const canvas = document.getElementById("canvas");
const collapseButton = document.querySelector(".button");
const ctx = canvas.getContext("2d");

let coordinates = {};
let lines = [];
let previewLines = [];

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

canvas.addEventListener("mouseup", clickHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);
collapseButton.addEventListener("click", () => {
  lines = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
