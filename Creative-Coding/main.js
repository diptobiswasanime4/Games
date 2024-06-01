import "./style.css";
import { Line } from "./js/Line";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let selectorElem = document.getElementById("selector");
let magnet = document.getElementById("magnet");
let particleEffect = document.getElementById("particle-effect");
let flowfield = document.getElementById("flowfield");

let selector = "flowfield";
let reqId;

selectorElem.addEventListener("click", (e) => {
  selector = e.target.id;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(reqId);
  init();
});

function init() {
  if (selector == "particle-effect") {
  } else if (selector == "magnet") {
  } else if (selector == "flowfield") {
    let convergePointX = 200;
    let convergePointY = 200;
    let linesCount = 200;
    let lines = [];

    for (let i = 0; i < linesCount; i++) {
      lines.push(new Line());
    }

    function animate() {
      console.log(1);
      lines.forEach((line) => {
        line.update(ctx);
      });
      reqId = requestAnimationFrame(animate);
    }
    animate();
  }
}

init();
