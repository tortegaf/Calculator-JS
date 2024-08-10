const display = document.getElementById('display');
const buttons = Array.from(document.getElementsByClassName('btn'));
let resetDisplay = false;
let expression = '';
let lastInputWasOperator = false;

function formatNumber(number) {
    let [integer, decimal] = number.split('.');
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (decimal) {
        return `${integer},${decimal}`;
    } else {
        return integer;
    }
}

function updateDisplay(value) {
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    display.innerText = formatNumber(value);
}

function handleOperator(operator) {
    if (expression === '') {
        expression = display.innerText.replace(/\./g, '').replace(/,/g, '.');
    } else {
        if (!lastInputWasOperator) {
            expression += display.innerText.replace(/\./g, '').replace(/,/g, '.');
            try {
                const result = eval(expression);
                updateDisplay(result.toString());
                expression = result.toString();
            } catch {
                display.innerText = 'Error';
                expression = '';
            }
        }
    }
    expression += operator;
    resetDisplay = true;
    lastInputWasOperator = true;
    highlightOperatorButton(operator);
}

function highlightOperatorButton(operator) {
    buttons.forEach(btn => {
        if (btn.innerText === operator) {
            btn.classList.add('active-operator');
        } else {
            btn.classList.remove('active-operator');
        }
    });
}

function handleEqual() {
    if (expression !== '' && !lastInputWasOperator) {
        expression += display.innerText.replace(/\./g, '').replace(/,/g, '.');
        try {
            const result = eval(expression);
            updateDisplay(result.toString());
            expression = '';  // Reseteamos la expresión después de calcular
        } catch {
            display.innerText = 'Error';
        }
        resetDisplay = true;
        clearOperatorHighlight();
    }
}

function clearOperatorHighlight() {
    buttons.forEach(btn => btn.classList.remove('active-operator'));
    lastInputWasOperator = false;
}

buttons.map(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.innerText;

        if (['+', '-', '*', '/'].includes(value)) {
            handleOperator(value);
        } else if (value === '=') {
            handleEqual();
        } else if (value === 'AC') {
            display.innerText = '0';
            resetDisplay = true;
            expression = '';
            clearOperatorHighlight();
        } else if (value === '%') {
            let currentValue = parseFloat(display.innerText.replace(/\./g, '').replace(/,/g, '.')) / 100;
            updateDisplay(currentValue.toString());
            resetDisplay = true;
        } else if (value === ',') {
            if (!display.innerText.includes(',')) {
                display.innerText += ',';
            }
        } else if (value === '+/-') {
            let currentValue = (parseFloat(display.innerText.replace(/\./g, '').replace(/,/g, '.')) * -1).toString();
            updateDisplay(currentValue);
        } else {
            if (resetDisplay) {
                display.innerText = value === ',' ? '0,' : value;
                resetDisplay = false;
            } else {
                if (display.innerText === '0' && value !== ',') {
                    display.innerText = value;
                } else {
                    let newValue = display.innerText.replace(/\./g, '') + value;
                    if (newValue.replace(/\./g, '').length <= 10) {
                        updateDisplay(newValue);
                    }
                }
            }
            lastInputWasOperator = false;
        }
    });
});
