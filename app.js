const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cliked = (e) => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(e.pageX - canvas.getBoundingClientRect().x, e.pageY - canvas.getBoundingClientRect().y);
  ctx.stroke();
  //console.log(e.pageY);
};

const mouseMoved = (e) => {
  //console.log(e);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(e.pageX - canvas.getBoundingClientRect().x, e.pageY - canvas.getBoundingClientRect().y);
  ctx.stroke();
};

canvas.addEventListener("click", cliked);
canvas.addEventListener("mousemove", mouseMoved);
