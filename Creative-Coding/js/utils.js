export function drawLine(x1, y1, x2, y2, color, ctx) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

export function drawLinePieceByPiece(x1, y1, x2, y2, color, ctx) {
  let angle = Math.atan2(y2 - y1, x2 - x1);
  let x = Math.cos(angle);
  let y = Math.sin(angle);
  let dirX = x1 + x;
  let dirY = y1 + y;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  while (dirX < x2 && dirY < y2) {
    dirX = x1 + x;
    dirY = y1 + y;
    ctx.lineTo(dirX, dirY);
    x1 = dirX;
    y1 = dirY;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  ctx.closePath();
}
