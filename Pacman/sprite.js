export class Player {
  constructor({ i, j }) {
    this.posX = j * 80 + 40;
    this.posY = i * 80 + 40;
    this.velX = 0;
    this.velY = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(this.posX, this.posY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
