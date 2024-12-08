function evaluate(cell) {
    const formula = cell.node.formula;

    if (!formula || !formula.startsWith("=")) {
        return "Error: Invalid Formula";
    }

    let tokens;
    try {
        tokens = parseFormula(formula);
        console.log(tokens)
    } catch (error) {
        return "Error: Invalid Syntax";
    }

    for (const token of tokens) {
        if (/^[A-Za-z][0-9]+$/.test(token)) {
            const [row, col] = getCellCoordinates(token);
            const node = list.getNode(row, col);
            if (!node) {
                return `Error: Invalid Reference (${token})`;
            }
        }
    }

    try {
        return evaluateFormula(tokens, list);
    } catch (error) {
        return "Error: Calculation Failed";
    }
}

function parseFormula(formula) {
    const regex = /[A-Za-z][0-9]+|\+|\-|\*|\/|\(|\)/g; 
    const tokens = formula.slice(1).match(regex);   
    if (!tokens) throw new Error("Invalid Formula");
    return tokens;
}

function getCellCoordinates(reference) {
    const colLetters = reference.match(/[A-Z]+/)[0];
    const rowNumber = parseInt(reference.match(/[0-9]+/)[0], 10);

    let colNumber = 0;
    for (let i = 0; i < colLetters.length; i++) {
        colNumber = colNumber * 26 + (colLetters.charCodeAt(i) - 65 + 1);
    }

    return [rowNumber, colNumber];
}

function evaluateFormula(tokens, list) {
    let stack = new Stack();
    tokens.forEach(token => {
        if (/^[A-Za-z][0-9]+$/.test(token)) {
            const [row, col] = getCellCoordinates(token);
            const node = list.getNode(row-1, col-1);
            stack.push(parseFloat(node.value) || 0);
        } else if (/^\d+(\.\d+)?$/.test(token)) {
            stack.push(parseFloat(token));
        } else if (/^\+|\-|\*|\/$/.test(token)) {
            const b = stack.peek();
            stack.pop()
            const a = stack.peek();
            stack.pop()
            console.log(a, b)
            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/":
                    if (b === 0) throw new Error("Division by Zero");
                    stack.push(a / b);
                    break;
            }
        } else {
            console.log("Unexpected Token: " + token);
        }
    });
    if (stack.size() !== 1) {
        return 0;
    }
    return stack.peek();
}
