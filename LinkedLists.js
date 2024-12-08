class Node {
    constructor(data) {
        this.data = data
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

    insertNode(i, j) {
        const node = new Node(`${i}, ${j}`);
        if (i === 0 && j === 0) {
            this.head = node;
            this.end = node;
            return;
        }
        if (j > 0) {
            node.left = this.end; 
            this.end.right = node;
        } else if (j === 0 && i > 0) {
            let prevRowStart = this.getNode(i - 1, 0);
            prevRowStart.down = node;
            node.up = prevRowStart;
        }
        if (i > 0) {
            let upperNode = this.getNode(i - 1, j);
            node.up = upperNode;
            upperNode.down = node;
        }
        this.end = node;
    }
}