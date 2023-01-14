//params
const RangeX = document.getElementById('X'),
  RangeY = document.getElementById('Y'),
  NumContainerX = document.getElementById('cube_rt'),
  NumContainerY = document.getElementById('cube_lb'),
  RangeIterations = document.getElementById('Iterations'),
  SwapButton = document.getElementById('swapbtn'),
  ResetButton = document.getElementById('resetbtn'),
  RandomNumFromMRange = document.getElementById('M_from_range'),
  Container = document.getElementById('cube_rb'),
  IterationCounter = document.getElementById('iteration_counter');

const CubeWidthWithGap =
  NumContainerX.children[1].getBoundingClientRect().left -
  NumContainerX.children[0].getBoundingClientRect().left;

let Matrix = [];

//States
let IsNowSwapping = false,
  IsStopImmediately = false;

//listeners
addEventListener('DOMContentLoaded', () => {
  Matrix = drawMatrix();
});

[RangeX, RangeY].forEach((e) =>
  e.addEventListener('input', () => {
    IsStopImmediately = IsNowSwapping; // stop swapping only if it is in progress
    Matrix = drawMatrix();
  })
);

ResetButton.addEventListener('click', () => {
  IsStopImmediately = IsNowSwapping;
  Matrix = drawMatrix();
});

SwapButton.addEventListener('click', async () => {
  if (IsNowSwapping) return;
  IsNowSwapping = true;
  let counter = 0;
  while (counter < RangeIterations.value) {
    if (IsStopImmediately) {
      IsStopImmediately = false;
      break;
    }
    IterationCounter.textContent = counter + 1;
    await swapCubes(Matrix).then(() => counter++);
  }
  IterationCounter.textContent = '*';
  IsNowSwapping = false;
});

//functions
function drawMatrix() {
  let matrix = generateMatrix(RangeX.value, RangeY.value);
  let [numRangeX, numRangeY] = drawRowsNums(matrix);
  NumContainerX.replaceChildren(...numRangeX);
  NumContainerY.replaceChildren(...numRangeY);
  Container.replaceChildren(...matrix);
  return matrix;
}

function drawRowsNums(matrix) {
  let sizeX = matrix[0].children.length,
    sizeY = matrix.length;
  let numRangeX = [],
    numRangeY = [];
  for (let i = 0; i < sizeY; i++) {
    numRangeY[i] = document.createElement(`div`);
    numRangeY[i].textContent = i + 1;
    numRangeY[i].classList.add(`num_cube`);
  }
  for (let i = 0; i < sizeX; i++) {
    numRangeX[i] = document.createElement(`div`);
    numRangeX[i].textContent = i + 1;
    numRangeX[i].classList.add(`num_cube`);
  }
  return [numRangeX, numRangeY];
}

//generate matrix
function generateMatrix(SizeX, SizeY) {
  const matrix = [];
  for (let i = 0; i < SizeY; i++) {
    matrix[i] = document.createElement(`div`);
    matrix[i].classList.add(`cube_container`);
    for (let j = 0; j < SizeX; j++) {
      matrix[i][j] = document.createElement(`div`);
      matrix[i][j].textContent = j;
      matrix[i][j].style = `transform:translateX(${j * CubeWidthWithGap}px);`;
      matrix[i][j].classList.add(`cube`, j < SizeX / 2 && 'green');
      matrix[i].appendChild(matrix[i][j]);
    }
  }
  return matrix;
}

function swapCubes(matrix) {
  const SizeY = matrix.length,
    SizeX = matrix[0].children.length;
  return new Promise((resolve) => {
    for (let i = 0; i < SizeY; i++) {
      let q = setTimeout(() => {
        for (let j = 0; j < SizeX; j++) {
          let b = setTimeout(() => {
            const numOfElementToSwapWith = getRandomInt(SizeX);
            [matrix[i][j], matrix[i][numOfElementToSwapWith]] = [
              matrix[i][numOfElementToSwapWith],
              matrix[i][j],
            ];
            for (let z = 0; z < SizeX; z++) {
              matrix[i][z].style = `
              transform:translateX(${z * CubeWidthWithGap}px)
              `;
            }
            clearTimeout(b);
            clearTimeout(q);
            if ((j === SizeX - 1 && i === SizeY - 1) || IsStopImmediately)
              resolve(true);
          }, j * 500);
        }
      }, i * 100);
    }
  });
}

/**
 * Returns a random integer between 0 and max - 1
 * @param {number} max - The maximum value of the random number
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
