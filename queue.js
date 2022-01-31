/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   queue.js
//
//   Description
//
//   Started:           Fri Jan 14 10:47:16 2022
//   Modifications:
//
//   Purpose:
//
//   Calling Sequence:
//
//
//   Inputs:
//
//
//   Outputs:
//
//
//   Example:
//
//   Notes:
//
//////////////////////////////////////////////////////////////////////////////
"use strict";

function Queue() {
    throw new Error("Cannot instantiate Queue.");
}

Queue.prototype = Object.create(Dispenser.prototype);
Queue.prototype.constructor = Queue;
Object.defineProperty(Queue.prototype, "constructor", {enumerable: false, configurable: false});

Queue.prototype.clear = function() {
    while ( !this.isEmpty() ) {
        this.dequeue();
    }
};

//    Check type???
//Queue.prototype.enqueue = function() {

Queue.prototype.dequeue = function() {
    if ( this.isEmpty() ) {
        throw new Error("Queue is empty.");
    } else {
        return this.doDequeue();
    }
};

Queue.prototype.front = function() {
    if ( this.isEmpty() ) {
        throw new Error("Queue is empty.");
    } else {
        return this.doFront();
    }
};

Queue.prototype.doDequeue = function() {
    throw new Error("Queue does not implement doDequeue().");
};

Queue.prototype.doFront = function() {
    throw new Error("Queue does not implement doFront().");
};

//
//     ArrayQueue
//
function ArrayQueue() {
    this.store = [];
}

ArrayQueue.prototype = Object.create(Queue.prototype);
ArrayQueue.prototype.constructor = ArrayQueue;
Object.defineProperty(ArrayQueue.prototype, "constructor", {enumerable: false, configurable: false});

ArrayQueue.prototype.size = function() {
    return this.store.length;
};

ArrayQueue.prototype.isEmpty = function() {
    return this.store.length === 0;
};

ArrayQueue.prototype.clear = function() {
    this.store = [];
};

ArrayQueue.prototype.enqueue = function(obj) {
    this.store.push(obj);
};

ArrayQueue.prototype.doDequeue = function() {
    return this.store.shift();
};

ArrayQueue.prototype.doFront = function() {
    return this.store[0];
};

//
//     LinkedQueue
//     
function LinkedQueue() {
    this.head = null; // `front` clashes with `front()`!!
    this.tail = null;
    this.count = 0;
}

LinkedQueue.prototype = Object.create(Queue.prototype);
LinkedQueue.prototype.constructor = LinkedQueue;
Object.defineProperty(LinkedQueue.prototype, "constructor", {enumerable: false, configurable: false});

LinkedQueue.prototype.size = function() {
    return this.count;
};

LinkedQueue.prototype.isEmpty = function() {
    return this.size() === 0;
};

LinkedQueue.prototype.clear = function() {
    this.head = null;
    this.tail = null;
    this.count = 0;
};

LinkedQueue.prototype.enqueue = function(obj) {
    let node = new Node(obj, null);

    if ( this.head === null ) {
        this.tail = this.head = node;
    } else {
        this.tail.setRest(node);
        this.tail = this.tail.rest();
    }

    this.count++;
};

LinkedQueue.prototype.doDequeue = function() {
    let discard = this.front();
    this.head = this.head.rest();

    if ( this.head === null ) {
        this.tail = this.head;
    }

    this.count--;

    return discard;
};

LinkedQueue.prototype.doFront = function() {
    return this.head.first();
};

//
//     CircularQueue
//     - This is kind of pointless. Just a variant of LinkedQueue.
//     
function CircularQueue() {
    this.index = null;
    this.count = 0;
}

CircularQueue.prototype = Object.create(Queue.prototype);
CircularQueue.prototype.constructor = CircularQueue;
Object.defineProperty(CircularQueue.prototype, "constructor", {enumerable: false, configurable: false});

CircularQueue.prototype.size = function() {
    return this.count;
};

CircularQueue.prototype.isEmpty = function() {
    return this.size() === 0;
};

CircularQueue.prototype.clear = function() {
    this.index = null;
    this.count = 0;
};

CircularQueue.prototype.enqueue = function(obj) {
    let node = new Node(obj, null);

    if ( this.index === null ) {
        this.index = node;
        this.index.setRest(node);
    } else {
        node.setRest(this.index.rest());
        this.index.setRest(node);
        this.index = node;
    }
    
    this.count++;
};

CircularQueue.prototype.doDequeue = function() {
    let discard = this.front();

    if ( this.index === this.index.rest() ) {
        this.index = null;
    } else {
        this.index.setRest(this.index.rest().rest());
    }
    
    this.count--;

    return discard;
};

CircularQueue.prototype.doFront = function() {
    return this.index.rest().first();
};

//
//    HashQueue
//
function HashQueue() {
    this.store = {};
    this.count = 0;
    this.head = 0;
    this.tail = 0;
}

HashQueue.prototype = Object.create(Queue.prototype);
HashQueue.prototype.constructor = HashQueue;
Object.defineProperty(HashQueue.prototype, "constructor", {enumerable: false, configurable: false});

HashQueue.prototype.size = function() {
    return this.count;
};

HashQueue.prototype.isEmpty = function() {
    return this.count === 0;
};

HashQueue.prototype.clear = function() {
    this.store = {};
    this.count = 0;
    this.head = 0;
    this.tail = 0;
};

HashQueue.prototype.enqueue = function(obj) {
    this.store[this.tail] = obj;
    this.tail++;
    this.count++;
};

HashQueue.prototype.doDequeue = function() {
    let discard = this.front();
    delete this.store[this.head];
    this.head++;
    this.count--;

    return discard;
};

HashQueue.prototype.doFront = function() {
    return this.store[this.head];
};

//
//    PersistentQueue
// 
function PersistentQueue() {
    this.head = null;
    this.tail = null;
    this.count = 0;
}

PersistentQueue.prototype = Object.create(Queue.prototype);
PersistentQueue.prototype.constructor = PersistentQueue;
Object.defineProperty(PersistentQueue.prototype, "constructor", {enumerable: false, configurable: false});

PersistentQueue.initializeQueue = function(head, tail, count) {
    let newQueue = new PersistentQueue();
    newQueue.head = head;
    newQueue.tail = tail;
    newQueue.count = count;

    return newQueue;
};

PersistentQueue.prototype.size = function() {
    return this.count;
};

PersistentQueue.prototype.isEmpty = function() {
    return this.size() === 0;
};

PersistentQueue.prototype.clear = function() {
    return new PersistentQueue();
};

PersistentQueue.prototype.enqueue = function(obj) {
    if ( this.isEmpty() ) {
        return PersistentQueue.initializeQueue(new Node(obj, null), null, 1);
    } else {
        return PersistentQueue.initializeQueue(this.head, new Node(obj, this.tail), this.count+1);
    }
};

PersistentQueue.prototype.doDequeue = function() {
    if ( this.head.rest() === null ) {
        return PersistentQueue.initializeQueue(Node.reverse(this.tail), null, this.count-1);
    } else {
        return PersistentQueue.initializeQueue(this.head.rest(), this.tail, this.count-1);
    }
};

PersistentQueue.prototype.doFront = function() {
    return this.head.first();
};
