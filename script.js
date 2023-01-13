//params
const RangeX = document.getElementById('X'),
  RangeY = document.getElementById('Y'),
  RangeIterrations = document.getElementById('Iterrations'),
  SwapButton = document.getElementById('swapbtn'),
  RandomNumFromMRange = document.getElementById('M_from_range'),
  Container = document.getElementById('cube_rb');
let Matrix = [];

//listeners
addEventListener('DOMContentLoaded', () => {
  drawMatrix(Matrix);
});

[RangeX, RangeY].forEach((e) =>
  e.addEventListener('input', () => {
    drawMatrix(Matrix);
  })
);

SwapButton.addEventListener('click', async () => {
  let counter = 0;
  while (counter < RangeIterrations.value) {
    await swapCubes(Matrix).then(() => counter++);
  }
});

//functions
function drawMatrix(matrix) {
  Matrix = generateMatrix(RangeX.value, RangeY.value);
  Container.replaceChildren(...Matrix);
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
      matrix[i][j].style = `transform:translateX(${j * 70}px);`;
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
            const constElemNum = getRandomInt(SizeX);
            [matrix[i][j], matrix[i][constElemNum]] = [
              matrix[i][constElemNum],
              matrix[i][j],
            ];
            for (let z = 0; z < SizeX; z++) {
              matrix[i][z].style = `transform:translateX(${z * 70}px)`;
            }
            clearTimeout(b);
            clearTimeout(q);
            if (j === SizeX - 1 && i === SizeY - 1) resolve(true);
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
