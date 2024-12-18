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
    container.innerHTML = '';
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
    makeColumnsResizable(table);
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
        headerCell.classList.add('resizable');
        headerCell.style.position = 'relative';
        const resizeHandle = document.createElement('div');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '0';
        resizeHandle.style.top = '0';
        resizeHandle.style.width = '5px';
        resizeHandle.style.height = '100%';
        resizeHandle.style.cursor = 'ew-resize';
        headerCell.appendChild(resizeHandle);
        headerRow.appendChild(headerCell);
    }
    table.prepend(headerRow);
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

function makeColumnsResizable(table) {
    const cols = table.querySelectorAll('td:first-child, th:first-child');
    cols.forEach((col, index) => {
        const resizer = document.createElement('div');
        resizer.style.position = 'absolute';
        resizer.style.right = '0';
        resizer.style.width = '5px';
        resizer.style.cursor = 'col-resize';
        resizer.style.userSelect = 'none';
        resizer.style.height = '100%';
        resizer.style.background = 'transparent';

        resizer.addEventListener('mousedown', function (e) {
            e.preventDefault();
            const startX = e.pageX;
            const startWidth = col.offsetWidth;

            function onMouseMove(event) {
                const newWidth = startWidth + (event.pageX - startX);
                col.style.width = `${newWidth}px`;
                table.querySelectorAll(`td:nth-child(${index + 1})`).forEach(cell => {
                    cell.style.width = `${newWidth}px`;
                });
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        col.style.position = 'relative';
        col.appendChild(resizer);
    });
}
display(list);