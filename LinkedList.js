class LLNode {
    constructor(value) {
        this.val = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    isEmpty() {
        return this.head === null;
    }

    insertAtHead(val) {
        const node = new LLNode(val);
        if (this.head === null) {
            this.head = this.tail = node;
        } else {
            node.next = this.head;
            this.head = node;
        }
    }

    insertAtEnd(val) {
        const node = new LLNode(val);
        if (this.head === null) {
            this.head = this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
    }

    findNode(val) {
        let temp = this.head;
        while (temp) {
            if (temp.val === val) return true;
            temp = temp.next;
        }
        return false;
    }

    deleteFromStart() {
        if (this.head) {
            const temp = this.head;
            this.head = this.head.next;
            if (this.head === null) {
                this.tail = null;
            }
        } else {
            throw new Error("Cannot delete from an empty list.");
        }
    }

    deleteFromEnd() {
        if (this.head) {
            if (this.head === this.tail) {
                this.head = this.tail = null;
            } else {
                let temp = this.head;
                while (temp.next !== this.tail) {
                    temp = temp.next;
                }
                temp.next = null;
                this.tail = temp;
            }
        } else {
            throw new Error("Cannot delete from an empty list.");
        }
    }

    size() {
        let count = 0;
        let temp = this.head;
        while (temp) {
            count++;
            temp = temp.next;
        }
        return count;
    }
}
