import { drawLine } from "./utils";

export class Line {
  constructor() {
    this.posX = Math.random() * canvas.width;
    this.posY = Math.random() * canvas.height;
    this.velX = 1;
    this.velY = 1;
    this.angleRadian = Math.atan2(200 - this.posY, 200 - this.posX);
    this.angleDegree = (this.angleRadian / Math.PI) * 180;
    this.forceX = this.velX * Math.cos(this.angleRadian);
    this.forceY = this.velY * Math.sin(this.angleRadian);
    this.length = 20;
    this.lengthX = this.posX + this.length * this.forceX;
    this.lengthY = this.posY + this.length * this.forceY;
    this.gap = 20;
    this.gapX = this.gap * this.forceX;
    this.gapY = this.gap * this.forceY;
    this.color = "brown";
  }

  draw(ctx) {
    drawLine(this.posX, this.posY, this.lengthX, this.lengthY, this.color, ctx);
  }

  update(ctx) {
    this.posX = this.lengthX + this.gapX;
    this.posY = this.lengthY + this.gapY;
    this.lengthX = this.posX + this.length * this.forceX;
    this.lengthY = this.posY + this.length * this.forceY;
    this.draw(ctx);
  }
}
