document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        search();
    }
});

function search() {
    const existingBox = document.getElementById('search-box');
    if (existingBox) return; 

    const searchBox = document.createElement('div');
    searchBox.id = 'search-box';
    searchBox.style.position = 'fixed';
    searchBox.style.top = '10px';
    searchBox.style.right = '10px';
    searchBox.style.zIndex = 1000;
    searchBox.style.background = 'white';
    searchBox.style.border = '1px solid black';
    searchBox.style.padding = '10px';
    searchBox.innerHTML = `
        <input type="text" id="search-input" placeholder="Find..." style="margin-right: 5px;">
        <button id="search-btn">Search</button>
        <button id="close-search">X</button>
    `;

    document.body.appendChild(searchBox);

    document.getElementById('search-btn').addEventListener('click', () => {
        const query = document.getElementById('search-input').value.trim();
        if (query) searchCells(query);
    });

    document.getElementById('close-search').addEventListener('click', () => {
        document.body.removeChild(searchBox);
        clearHighlights();
    });
}

function searchCells(query) {
    clearHighlights();

    let results = [];
    if (!isNaN(query)) {
        const queryinNum = parseFloat(query);
        results = numberBST.find(queryinNum);
    } else {
        results = stringBST.find(query);
    }
    console.log(results);

    if (results.length > 0) {
        results.forEach((ref) => highlightFoundCell(ref[0], ref[1]));
    } else {
        alert('No matches found');
    }
}

function clearHighlights() {
    const highlightedCells = document.querySelectorAll('.found');
    highlightedCells.forEach(cell => cell.classList.remove('found'));
}

function highlightFoundCell(row, col) {
    const cell = list.getNode(row, col).domElement;
    if (cell) {
        cell.classList.add('found');
    }
}
