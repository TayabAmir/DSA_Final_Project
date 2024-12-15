function getCellReference(row, colIndex) {
    let column = "";
    colIndex += 1;
    while (colIndex > 0) {
        colIndex--;
        const remainder = colIndex % 26;
        column = String.fromCharCode('A'.charCodeAt(0) + remainder) + column;
        colIndex = Math.floor(colIndex / 26);
    }
    return `${column}${row + 1}`;
}

function parseCellReference(cellRef) {
    const columnPart = cellRef.match(/[A-Z]+/)[0];
    const rowPart = cellRef.match(/\d+/)[0];
    let colIndex = 0;
    for (let i = 0; i < columnPart.length; i++) {
        colIndex = colIndex * 26 + (columnPart.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    colIndex -= 1;
    const rowIndex = parseInt(rowPart, 10) - 1;
    return { row: rowIndex, col: colIndex };
}

class Graph {
    constructor() {
        this.adjList = new Map();
    }

    addNode(cell, neighbors = []) {
        let node = getCellReference(cell[0], cell[1]);
        let list = []
        neighbors.forEach(neigbor => {
            if (isNaN(neigbor)) {
                let neighborNode = getCellReference(neigbor[0], neigbor[1]);
                if (!this.adjList.has(neighborNode))
                    this.adjList.set(neighborNode, []);
                list.push(neighborNode);
            }
        });
        this.adjList.set(node, list);
    }

    removeNode(cell) {
        const node = getCellReference(cell[0], cell[1]);
        if (this.adjList.has(node)) this.adjList.delete(node);
        console.log(this.adjList)
    }

    detectCycle() {
        const inDegree = new Map();
        const queue = new Queue();
        const topologicalOrder = [];

        for (let [node, dependencies] of this.adjList.entries()) {
            if (!inDegree.has(node)) inDegree.set(node, 0);
            for (let dep of dependencies) {
                inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
            }
        }

        for (let [node, degree] of inDegree.entries()) {
            if (degree === 0) queue.enqueue(node);
        }

        while (!queue.empty()) {
            const node = queue.dequeue();
            topologicalOrder.push(node);

            if (this.adjList.has(node)) {
                for (let neighbor of this.adjList.get(node)) {
                    inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                    if (inDegree.get(neighbor) === 0) queue.enqueue(neighbor);
                }
            }
        }

        return topologicalOrder.length !== this.adjList.size;
    }

    reevaluateAllDependencies(cell) {
        for (let [nodeName, dependencies] of this.adjList) {
            for (let i of dependencies) {
                let rowCol = parseCellReference(i)
                if (cell.node.ref[0] == rowCol.row && cell.node.ref[1] == rowCol.col) {
                    let cellRefsInFormula = []
                    rowCol = parseCellReference(nodeName)
                    let actualNode = list.getNode(rowCol.row, rowCol.col)
                    actualNode.value = evaluate(actualNode.domElement, cellRefsInFormula).toString()
                    actualNode.domElement.innerText = actualNode.value
                    saveState(actualNode.domElement, actualNode.value)
                }
            }
        }
    }
}