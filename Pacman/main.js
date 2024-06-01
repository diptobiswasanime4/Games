import "./style.css";
import { setupCounter } from "./counter.js";
import { Player } from "./sprite.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Map {
  constructor(mapArr) {
    this.pos = mapArr;
    this.width = 80;
    this.height = 80;
    this.gap = 5;
  }

  draw() {
    for (let i = 0; i < this.pos.length; i++) {
      for (let j = 0; j < this.pos[i].length; j++) {
        if (this.pos[i][j] == "wall") {
          ctx.fillStyle = "blue";
          ctx.fillRect(
            i * this.width,
            j * this.height,
            this.width - this.gap,
            this.height - this.gap
          );
        } else if (this.pos[i][j] == "player") {
          new Player({ i, j }).draw(ctx);
        }
      }
    }
  }
}

const mapArr = [
  ["wall", "wall", "wall", "wall", "wall"],
  ["wall", "path", "player", "path", "wall"],
  ["wall", "path", "wall", "path", "wall"],
  ["wall", "path", "path", "path", "wall"],
  ["wall", "wall", "wall", "wall", "wall"],
];

const map = new Map(mapArr);

map.draw();

// const player = new Player();

// player.draw(ctx);
