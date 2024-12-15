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
    searchBox.style.background = '#ffffff';
    searchBox.style.border = '1px solid #ccc';
    searchBox.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    searchBox.style.padding = '15px';
    searchBox.style.borderRadius = '8px';
    searchBox.style.fontFamily = 'Arial, sans-serif';

    searchBox.innerHTML = `
    <input type="text" id="search-input" placeholder="Find..." 
        style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 150px; margin-right: 10px; font-size: 14px;">
    <button id="search-btn" 
        style="padding: 8px 12px; background-color: green; color: white; border: none; border-radius: 5px; font-size: 14px; cursor: pointer;">
        Search
    </button>
    <button id="close-search" 
        style="padding: 8px 12px; background-color: #f44336; color: white; border: none; border-radius: 5px; font-size: 14px; cursor: pointer; margin-left: 5px;">
        X
    </button>
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
