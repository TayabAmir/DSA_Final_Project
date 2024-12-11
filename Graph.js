function getCellReference(row, colIndex) {
    let column = "";
    while (colIndex > 0) {
        const remainder = (colIndex) % 26;
        column = String.fromCharCode('A'.charCodeAt(0) + remainder) + column;
        colIndex = Math.floor((colIndex) / 26);
    }

    return `${column}${row + 1}`;
}

class Graph {
    constructor() {
        this.adjList = new Map();
    }

    addNode(cell, neighbors = []) {
        let node = getCellReference(cell[0], cell[1]);
        let list = []
        neighbors.forEach(neigbor => {
            let neighborNode = getCellReference(neigbor[0], neigbor[1]);
            if (!this.adjList.has(neighborNode))
                this.adjList.set(neighborNode, []);
            list.push(neighborNode);
        });
        this.adjList.set(node, list);
    }

    removeNode(cell) {
        const node = getCellReference(cell[0], cell[1]);

        if (this.adjList.has(node)) {
            this.adjList.delete(node);

            // for (let neighbors of this.adjList.values()) {
            //     const index = neighbors.indexOf(node);
            //     if (index > -1) {
            //         neighbors.splice(index, 1);
            //     }
            // }
        }
    }

    detectCycle() {
        const inDegree = new Map();
        const queue = [];
        const topologicalOrder = [];

        for (let [node, dependencies] of this.adjList.entries()) {
            if (!inDegree.has(node)) inDegree.set(node, 0);
            for (let dep of dependencies) {
                inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
            }
        }

        for (let [node, degree] of inDegree.entries()) {
            if (degree === 0) queue.push(node);
        }

        while (queue.length > 0) {
            const node = queue.shift();
            topologicalOrder.push(node);

            if (this.adjList.has(node)) {
                for (let neighbor of this.adjList.get(node)) {
                    inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                    if (inDegree.get(neighbor) === 0) queue.push(neighbor);
                }
            }
        }

        return topologicalOrder.length !== this.adjList.size;
    }
}