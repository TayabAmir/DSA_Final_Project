const rows = 100
const cols = 100
const list = new TernaryLinkedList()

for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
        list.insertNode(i, j)

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

            cell.addEventListener('click', function () {
                if (cell.querySelector('input')) return;

                let input = document.createElement('input');
                input.type = 'text';
                input.value = cell.innerText;

                cell.innerText = '';
                cell.appendChild(input);
                input.focus();

                const saveInput = () => {
                    cell.innerText = input.value;
                    cell.node.value = input.value;
                };

                input.addEventListener('blur', saveInput);

                input.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        input.blur();
                    }
                });
            });

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
    const hRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    hRow.appendChild(emptyCell);

    let char = 'A';
    for (let i = 0; i < cols; i++) {
        const headerCell = document.createElement('td');

        if (i < 26) {
            headerCell.innerText = String.fromCharCode(65 + i);
        } else if (i % 26 === 0) {
            char = String.fromCharCode(65 + Math.floor(i / 26) - 1);
            headerCell.innerText = char + 'A';
        } else {
            headerCell.innerText = char + String.fromCharCode(65 + (i % 26));
        }

        headerCell.style.fontWeight = "bold";
        hRow.appendChild(headerCell);
    }
    table.prepend(hRow);
}


display(list);