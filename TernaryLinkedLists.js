class Node {
    constructor(row, col) {
        this.ref = [row, col]
        this.value = ""
        this.formula = "";
        this.left = null
        this.right = null
        this.up = null
        this.down = null
    }
}

class TernaryLinkedList {
    constructor() {
        this.head = null
        this.end = null
    }

    getNode(rowNumber, colNumber) {
        let temp = this.head
        let col = 0
        while (col++ < colNumber) temp = temp.right
        let row = 0
        while (row++ < rowNumber) temp = temp.down
        return temp
    }

    columnToIndex(colLetters) {
        let colIndex = 0;
        for (let i = 0; i < colLetters.length; i++) {
            colIndex = colIndex * 26 + (colLetters.charCodeAt(i) - "A".charCodeAt(0) + 1);
        }
        return colIndex - 1;
    }

    insertNode(row, col) {
        const node = new Node(row, col);
    
        if (row === 0 && col === 0) {
            this.head = node;
            this.end = node;
            return;
        }
    
        if (col > 0) {
            const leftNode = this.getNode(row, col - 1);
            if (leftNode) {
                node.left = leftNode;
                leftNode.right = node;
            }
        }
    
        if (row > 0) {
            const upperNode = this.getNode(row - 1, col);
            if (upperNode) {
                node.up = upperNode;
                upperNode.down = node;
            }
        }
    
        this.end = node;
    }
    
}