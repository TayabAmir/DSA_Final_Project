class Queue {
    constructor() {
        this.list = new LinkedList();
    }

    enqueue(val) {
        this.list.insertAtEnd(val);
    }

    dequeue() {
        if (!this.list.isEmpty()) {
            const frontValue = this.list.head.val;
            this.list.deleteFromStart();
            return frontValue;
        } else {
            throw new Error("Queue is empty. Cannot dequeue.");
        }
    }

    peek() {
        if (!this.list.isEmpty()) {
            return this.list.head.val;
        } else {
            throw new Error("Queue is empty. Cannot peek.");
        }
    }

    empty() {
        return this.list.isEmpty();
    }

    size() {
        return this.list.size();
    }
}