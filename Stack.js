class Stack {
    constructor() {
        this.list = new LinkedList();
    }

    push(val) {
        this.list.insertAtHead(val);
    }

    pop() {
        if (!this.list.isEmpty()) {
            const topValue = this.list.head.val;
            this.list.deleteFromStart(); 
            return topValue;
        } else {
            throw new Error("Stack is empty. Cannot pop.");
        }
    }

    peek() {
        if (!this.list.isEmpty()) {
            return this.list.head.val;
        } else {
            throw new Error("Stack is empty. Cannot peek.");
        }
    }

    empty() {
        return this.list.isEmpty();
    }

    size() {
        return this.list.size();
    }
}
