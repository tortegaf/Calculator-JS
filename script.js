const display = document.getElementById("display");
const buttons = Array.from(document.getElementsByClassName("btn"));
let expression = "";
let currentNumber = "";
let lastInputWasOperator = false;
let resultDisplayed = false;
let activeOperator = null;

function formatNumber(number) {
  let [integer, decimal] = number.split(".");
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimal ? `${integer},${decimal}` : integer;
}

function updateDisplay(value) {
  if (value.length > 10) {
    value = parseFloat(value).toExponential(5);
  }
  display.innerText = formatNumber(value.replace(".", ","));
}

function evaluateExpression() {
  try {
    const sanitizedExpression = expression.replace(/,/g, ".");
    const result = Function(`"use strict"; return (${sanitizedExpression})`)();
    return result.toString().replace(".", ",");
  } catch {
    return "Error";
  }
}

function handleOperator(operator, buttonElement) {
  if (currentNumber !== "") {
    expression += currentNumber;
    currentNumber = "";
  }

  if (!lastInputWasOperator) {
    expression += operator;
  } else {
    expression = expression.slice(0, -1) + operator;
  }

  lastInputWasOperator = true;
  if (activeOperator) {
    activeOperator.classList.remove("active-operator");
  }
  buttonElement.classList.add("active-operator");
  activeOperator = buttonElement;

  let result = evaluateExpression();
  if (result !== "Error") {
    updateDisplay(result);
  }
}

function handleEqual() {
  if (currentNumber !== "") {
    expression += currentNumber;
    currentNumber = "";
  }

  let result = evaluateExpression();
  if (result !== "Error") {
    updateDisplay(result);
    expression = result.replace(",", ".");
    resultDisplayed = true;
  } else {
    display.innerText = "Error";
    expression = "";
  }

  lastInputWasOperator = false;
  if (activeOperator) {
    activeOperator.classList.remove("active-operator");
    activeOperator = null;
  }
}

function handleBackspace() {
  if (resultDisplayed) return;

  if (currentNumber.length > 0) {
    currentNumber = currentNumber.slice(0, -1);
    updateDisplay(currentNumber || "0");
  }
}

function handlePlusMinus() {
  if (currentNumber) {
    currentNumber = currentNumber.startsWith("-")
      ? currentNumber.slice(1)
      : "-" + currentNumber;
    updateDisplay(currentNumber);
  }
}

function handlePercentage() {
  if (currentNumber) {
    let currentValue = parseFloat(currentNumber.replace(",", "."));
    currentValue /= 100;
    currentNumber = currentValue.toString().replace(".", ",");
    updateDisplay(currentNumber);
  }
}

function resetCalculator() {
  display.innerText = "0";
  expression = "";
  currentNumber = "";
  lastInputWasOperator = false;
  resultDisplayed = false;
  if (activeOperator) {
    activeOperator.classList.remove("active-operator");
    activeOperator = null;
  }
}

buttons.map((button) => {
  button.addEventListener("click", (e) => {
    const value = e.target.innerText;

    if (["+", "-", "*", "/"].includes(value)) {
      handleOperator(value, e.target);
    } else if (value === "=") {
      handleEqual();
    } else if (value === "AC") {
      resetCalculator();
    } else if (value === "←") {
      handleBackspace();
    } else if (value === "+/-") {
      handlePlusMinus();
    } else if (value === "%") {
      handlePercentage();
      lastInputWasOperator = false;
    } else {
      if (resultDisplayed) {
        display.innerText = value === "," ? "0," : value;
        currentNumber = display.innerText.replace(",", ".");
        resultDisplayed = false;
      } else {
        if (currentNumber === "0" && value !== ",") {
          currentNumber = value;
        } else if (!(value === "," && currentNumber.includes(","))) {
          currentNumber += value.replace(",", ".");
        } else if (value === ",") {
          currentNumber += ".";
        }
        updateDisplay(currentNumber);
      }
      lastInputWasOperator = false;
      if (activeOperator) {
        activeOperator.classList.remove("active-operator");
        activeOperator = null;
      }
    }
  });
});
