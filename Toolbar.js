document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelector('.tab-button.active').classList.remove('active');
        document.querySelector('.tab-panel.active').classList.remove('active');
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

function restoreStyles(cell, style) {
    cell.style.fontWeight = style.fontWeight || 'normal';
    cell.style.fontStyle = style.fontStyle || 'normal';
    cell.style.textDecoration = style.textDecoration || 'none';
    cell.style.textAlign = style.textAlign || 'center';
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
    if (!currentCell) return;
    if (event.ctrlKey) {
        if (event.key.toLowerCase() === 'b') {
            saveState(currentCell);
            currentCell.style.fontWeight = currentCell.style.fontWeight === 'bold' ? 'normal' : 'bold';
        } else if (event.key.toLowerCase() === 'i') {
            saveState(currentCell);
            currentCell.style.fontStyle = currentCell.style.fontStyle === 'italic' ? 'normal' : 'italic';
        } else if (event.key.toLowerCase() === 'q') {
            saveState(currentCell);
            currentCell.style.textDecoration = currentCell.style.textDecoration === 'underline' ? 'none' : 'underline';
        }
    }
});

document.getElementById('fontSizeDropdown').addEventListener('change', function () {
    const selectedFontSize = this.value;
    const activeCell = document.querySelector('.highlight');
    if (activeCell) {
        activeCell.style.fontSize = selectedFontSize + 'px';
    }
});

document.getElementById('alignLeft').addEventListener('click', () => {
    if (!currentCell) return;
    saveState(currentCell);
    currentCell.style.textAlign = 'left';
});

document.getElementById('alignCenter').addEventListener('click', () => {
    if (!currentCell) return;
    saveState(currentCell);
    currentCell.style.textAlign = 'center';
});

document.getElementById('alignRight').addEventListener('click', () => {
    if (!currentCell) return;
    saveState(currentCell);
    currentCell.style.textAlign = 'right';
});

function getSelectedCell() {
    return document.querySelector('.highlight');
}

document.getElementById('clearData').addEventListener('click', function () {
    clearData();
});
function insertRow() {
    for (let i = 0; i < cols; i++) {
        list.insertNode(rows, i);
    }
    rows++;
}
function insertColumn() {
    for (let i = 0; i < rows; i++) {
        list.insertNode(i, cols);
    }
    cols++;
}
document.getElementById('insertRow').addEventListener('click', function () {
    insertRow();
    display(list);
});

document.getElementById('insertColumn').addEventListener('click', function () {
    insertColumn();
    display(list);
});

document.getElementById('toggleGrid').addEventListener('click', function () {
    toggleGridlines();
});

document.getElementById('toggleTheme').addEventListener('click', function () {
    toggleTheme();
});

function clearData() {
    let arr = Array.from(document.querySelectorAll('td'));
    for (let i = 0; i < arr.length; i++) {
        if (i < cols || (i % (cols + 1)) === 0)
            continue;
        arr[i].innerText = ""
    }
    let row = list.head
    while (row) {
        col = row
        while (col) {
            col.value = ""
            col = col.right
        }
        row = row.down
    }
}
let lines = true;
function toggleGridlines() {
    const table = document.querySelector('table');
    const isLightTheme = document.body.classList.contains('light-theme');
    const borderColor = isLightTheme ? 'black' : 'white';

    if (lines) {
        table.style.border = 'none';
        table.querySelectorAll('td, th').forEach(cell => {
            cell.style.border = 'none';
        });
        lines = false;
    } else {
        table.style.border = `1px solid ${borderColor}`;
        table.querySelectorAll('td, th').forEach(cell => {
            cell.style.border = `1px solid ${borderColor}`;
        });
        lines = true;
    }
}

function toggleTheme() {
    const isLightTheme = document.body.classList.contains('light-theme');

    if (isLightTheme) {
        document.body.classList.replace('light-theme', 'dark-theme');
        document.querySelectorAll('td, th').forEach(cell => {
            cell.style.backgroundColor = '#121212';
            cell.style.color = 'white';
            cell.style.border = '1px solid white';
        });
    } else {
        document.body.classList.replace('dark-theme', 'light-theme');
        document.querySelectorAll('td, th').forEach(cell => {
            cell.style.backgroundColor = 'white';
            cell.style.color = 'black';
            cell.style.border = '1px solid black';
        });
    }
}

document.body.classList.add('light-theme');

const style = document.createElement('style');
style.innerHTML = `
    .light-theme {
        background-color: white;
        color: black;
        transition: background-color 0.3s, color 0.3s;
    }

    .dark-theme {
        background-color: #121212;
        color: white;
        transition: background-color 0.3s, color 0.3s;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    td, th {
        padding: 8px;
        text-align: center;
    }
`;
document.head.appendChild(style);