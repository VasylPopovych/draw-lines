const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let coordinates = {};

export const clickHandler = (e) => {
  if (e.button === 0 && !coordinates.pageX) {
    coordinates.pageX = e.pageX;
    coordinates.pageY = e.pageY;
  } else if (e.button === 0 && coordinates.pageX) {
    //draw line
    ctx.beginPath();
    ctx.moveTo(
      coordinates.pageX - canvas.getBoundingClientRect().x,
      coordinates.pageY - canvas.getBoundingClientRect().y
    );
    ctx.lineTo(e.pageX - canvas.getBoundingClientRect().x, e.pageY - canvas.getBoundingClientRect().y);
    ctx.stroke();
    //empty coordinates
    coordinates = {};
  } else if (e.button === 2) {
    e.preventDefault();
    coordinates = {};
  }
};

canvas.addEventListener("mouseup", clickHandler);
