const array = [1, 2, 3, 4, 5];

// TASK 1
function arithmeticMean(array) {
  if (array.length === 0) return 0;
  let sum = array.reduce((prev, curr) => prev + curr, 0);
  let num = array.length;
  return (sum / num).toFixed(2);
}

function arithmeticMean2(array) {
  if (array.length === 0) return 0;
  let sum = 0;
  let num = array.length;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return (sum / num).toFixed(2);
}
// In sine, e aceeasi logica, insa mult mai explicit

// TAKS 2
function moveFirstElement(array) {
  if (array.length === 0) return [];
  let firstElement = array.shift();
  array.push(firstElement);
  return array;
}

function moveFirstElement2(array) {
  if (array.length === 0) return [];
  let firstElement = array[0];
  for (let i = 0; i < array.length - 1; i++) {
    array[i] = array[i + 1];
  }
  array[array.length - 1] = firstElement;
  return array;
}

function moveFirstElement3(array) {
  let result = [];
  for (let i = 1; i < array.length; i++) {
    result.push(array[i]);
  }
  result.push(array[0]);
  return result;
}

// TASK 3
const arrayOfEmployees = [
  { name: "John", age: 23 },
  { name: "Denis", age: 20 },
  { name: "Mihai", age: 21 },
];

function objectsToArray(array) {
  return array.map((element) => {
    return `Name: ${element.name}, age: ${element.age}`;
  });
}

function objectsToArray2(array) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let string = [];
    for (let [key, value] of Object.entries(array[i])) {
      string.push(`${key}: ${value}`);
    }
    result.push(string.join(", "));
  }
  return result;
}

function objectsToArray3(array) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let string = [];
    for (let key of Object.keys(array[i])) {
      string.push(`${key}: ${array[i][key]}`);
    }
    result.push(string.join(", "));
  }
  return result;
}

function objectsToArray4(array) {
  return array.map((obj) =>
    Object.keys(obj)
      .map((key) => `${key[0].toUpperCase() + key.slice(1)}: ${obj[key]}`)
      .join(", "),
  );
}

let salaries = {
  John: 100,
  Ann: 160,
  Pete: 130,
};

// TASK 1
function sumOfSalaries(obiect) {
  return Object.keys(obiect)
    .map((el) => obiect[el])
    .reduce((prev, curr) => prev + curr, 0);
}

function sumOfSalaries2(obiect) {
  return Object.keys(obiect).reduce((prev, curr) => prev + obiect[curr], 0);
}

function sumOfSalaries3(obiect) {
  return Object.values(obiect).reduce((prev, curr) => prev + curr, 0);
}

function sumOfSalaries4(obiect) {
  let result = 0;
  for (let [key, value] of Object.entries(obiect)) {
    result += value;
  }
  return result;
}

// console.log(sumOfSalaries4(salaries));

// TASK 2
let menu = {
  width: 200,
  height: 300,
  title: "My menu",
};

function multiplyNumeric(obj) {
  for (let [key, value] of Object.entries(obj)) {
    if (!isNaN(value)) obj[key] = value * 2;
    // if (typeof value === "number") obj[key] = value * 2;
  }
}

function multiplyNumeric2(obj) {
  for (let key of Object.keys(obj)) {
    if (typeof obj[key] === "number") obj[key] *= 2;
  }
}

// multiplyNumeric2(menu);
// console.log(menu);

// TASK 2

let object = {
  step: 0,

  up() {
    if (this.step === 10) {
      return "You can't go higher, you're already at maximum (step 10)";
    }
    this.step++;
  },
  showStep() {
    return `You are at the step ${this.step}`;
  },
  down() {
    if (this.step === 0) {
      return "You can't go down, you're already at step 0";
    }
    this.step--;
  },
};

console.log(object.showStep());
object.up();
object.up();
console.log(object.showStep());
class Worker {
  name;
  surname;
  rate;
  days;

  constructor(name, surname, rate, days) {
    this.name = name;
    this.surname = surname;
    this.rate = rate;
    this.days = days;
  }

  getSalary() {
    return this.rate * this.days;
  }
  
  getFullName() {
    return `${capitalize(this.name)} ${capitalize(this.surname)}`;
  }
}

function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

class Boss extends Worker {
  workers;

  constructor(name, surname, rate, days, workers) {
    super(name, surname, rate, days);
    this.workers = workers;
  }

  getSalary() {
    return this.rate * this.days * this.workers;
  }
}

const worker = new Worker("Andrei", "Smith", 100, 20);

console.log(worker.getFullName());
console.log(worker.getSalary());

const boss = new Boss("Denis", "Denis", 150, 20, 5);

console.log(boss.getFullName());
console.log(boss.getSalary());

// TASK 1
const regex = /^https?:\/\/.*\.(php|html)$/;

console.log(regex.test("http://site.ru/index.php"));
console.log(regex.test("http://site.com"));
console.log(regex.test("site.it/index.php"));

// TASK 2
const regex2 = /^(\+4|3)\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
/*
^(\+4|3) - incepe cu +4 sau cu 3
\s?\(?\d{3}\)? - spatiu optional, apoi paranteza optionala, dupa aia 3 cifre, si paranteza optionala
[\s-]? - spatiu sau - optional
\d{3}[\s-]?\d{2}[\s-]?\d{2} - restul nr
*/

// TASK 3
const card = "1111222233334444";

function anonymizeCard(card) {
  if (card.length !== 16) return "Cards are 16 characters long";
  return `My credit card is ${"*".repeat(12)}${card.slice(12)}`;
}

console.log(anonymizeCard(card));
