let numberBST = new BST();
let stringBST = new BST();
let graph = new Graph();

function enableEditing(cell) {
    if (cell.querySelector('input')) return;
    let textForUndo = cell.innerText;
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
        cell.node.value = input.value;
        if (!input.value.empty) {
            if (input.value[0] === "=") {
                let cellRefsInFormula = [];
                cell.node.formula = input.value;
                cell.node.value = evaluate(cell, cellRefsInFormula).toString();
                if (cell.node.value !== "#NAME?") {
                    graph.addNode(cell.node.ref, cellRefsInFormula);
                    if (graph.detectCycle()) {
                        alert("There should be no circular dependency! Please correct the formula");
                        graph.removeNode(cell.node.ref);
                        currentCell.querySelector('input').value = "";
                        return;
                    }
                }
            }
        }
        if (textForUndo) {
            if (!isNaN(textForUndo))
                numberBST.root = numberBST.delete(numberBST.root, textForUndo, cell.node.ref);
            else
                stringBST.root = stringBST.delete(stringBST.root, textForUndo, cell.node.ref)
        }
        cell.innerText = cell.node.value;
        if (cell.node.value) {
            if (!isNaN(cell.node.value)) numberBST.insert(cell.node.ref, Number(cell.node.value));
            else
                if (cell.node.value !== "#NAME?") stringBST.insert(cell.node.ref, cell.node.value);
        }
        graph.reevaluateAllDependencies(cell);
        saveState(cell, textForUndo);
    };
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') input.blur();
    });
    input.addEventListener('blur', saveInput);
}
