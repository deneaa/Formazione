const operation = document.querySelector(".operation");
const result = document.querySelector(".result");

const buttons = document.querySelectorAll(".button");

const buttonDelete = document.querySelector(".delete");
const buttonClear = document.querySelector(".clear");

const buttonDivide = document.querySelector(".divide");
const buttonMultiply = document.querySelector(".multiply");
const buttonSubtract = document.querySelector(".subtract");
const buttonAdd = document.querySelector(".add");
const buttonEquals = document.querySelector(".equals");

const buttonSign = document.querySelector(".sign");
const buttonComma = document.querySelector(".comma");

const numberButtons = document.querySelectorAll(".button-number");
const buttonOperators = document.querySelectorAll(".button-operator");

let stack = [];
const basicOperations = new Set(["+", "-", "*", "/"]);

function addNumber(number) {
  stack.push(number);
  updateResult();
}

function addOperator(operator) {
  if (operator === "." && stack[stack.length - 1] === ".") return;

  if (operator === "=") {
    calculateResult();
    return;
  }

  if (operator === "+/-") {
    changeSign();
    return;
  }

  if (basicOperations.has(stack[stack.length - 1])) {
    stack.pop();
  }

  if (stack.length > 0) {
    stack.push(operator);
    updateResult();
  }
}

function updateResult() {
  result.textContent = stack.length === 0 ? "0" : stack.join("");
}

function calculateResult() {
  const string = stack.join("");
  const res = eval(string);

  operation.textContent = string;
  // res -> un nr, de ex (54), nu-l punem direct in stack, ci
  // il impartim in elemente si le bagam in stack, pentru a putea fi sterse
  stack = [...String(res).split("")];

  updateResult();
}

function deleteLastParameter() {
  if (stack.length) {
    stack.pop();
    updateResult();
  }
}

function changeSign() {
  if (stack.length === 0) return;

  let end = stack.length - 1;

  // daca ultimul parametru din stack e un semn, nu facem nimic.
  if (basicOperations.has(stack[end])) return;

  // daca incepe cu ), inseamna ca automat este cu minus
  if (stack[end] === ")") {
    let openIndex = end;

    // mergem pana gasim index-ul la ( si -
    while (
      openIndex > 0 &&
      !(stack[openIndex] === "(" && stack[openIndex + 1] === "-")
    ) {
      openIndex--;
    }

    // am ajuns la index, scoatem (- si ) de la sfarsit
    if (openIndex >= 0) {
      stack.splice(openIndex, 2);
      stack.pop();
    }

    updateResult();
    return;
  }

  let start = end;

  // mergem pana gasim primul operator
  while (
    start >= 0 &&
    !basicOperations.has(stack[start]) &&
    stack[start] !== "(" &&
    stack[start] !== ")"
  ) {
    start--;
  }

  // daca operatorul este -, transformam direct in +
  if (start >= 0 && stack[start] === "-") {
    stack[start] = "+";
  } else {
    // daca operatorul e orice altceva, transformam in (- x)
    stack.splice(start + 1, 0, "(", "-");
    stack.push(")");
  }

  updateResult();
}

numberButtons.forEach((btn) =>
  btn.addEventListener("click", (e) => addNumber(e.target.textContent)),
);

buttonOperators.forEach((btn) =>
  btn.addEventListener("click", (e) => addOperator(e.target.textContent)),
);

buttonDelete.addEventListener("click", deleteLastParameter);

buttonClear.addEventListener("click", () => {
  stack = [];
  updateResult();
});
