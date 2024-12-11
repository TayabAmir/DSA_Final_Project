let undo = new Stack();
let redo = new Stack();
let numberBST = new BST();
let stringBST = new BST();
let graph = new Graph();    

function saveState(cell, textForUndo = cell.node.value) {
    if (cell.node.value.trim() == "") return
    undo.push({
        cell: cell,
        prevValue: textForUndo,
        style: {
            fontWeight: cell.style.fontWeight,
            fontStyle: cell.style.fontStyle,
            textDecoration: cell.style.textDecoration,
        },
    });

    redo.array.length = 0;
}

function undoAction() {
    if (undo.empty()) return;
    console.log(undo.peek())

    const lastState = undo.pop();


    redo.push({
        cell: lastState.cell,
        prevValue: lastState.cell.innerText,
        style: { ...lastState.cell.style },
    });
    lastState.value = lastState.prevValue || ''
    lastState.cell.node.value = lastState.prevValue
    lastState.cell.innerText = lastState.value
    restoreStyles(lastState.cell, lastState.style);
}

function redoAction() {
    if (redo.empty()) return;
    const lastRedo = redo.pop();
    undo.push({
        cell: lastRedo.cell,
        prevValue: lastRedo.cell.innerText,
        style: { ...lastRedo.cell.style },
    });
    if (!lastRedo.prevValue) lastRedo.prevValue = ''
    lastRedo.value = lastRedo.prevValue
    lastRedo.cell.innerText = lastRedo.value
    restoreStyles(lastRedo.cell, lastRedo.style);
}

function restoreStyles(cell, style) {
    cell.style.fontWeight = style.fontWeight || 'normal';
    cell.style.fontStyle = style.fontStyle || 'normal';
    cell.style.textDecoration = style.textDecoration || 'none';
}

document.getElementById('bold').addEventListener('click', () => {
    if (!currentCell) return;
    saveState(currentCell);
    currentCell.style.fontWeight = currentCell.style.fontWeight === 'bold' ? 'normal' : 'bold';
});

document.getElementById('italic').addEventListener('click', () => {
    if (!currentCell) return;
    saveState(currentCell);
    currentCell.style.fontStyle = currentCell.style.fontStyle === 'italic' ? 'normal' : 'italic';
});

document.getElementById('underline').addEventListener('click', () => {
    if (!currentCell) return;
    saveState(currentCell);
    currentCell.style.textDecoration = currentCell.style.textDecoration === 'underline' ? 'none' : 'underline';
});

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        if (event.key.toLowerCase() === 'z') {
            undoAction();
        } else if (event.key.toLowerCase() === 'y') {
            redoAction();
        }
    }
});

function enableEditing(cell) {
    if (cell.querySelector('input')) return;
    let textForUndo = cell.innerText
    const input = document.createElement('input');
    input.type = 'text';
    input.value = cell.innerText;
    input.style.width = `${cell.offsetWidth}px`;
    input.style.height = `${cell.offsetHeight}px`;
    input.style.boxSizing = 'border-box';
    input.style.caretColor = 'transparent';
    cell.innerText = '';
    cell.appendChild(input);
    input.focus();
    input.addEventListener('input', () => {
        input.style.caretColor = 'black';
    });
    const saveInput = () => {
        cell.node.value = input.value
        if (!input.value.empty) {
            if (input.value[0] === "=") {
                cellRefsInFormula = []
                cell.node.formula = input.value
                cell.node.value = evaluate(cell, cellRefsInFormula).toString()

                if(cell.node.value !== "#NAME?") {
                    graph.addNode(cell.node.ref, cellRefsInFormula);

                    if(graph.detectCycle()) {
                        alert("There should be no circular dependency! Please correct the formula");
                        graph.removeNode(cell.node.ref);
                        currentCell.querySelector('input').value = "";
                        return
                    }
                }
            }
        }
        cell.innerText = cell.node.value;

        if (cell.node.value) {
            if (!isNaN(cell.node.value)) {
                numberBST.insert(cell.node.ref, Number(cell.node.value))
            } else {
                if (cell.node.value !== "#NAME?")
                    stringBST.insert(cell.node.ref, cell.node.value)
            }
        }

        saveState(cell, textForUndo);
    };
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') input.blur();
    });
    input.addEventListener('blur', saveInput);
}