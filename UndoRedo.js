let undo = new Stack();
let redo = new Stack();

function saveState(cell, textForUndo = cell.node.value) {
    if (cell.node.value.trim() == "") return
    undo.push({
        cell: cell,
        prevValue: textForUndo,
        Prevformula: cell.node.formula,
        style: { ...cell.style },
    });
    redo = new Stack();
}

function undoAction() {
    if (undo.empty()) return;
    const lastState = undo.pop();
    redo.push({
        cell: lastState.cell,
        Prevformula: lastState.Prevformula,
        prevValue: lastState.cell.innerText,
        style: { ...lastState.cell.style },
    });
    lastState.value = lastState.prevValue || ''
    if (lastState.cell.node.value !== lastState.prevValue) {
        if (!isNaN(lastState.cell.node.value)) {
            numberBST.root = numberBST.delete(numberBST.root, lastState.cell.node.value, lastState.cell.node.ref);
            numberBST.insert(lastState.cell.node.ref, Number(lastState.prevValue));
        }
        else {
            stringBST.root = stringBST.delete(stringBST.root, lastState.cell.node.value, lastState.cell.node.ref)
            if (lastState.prevValue !== "#NAME?" && lastState.prevValue !== "") stringBST.insert(lastState.cell.node.ref, lastState.prevValue);
        }
    }
    lastState.cell.node.value = lastState.prevValue
    lastState.cell.innerText = lastState.value
    lastState.cell.node.formula = lastState.Prevformula
    restoreStyles(lastState.cell, lastState.style);
    if (!lastState.cell.node.value.trim()) graph.removeNode(lastState.cell.node.ref);
    else graph.reevaluateAllDependencies(lastState.cell);
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
    lastRedo.cell.innerText = lastRedo.value;
    restoreStyles(lastRedo.cell, lastRedo.style);
    if (lastRedo.value.startsWith('=')) {
        let cellRefsInFormula = [];
        lastRedo.cell.node.formula = lastRedo.cell.node.value;
        lastRedo.cell.node.value = evaluate(lastRedo.cell, cellRefsInFormula).toString();
        if (lastRedo.cell.node.value !== "#NAME?") {
            graph.addNode(lastRedo.cell.node.ref, cellRefsInFormula);
            if (graph.detectCycle()) {
                alert("Circular dependency detected! Reverting...");
                graph.removeNode(lastRedo.cell.node.ref);
                lastRedo.cell.innerText = '';
                lastRedo.cell.node.value = '';
                return;
            }
        }
    }
    graph.reevaluateAllDependencies(lastRedo.cell);
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        if (event.key.toLowerCase() === 'z') {
            undoAction();
        } else if (event.key.toLowerCase() === 'y') {
            redoAction();
        }
    }
});

