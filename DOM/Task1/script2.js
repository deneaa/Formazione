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

function calculateResult() {
  console.log(stack);
  operation.textContent = stack.join("");
  let multiplyOrDivideOperators = [];
  for (let i = 0; i < stack.length; i++) {
    if (stack[i] === "*" || stack[i] === "/") multiplyOrDivideOperators.push(i);
  }

  if (multiplyOrDivideOperators.length > 0) {
    multiplyOrDivideOperators.sort((a, b) => b - a);

    for (const index of multiplyOrDivideOperators) {
      const left = stack[index - 1];
      const op = stack[index];
      const right = stack[index + 1];

      const result = op === "*" ? left * right : left / right;

      stack.splice(index - 1, 3, result);
    }
  }

  let result = stack[0];
  for (let i = 1; i < stack.length; i += 2) {
    let op = stack[i];
    let num = stack[i + 1];

    if (op === "+") result += num;
    else result -= num;
  }
  stack = [result];
  updateResult();
}

function addOperator(op) {
  if (op === "=") {
    if (stack.length < 3) return;
    if (basicOperations.has(stack[stack.length - 1])) return;

    calculateResult();
    return;
  }

  const last = stack[stack.length - 1];

  if (stack.length === 0) return;

  if (typeof last === "string") {
    stack[stack.length - 1] = op;
  } else {
    stack.push(op);
  }

  updateResult();
}

function deleteLastElement() {
  stack.pop();
  updateResult();
}

function updateResult() {
  result.textContent = stack.length === 0 ? "0" : stack.join("");
}

function addNumber(value) {
  const last = stack[stack.length - 1];

  if (typeof last === "number") {
    stack[stack.length - 1] = Number(String(last) + value);
  } else {
    stack.push(Number(value));
  }

  updateResult();
}

numberButtons.forEach((btn) =>
  btn.addEventListener("click", (e) => addNumber(e.target.textContent)),
);

buttonOperators.forEach((btn) =>
  btn.addEventListener("click", (e) => addOperator(e.target.textContent)),
);

buttonDelete.addEventListener("click", deleteLastElement);

buttonClear.addEventListener("click", () => {
  stack = [];
  updateResult();
});
