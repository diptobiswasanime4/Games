const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

HOME_DISTANCE = 245;
HOME_GAP = 90;
HOME_OUTER_SIDE = 155;
HOME_BORDER = 25;
HOME_INNER_SIDE = 105;
UNIT_HOME_SIZE = 30;
UNIT_HOME_GAP = 15;
UNIT_OUTER_RADIUS = 15;
UNIT_INNER_RADIUS = 10;
UNIT_OUTER_RADIUS_PLAY = 12;
UNIT_INNER_RADIUS_PLAY = 8;
PATH_BOX_LENGTH = 30;
PATH_BOX_BREADTH = 155 / 6;

let homes = ["red", "dodgerblue", "green", "gold"];
let path = [];
let players = ["red", "dodgerblue", "green", "yellow"];
let winners = ["red", "dodgerblue", "green", "gold"];

function drawHome(color) {
  ctx.fillStyle = color;
  let x, y;

  if (color == "red") {
    x = 0;
    y = 0;
  } else if (color == "dodgerblue") {
    x = HOME_DISTANCE;
    y = 0;
  } else if (color == "green") {
    x = HOME_DISTANCE;
    y = HOME_DISTANCE;
  } else {
    x = 0;
    y = HOME_DISTANCE;
  }

  ctx.fillRect(x, y, HOME_OUTER_SIDE, HOME_OUTER_SIDE);

  ctx.clearRect(
    x + HOME_BORDER,
    y + HOME_BORDER,
    HOME_INNER_SIDE,
    HOME_INNER_SIDE
  );

  ctx.fillRect(
    x + HOME_BORDER + UNIT_HOME_GAP,
    y + HOME_BORDER + UNIT_HOME_GAP,
    UNIT_HOME_SIZE,
    UNIT_HOME_SIZE
  );

  ctx.fillRect(
    x + HOME_BORDER + UNIT_HOME_SIZE + 2 * UNIT_HOME_GAP,
    y + HOME_BORDER + UNIT_HOME_GAP,
    UNIT_HOME_SIZE,
    UNIT_HOME_SIZE
  );

  ctx.fillRect(
    x + HOME_BORDER + UNIT_HOME_GAP,
    y + HOME_BORDER + UNIT_HOME_SIZE + 2 * UNIT_HOME_GAP,
    UNIT_HOME_SIZE,
    UNIT_HOME_SIZE
  );

  ctx.fillRect(
    x + HOME_BORDER + UNIT_HOME_SIZE + 2 * UNIT_HOME_GAP,
    y + HOME_BORDER + UNIT_HOME_SIZE + 2 * UNIT_HOME_GAP,
    UNIT_HOME_SIZE,
    UNIT_HOME_SIZE
  );

  ctx.beginPath();
  ctx.arc(
    x + HOME_BORDER + UNIT_HOME_GAP + UNIT_HOME_SIZE / 2,
    y + HOME_BORDER + UNIT_HOME_GAP + UNIT_HOME_SIZE / 2,
    UNIT_OUTER_RADIUS,
    0,
    Math.PI * 2
  );
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(
    x + HOME_BORDER + UNIT_HOME_GAP + UNIT_HOME_SIZE / 2,
    y + HOME_BORDER + UNIT_HOME_GAP + UNIT_HOME_SIZE / 2,
    UNIT_INNER_RADIUS,
    0,
    Math.PI * 2
  );
  ctx.stroke();
  ctx.closePath();
}

function drawWinner(color) {
  ctx.fillStyle = color;

  let x1, y1, x2, y2;

  if (color == "red") {
    x1 = HOME_OUTER_SIDE;
    y1 = HOME_OUTER_SIDE;
    x2 = HOME_OUTER_SIDE;
    y2 = HOME_OUTER_SIDE + HOME_GAP;
  } else if (color == "dodgerblue") {
    x1 = HOME_OUTER_SIDE;
    y1 = HOME_OUTER_SIDE;
    x2 = HOME_OUTER_SIDE + HOME_GAP;
    y2 = HOME_OUTER_SIDE;
  } else if (color == "gold") {
    x1 = HOME_DISTANCE;
    y1 = HOME_DISTANCE;
    x2 = HOME_OUTER_SIDE;
    y2 = HOME_OUTER_SIDE + HOME_GAP;
  } else {
    x1 = HOME_DISTANCE;
    y1 = HOME_DISTANCE;
    x2 = HOME_OUTER_SIDE + HOME_GAP;
    y2 = HOME_OUTER_SIDE;
  }

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(200, 200);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

winners.forEach((winner) => {
  drawWinner(winner);
});

homes.forEach((home) => {
  drawHome(home);
});

for (let i = 0; i < 52; i++) {
  if (i >= 5 && i <= 17) {
    if (i == 13) {
      path.push({
        type: "darkblue",
        pos: {
          x: HOME_OUTER_SIDE + PATH_BOX_LENGTH * 2,
          y: (i - 12) * PATH_BOX_BREADTH,
          w: PATH_BOX_LENGTH,
          h: PATH_BOX_BREADTH,
        },
      });
    } else {
      if (i >= 12) {
        path.push({
          type: "regular",
          pos: {
            x: HOME_OUTER_SIDE + PATH_BOX_LENGTH * 2,
            y: (i - 12) * PATH_BOX_BREADTH,
            w: PATH_BOX_LENGTH,
            h: PATH_BOX_BREADTH,
          },
        });
      } else if (i == 11) {
        path.push({
          type: "regular",
          pos: {
            x: HOME_OUTER_SIDE + PATH_BOX_LENGTH,
            y: 0,
            w: PATH_BOX_LENGTH,
            h: PATH_BOX_BREADTH,
          },
        });
      } else {
        path.push({
          type: "regular",
          pos: {
            x: HOME_OUTER_SIDE,
            y: (10 - i) * PATH_BOX_BREADTH,
            w: PATH_BOX_LENGTH,
            h: PATH_BOX_BREADTH,
          },
        });
      }
    }
  } else if (i >= 18 && i <= 30) {
    if (i == 26) {
      path.push({
        type: "darkgreen",
        pos: {
          x: HOME_DISTANCE + (30 - i) * PATH_BOX_BREADTH,
          y: HOME_OUTER_SIDE + PATH_BOX_LENGTH * 2,
          w: PATH_BOX_BREADTH,
          h: PATH_BOX_LENGTH,
        },
      });
    } else {
      if (i >= 25) {
        path.push({
          type: "regular",
          pos: {
            x: HOME_DISTANCE + (30 - i) * PATH_BOX_BREADTH,
            y: HOME_OUTER_SIDE + PATH_BOX_LENGTH * 2,
            w: PATH_BOX_BREADTH,
            h: PATH_BOX_LENGTH,
          },
        });
      } else if (i == 24) {
        path.push({
          type: "regular",
          pos: {
            x: HOME_DISTANCE + 5 * PATH_BOX_BREADTH,
            y: HOME_OUTER_SIDE + PATH_BOX_LENGTH,
            w: PATH_BOX_BREADTH,
            h: PATH_BOX_LENGTH,
          },
        });
      } else {
        path.push({
          type: "regular",
          pos: {
            x: HOME_DISTANCE + (i - 18) * PATH_BOX_BREADTH,
            y: HOME_OUTER_SIDE,
            w: PATH_BOX_BREADTH,
            h: PATH_BOX_LENGTH,
          },
        });
      }
    }
  } else if (i >= 31 && i <= 43) {
    if (i == 39) {
      path.push({
        type: "orange",
        pos: {
          x: HOME_OUTER_SIDE,
          y: HOME_DISTANCE + (43 - i) * PATH_BOX_BREADTH,
          w: PATH_BOX_LENGTH,
          h: PATH_BOX_BREADTH,
        },
      });
    } else {
      if (i >= 38) {
        path.push({
          type: "regular",
          pos: {
            x: HOME_OUTER_SIDE,
            y: HOME_DISTANCE + (43 - i) * PATH_BOX_BREADTH,
            w: PATH_BOX_LENGTH,
            h: PATH_BOX_BREADTH,
          },
        });
      } else if (i == 37) {
        path.push({
          type: "regular",
          pos: {
            x: HOME_OUTER_SIDE + PATH_BOX_LENGTH,
            y: HOME_DISTANCE + PATH_BOX_BREADTH * 5,
            w: PATH_BOX_LENGTH,
            h: PATH_BOX_BREADTH,
          },
        });
      } else {
        path.push({
          type: "regular",
          pos: {
            x: HOME_OUTER_SIDE + PATH_BOX_LENGTH * 2,
            y: HOME_DISTANCE + (i - 31) * PATH_BOX_BREADTH,
            w: PATH_BOX_LENGTH,
            h: PATH_BOX_BREADTH,
          },
        });
      }
    }
  } else {
    if (i == 0) {
      path.push({
        type: "brown",
        pos: {
          x: PATH_BOX_BREADTH,
          y: HOME_OUTER_SIDE,
          w: PATH_BOX_BREADTH,
          h: PATH_BOX_LENGTH,
        },
      });
    } else {
      if (i == 51) {
        path.push({
          type: "regular",
          pos: {
            x: 0,
            y: HOME_OUTER_SIDE,
            w: PATH_BOX_BREADTH,
            h: PATH_BOX_LENGTH,
          },
        });
      } else if (i <= 4) {
        path.push({
          type: "regular",
          pos: {
            x: (i + 1) * PATH_BOX_BREADTH,
            y: HOME_OUTER_SIDE,
            w: PATH_BOX_BREADTH,
            h: PATH_BOX_LENGTH,
          },
        });
      } else if (i == 50) {
        path.push({
          type: "regular",
          pos: {
            x: 0,
            y: HOME_OUTER_SIDE + PATH_BOX_LENGTH,
            w: PATH_BOX_BREADTH,
            h: PATH_BOX_LENGTH,
          },
        });
      } else {
        path.push({
          type: "regular",
          pos: {
            x: (49 - i) * PATH_BOX_BREADTH,
            y: HOME_OUTER_SIDE + PATH_BOX_LENGTH * 2,
            w: PATH_BOX_BREADTH,
            h: PATH_BOX_LENGTH,
          },
        });
      }
    }
  }
}

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 5; j++) {
    if (i == 0) {
      path.push({
        type: "brown",
        pos: {
          x: PATH_BOX_BREADTH * (j + 1),
          y: HOME_OUTER_SIDE + PATH_BOX_LENGTH,
          w: PATH_BOX_BREADTH,
          h: PATH_BOX_LENGTH,
        },
      });
    } else if (i == 1) {
      path.push({
        type: "darkblue",
        pos: {
          x: HOME_OUTER_SIDE + PATH_BOX_LENGTH,
          y: PATH_BOX_BREADTH * (j + 1),
          w: PATH_BOX_LENGTH,
          h: PATH_BOX_BREADTH,
        },
      });
    } else if (i == 2) {
      path.push({
        type: "darkgreen",
        pos: {
          x: HOME_DISTANCE + PATH_BOX_BREADTH * j,
          y: HOME_OUTER_SIDE + PATH_BOX_LENGTH,
          w: PATH_BOX_BREADTH,
          h: PATH_BOX_LENGTH,
        },
      });
    } else {
      path.push({
        type: "orange",
        pos: {
          x: HOME_OUTER_SIDE + PATH_BOX_LENGTH,
          y: HOME_DISTANCE + PATH_BOX_BREADTH * j,
          w: PATH_BOX_LENGTH,
          h: PATH_BOX_BREADTH,
        },
      });
    }
  }
}

path.forEach((box) => {
  let { type } = box;

  let { x, y, w, h } = box.pos;

  drawPath(type, x, y, w, h);
});

players.forEach((player) => {
  for (let i = 0; i < 4; i++) {}
});

console.log(path);

function drawPath(type, x, y, w, h) {
  if (type != "regular") {
    ctx.fillStyle = type;

    ctx.fillRect(x, y, w, h);
  } else {
    ctx.strokeRect(x, y, w, h);
  }
}

drawPath();

class UNIT {
  constructor(type, pos, color) {
    this.pos = pos;
    this.type = type;
    this.color = color;
  }
}

console.log(path[2]);

ctx.beginPath();
ctx.fillStyle = "red";
ctx.arc(
  path[2].pos.x + PATH_BOX_BREADTH / 2,
  path[2].pos.y + PATH_BOX_LENGTH / 2,
  UNIT_OUTER_RADIUS_PLAY,
  0,
  Math.PI * 2
);
ctx.fill();
ctx.stroke();
ctx.closePath();
ctx.beginPath();
ctx.arc(
  path[2].pos.x + PATH_BOX_BREADTH / 2,
  path[2].pos.y + PATH_BOX_LENGTH / 2,
  UNIT_INNER_RADIUS_PLAY,
  0,
  Math.PI * 2
);
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = "green";
ctx.arc(
  path[38].pos.x + PATH_BOX_LENGTH / 2,
  path[38].pos.y + PATH_BOX_BREADTH / 2,
  UNIT_OUTER_RADIUS_PLAY,
  0,
  Math.PI * 2
);
ctx.fill();
ctx.stroke();
ctx.closePath();
ctx.beginPath();
ctx.arc(
  path[38].pos.x + PATH_BOX_LENGTH / 2,
  path[38].pos.y + PATH_BOX_BREADTH / 2,
  UNIT_INNER_RADIUS_PLAY,
  0,
  Math.PI * 2
);
ctx.stroke();
ctx.closePath();
