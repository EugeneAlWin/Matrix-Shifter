//params
const RangeX = document.getElementById('X'),
  RangeY = document.getElementById('Y'),
  RangeIterrations = document.getElementById('Iterrations'),
  SwapButton = document.getElementById('swapbtn'),
  RandomNumFromMRange = document.getElementById('M_from_range'),
  Container = document.getElementById('cube_rb');
let Matrix = [];

//listeners
[RangeX, RangeY].forEach((e) =>
  e.addEventListener('input', () => {
    Matrix = generateMatrix(RangeX.value, RangeY.value);
    Container.replaceChildren(...Matrix);
  })
);
SwapButton.addEventListener('click', () => {
  swapCubes(RangeIterrations.value, Matrix, RangeX.value, RangeY.value);
});

Matrix = generateMatrix(RangeX.value, RangeY.value);
Container.replaceChildren(...Matrix);
// swapCubes(2, 3, Matrix, RangeX.value, RangeY.value);

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
function swapCubes(numberOfIterrations, matrix, SizeX, SizeY) {
  for (let d = 0; d < numberOfIterrations; d++) {
    let q = setTimeout(() => {
      for (let i = 0; i < 1; i++) {
        let c = setTimeout(() => {
          for (let j = 0; j < SizeX; j++) {
            let b = setTimeout(() => {
              const constElemNum = getRandomInt(SizeX);
              [matrix[i][j], matrix[i][constElemNum]] = [
                matrix[i][constElemNum],
                matrix[i][j],
              ];
              for (let z = 0; z < SizeX; z++) {
                let a = setTimeout(() => {
                  matrix[i][z].style = `transform:translateX(${z * 70}px)`;
                  clearTimeout(a);
                }, z * 10);
              }
              clearTimeout(b);
            }, j * 500);
          }
          clearTimeout(c);
        }, i * 300);
      }
      clearTimeout(q);
    }, d * 4000);
  }
}

/**
 * Returns a random integer between 0 and max - 1
 * @param {number} max - The maximum value of the random number
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
