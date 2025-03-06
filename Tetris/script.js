const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const GRID_SIDE = 50;
const GRID_COLS = canvas.width / GRID_SIDE;
const GRID_ROWS = canvas.height / GRID_SIDE;

const shapeTypes = ["mBox", "vLine", "hLine", "L", "J"];
