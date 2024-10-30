import { getSVGPath } from "./interpolation.js";

const xInput = document.getElementById("x-input");
const yInput = document.getElementById("y-input");
const addButton = document.getElementById("add-button");
const clearButton = document.getElementById("clear-button");
const toggleLinearButton = document.getElementById("toggle-linear-button");
const alphaInput = document.getElementById("alpha-input");
const pointsList = document.getElementById("points-list");
const linearPath = document.getElementById("linear-path");
const interpolatedPath = document.getElementById("interpolated-path");

addButton.addEventListener("click", addPointHandler);
clearButton.addEventListener("click", clearPointsHandler);
toggleLinearButton.addEventListener("click", toggleLinearHandler);
alphaInput.addEventListener("input", alphaInputHandler);

function addPointHandler() {
  if (xInput.value && yInput.value) {
    state.points.push({ x: parseInt(xInput.value), y: parseInt(yInput.value) });
    xInput.value = "";
    yInput.value = "";
    updateAll();
  }
}

function clearPointsHandler() {
  state.points = [];
  updateAll();
}

function toggleLinearHandler() {
  linearPath.classList.toggle("hide");
}

function alphaInputHandler(e) {
  state.alpha = e.target.value / 100;
  updateAll();
}

const state = {
  points: [],
  alpha: parseFloat(alphaInput.value),
};

function updateAll() {
  updatePointsList();
  updateLinearPath();
  updateInterpolatedPath();
}

function updatePointsList() {
  pointsList.innerHTML = "";
  state.points.forEach((point, index) => {
    const el = document.createElement("span");
    el.innerText = `p${index} ${point.x}, ${point.y}`;
    pointsList.appendChild(el);
  });
}

function updateLinearPath() {
  const pointsString = state.points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
  linearPath.setAttribute("d", state.points.length ? `M ${pointsString}` : "");
}

function updateInterpolatedPath() {
  interpolatedPath.setAttribute("d", getSVGPath(state.points, state.alpha));
}
