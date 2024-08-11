const display = document.getElementById("display");
const buttons = Array.from(document.getElementsByClassName("btn"));
let expressionParts = []; // Almacena los componentes de la expresión (números y operadores)
let currentNumber = ""; // Almacena el número actual que se está ingresando
let lastInputWasOperator = false;
let resultDisplayed = false;
let activeOperator = null;

function formatNumber(number) {
  let [integer, decimal] = number.split(".");
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (decimal === undefined || decimal === "0" || decimal === "") {
    return integer;
  } else {
    return `${integer}.${decimal}`;
  }
}

function updateDisplay(value) {
  if (value.length > 10) {
    value = parseFloat(value).toExponential(5); // Convierte a notación científica con 5 cifras decimales
  }
  display.innerText = value;
}

function evaluateExpression() {
  try {
    const expression = expressionParts.join("");
    const result = eval(expression);
    return result.toString();
  } catch {
    return "Error";
  }
}

function handleOperator(operator, buttonElement) {
  if (currentNumber !== "") {
    expressionParts.push(currentNumber);
    currentNumber = "";
  }

  if (lastInputWasOperator) {
    expressionParts[expressionParts.length - 1] = operator; // Reemplaza el último operador
  } else {
    expressionParts.push(operator);
  }

  let result = evaluateExpression();
  if (result !== "Error") {
    updateDisplay(result);
    resultDisplayed = true;
  }

  lastInputWasOperator = true;

  if (activeOperator) {
    activeOperator.classList.remove("active-operator");
  }
  buttonElement.classList.add("active-operator");
  activeOperator = buttonElement;
}

function handleEqual() {
  if (currentNumber !== "") {
    expressionParts.push(currentNumber);
    currentNumber = "";
  }

  let result = evaluateExpression();
  if (result !== "Error") {
    updateDisplay(result);
    resultDisplayed = true;
  }
  expressionParts = []; // Reseteamos la expresión después de calcular
  lastInputWasOperator = false;
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
    const currentValue = parseFloat(
      currentNumber.replace(/\./g, "").replace(/,/g, ".")
    );

    if (expressionParts.length > 0 && !lastInputWasOperator) {
      const previousValue = parseFloat(
        expressionParts[expressionParts.length - 2]
      );
      currentNumber = (previousValue * (currentValue / 100)).toString();
    } else {
      currentNumber = (currentValue / 100).toString();
    }

    updateDisplay(currentNumber);
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
      display.innerText = "0";
      expressionParts = [];
      currentNumber = "";
      lastInputWasOperator = false;
      resultDisplayed = false;
      if (activeOperator) {
        activeOperator.classList.remove("active-operator");
        activeOperator = null;
      }
    } else if (value === "←") {
      // Si se presiona el botón de retroceso
      handleBackspace();
    } else if (value === "+/-") {
      // Si se presiona el botón de cambio de signo
      handlePlusMinus();
    } else if (value === "%") {
      // Si se presiona el botón de porcentaje
      handlePercentage();
    } else {
      if (resultDisplayed) {
        display.innerText = value === "," ? "0," : value;
        currentNumber = display.innerText;
        resultDisplayed = false;
      } else {
        currentNumber =
          currentNumber === "0" && value !== ","
            ? value
            : currentNumber + value;
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
