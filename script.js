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
  IterationCounter = document.getElementById('iteration_counter'),
  LangSwitcher = document.getElementById('lang_switcher'),
  AllLangContainers = [...document.querySelectorAll(`[class*=lang-]`)];

const TimeoutBetweenRows = 100,
  TimeoutBetweenCubes = 500;

const CubeWidthWithGap =
  NumContainerX.children[1].getBoundingClientRect().left -
  NumContainerX.children[0].getBoundingClientRect().left;

let Matrix = [];

//States
let IsNowSwapping = false,
  IsStopImmediately = false;

//listeners
addEventListener('DOMContentLoaded', () => {
  let lang = localStorage.getItem('localization') ?? 'EN';
  LangSwitcher.value = lang;
  switchLang(lang);
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
    IterationCounter.textContent = ++counter; // increment counter and display it
    await swapCubes(Matrix);
  }
  IterationCounter.textContent = '*';
  IsNowSwapping = false;
});

LangSwitcher.addEventListener('change', () => {
  switchLang(LangSwitcher.value);
  localStorage.setItem('localization', LangSwitcher.value);
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
    sizeY = matrix.length,
    numRangeX = [],
    numRangeY = [];

  for (let i = 0; i < sizeY; i++)
    numRangeY[i] = createHTMLElement(`div`, i + 1, ['num_cube']);
  for (let i = 0; i < sizeX; i++)
    numRangeX[i] = createHTMLElement(`div`, i + 1, ['num_cube']);

  return [numRangeX, numRangeY];
}

//generate matrix
function generateMatrix(SizeX, SizeY) {
  const matrix = [];

  for (let i = 0; i < SizeY; i++) {
    matrix[i] = createHTMLElement('div', '', ['cube_container']);

    for (let j = 0; j < SizeX; j++) {
      let classNames = ['cube', j < SizeX / 2 && 'green'],
        style = `transform:translateX(${j * CubeWidthWithGap}px);`;
      matrix[i][j] = createHTMLElement('div', j, classNames, style);
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
      let timeout1 = setTimeout(() => {
        for (let j = 0; j < SizeX; j++) {
          let timeout2 = setTimeout(() => {
            const numOfElementToSwapWith = getRandomInt(SizeX);

            [matrix[i][j], matrix[i][numOfElementToSwapWith]] = [
              matrix[i][numOfElementToSwapWith],
              matrix[i][j],
            ];

            for (let z = 0; z < SizeX; z++) {
              matrix[i][z].style = `transform:translateX(${
                z * CubeWidthWithGap
              }px)`;
            }

            clearTimeout(timeout2);
            clearTimeout(timeout1);

            if ((j === SizeX - 1 && i === SizeY - 1) || IsStopImmediately)
              resolve(true);
          }, j * TimeoutBetweenCubes);
        }
      }, i * TimeoutBetweenRows);
    }
  });
}

function switchLang(lang) {
  const localization = LANGUAGES[lang] ?? LANGUAGES['EN'];
  AllLangContainers.forEach((item) => {
    let className = item.className
      .split(' ')
      .filter((e) => e.includes('lang-'))[0]
      .replace('lang-', '');
    item.innerHTML = localization[className];
  });
}

/**
 * Returns a random integer between 0 and max - 1
 * @param {number} max - The maximum value of the random number
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * @returns {HTMLElement} Returns a new HTML element
 */
function createHTMLElement(
  tag = 'div',
  text = '',
  classNames = [''],
  style = ''
) {
  const element = document.createElement(tag);
  element.textContent = text;
  element.classList.add(...classNames);
  element.style = style;
  return element;
}
