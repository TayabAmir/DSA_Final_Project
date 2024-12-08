let rows = 20;
let cols = 56;
const list = new TernaryLinkedList();

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        list.insertNode(i, j);
    }
}

let currentCell = null;

function display(list) {
    let container = document.getElementById('grid-container');
    let table = document.createElement('table');
    let currRow = list.head;
    while (currRow) {
        let row = document.createElement('tr');
        let currCol = currRow;
        while (currCol) {
            let cell = document.createElement('td');
            cell.innerText = currCol.value;
            cell.node = currCol;
            cell.tabIndex = 0; 
            cell.addEventListener('click', function () {
                highlightCell(cell);
                if (!cell.querySelector('input')) {
                    enableEditing(cell);
                }
            });

            currCol.domElement = cell; 
            row.appendChild(cell);
            currCol = currCol.right;
        }

        table.appendChild(row);
        currRow = currRow.down;
    }

    container.appendChild(table);
    addRowHeaders();
    addColumnHeaders();
}

function addRowHeaders() {
    const rows = Array.from(document.getElementsByTagName('tr'));
    currRow = 1
    rows.forEach((row) => {
        const headerCell = document.createElement('td');
        headerCell.innerText = currRow;
        headerCell.style.fontWeight = "bold";
        row.prepend(headerCell);
        currRow++
    });
}

function addColumnHeaders() {
    const table = document.querySelector('table');
    const headerRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    headerRow.appendChild(emptyCell);
    let char = 'A';
    for (let i = 0; i < cols; i++) {
        const headerCell = document.createElement('td');

        if (i < 26) {
            headerCell.innerText = String.fromCharCode(65 + i);
        } else {
            const prefix = String.fromCharCode(65 + Math.floor(i / 26) - 1);
            const suffix = String.fromCharCode(65 + (i % 26));
            headerCell.innerText = prefix + suffix;
        }

        headerCell.style.fontWeight = 'bold';
        headerRow.appendChild(headerCell);
    }
    table.prepend(headerRow);
}

function highlightCell(cell) {
    if (currentCell) {
        currentCell.classList.remove('highlight');
        if (currentCell.querySelector('input')) {
            currentCell.querySelector('input').blur();
        }
    }
    currentCell = cell;
    currentCell.classList.add('highlight');
    cell.focus();
    if (!cell.querySelector('input')) {
        enableEditing(cell);
    }
}

document.addEventListener('keydown', function (event) {
    if (!currentCell || !currentCell.node) return;

    let nextNode = null;

    switch (event.key) {
        case 'ArrowUp':
            nextNode = currentCell.node.up;
            break;
        case 'ArrowDown':
            nextNode = currentCell.node.down;
            break;
        case 'ArrowLeft':
            nextNode = currentCell.node.left;
            break;
        case 'ArrowRight':
            nextNode = currentCell.node.right;
            break;
    }
    if (nextNode) {
        highlightCell(nextNode.domElement);
        event.preventDefault();  
    }
});

display(list);
