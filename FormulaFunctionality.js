function evaluate(cell, cellRefsInFormula) {
    const formula = cell.node.formula;
    const content = formula.slice(1).trim();
    if (/^SUM|MUL|MAX|MIN/i.test(content)) return evaluateFunction(content, list, cellRefsInFormula);
    else if (/^([A-Z]+\d+|\d+)([+\-*/^]([A-Z]+\d+|\d+))+$/i.test(content)) return evaluateArithmetic(content, list, cellRefsInFormula);
    else return '#NAME?';
}

function evaluateArithmetic(formula, list, cellRefsInFormula) {
    const cellRefs = formula.match(/[A-Z]+\d+|\d+(\.\d+)?/g) || [];
    const operators = formula.match(/[\+\-\*\/\^]/g);
    const postfix = [];
    const stack = new Stack();

    const precedence = (operator) => {
        switch (operator) {
            case '^': return 3;
            case '*': case '/': return 2;
            case '+': case '-': return 1;
            default: return 0;
        }
    };

    let lastIndex = 0;
    for (const cellRef of cellRefs) {
        postfix.push(cellRef);
        lastIndex += cellRef.length;

        if (operators && operators.length > 0 && lastIndex < formula.length) {
            while (stack.size() > 0 && precedence(operators[0]) <= precedence(stack.peek())) {
                postfix.push(stack.pop());
            }
            stack.push(operators.shift());
        }
    }

    while (stack.size() > 0) {
        postfix.push(stack.pop());
    }

    const evalStack = new Stack();
    for (const token of postfix) {
        if (/[A-Z]+\d+|\d+(\.\d+)?/g.test(token)) {
            if (!isNaN(parseFloat(token))) {
                evalStack.push(parseFloat(token));
                continue;
            }
            const [row, col] = getCellCoordinates(token);
            const node = list.getNode(row - 1, col - 1);
            cellRefsInFormula.push([row - 1, col - 1]);
            evalStack.push(node ? parseFloat(node.value) || 0 : 0);
        } else {
            const b = evalStack.pop();
            const a = evalStack.pop();
            switch (token) {
                case '+': evalStack.push(a + b); break;
                case '-': evalStack.push(a - b); break;
                case '*': evalStack.push(a * b); break;
                case '/': evalStack.push(a / b); break;
                case '^': evalStack.push(Math.pow(a, b)); break;
                default: throw new Error("Unknown operator: ${token}");
            }
        }
    }

    return evalStack.peek();
}

function evaluateFunction(content, list, cellRefsInFormula) {
    const match = content.match(/^(\w+)\((.+)\)$/i);
    if (!match) return '#NAME?';
    const funcName = match[1].toUpperCase();
    const range = match[2].trim();
    const cells = parseRange(range, list);
    cells.forEach(cell => {
        cellRefsInFormula.push(cell.ref);
    });
    if (!cells) return '#NAME?';
    switch (funcName) {
        case "SUM":
            return cells.reduce((sum, cell) => sum + (parseFloat(cell.value) || 0), 0);
        case "MUL":
            return cells.reduce((product, cell) => product * (parseFloat(cell.value) || 1), 1);
        case "MAX":
            return Math.max(...cells.map(cell => parseFloat(cell.value) || 0));
        case "MAX":
            return Math.min(...cells.map(cell => parseFloat(cell.value) || 0));
        default:
            return '#NAME?';
    }
}

function parseRange(range, list) {
    const commaSeparatedMatch = range.match(/^([A-Z]+\d+)(?:,([A-Z]+\d+))*$/);
    if (commaSeparatedMatch) {
        const cells = [];
        const cellRefs = range.split(',');
        for (const cellRef of cellRefs) {
            const [row, col] = getCellCoordinates(cellRef);
            const node = list.getNode(row - 1, col - 1);
            if (node) cells.push(node);
        }
        return cells;
    }

    const rangeMatch = range.match(/^([A-Z]+\d+):([A-Z]+\d+)$/);
    if (rangeMatch) {
        const [startRow, startCol] = getCellCoordinates(rangeMatch[1]);
        const [endRow, endCol] = getCellCoordinates(rangeMatch[2]);
        const cells = [];
        for (let i = startRow - 1; i <= endRow - 1; i++) {
            for (let j = startCol - 1; j <= endCol - 1; j++) {
                const node = list.getNode(i, j);
                if (node) cells.push(node);
            }
        }
        return cells;
    }
    return null;
}

function getCellCoordinates(cell) {
    const match = cell.match(/^([A-Z]+)([0-9]+)$/);
    if (!match) throw new Error("Invalid Cell Reference");
    const column = match[1];
    const row = parseInt(match[2], 10);
    let colIndex = 0;
    for (let i = 0; i < column.length; i++) {
        colIndex = colIndex * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return [row, colIndex];
}