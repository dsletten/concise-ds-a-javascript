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

//
//    Not appropriate for PersistentQueue!
//    
Queue.prototype.fill = function(count = 1000) {
    for (var i = 1; i <= count; i++) {
        this.enqueue(i);
    }

    return this;
};

Queue.prototype.isEmpty = function() {
    return this.size() === 0;
};

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

Queue.prototype.enqueue = function() {
    throw new Error("Queue does not implement enqueue().");
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

// LinkedQueue.prototype.isEmpty = function() {
//     return this.size() === 0;
// };

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
        this.tail = node;
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
//     LinkedListQueue
//     
function LinkedListQueue() {
    this.list = new SinglyLinkedList();
}

LinkedListQueue.prototype = Object.create(Queue.prototype);
LinkedListQueue.prototype.constructor = LinkedListQueue;
Object.defineProperty(LinkedListQueue.prototype, "constructor", {enumerable: false, configurable: false});

LinkedListQueue.prototype.size = function() {
    return this.list.size();
};

LinkedListQueue.prototype.clear = function() {
    this.list.clear();
};

LinkedListQueue.prototype.enqueue = function(obj) {
    this.list.add(obj);
};

LinkedListQueue.prototype.doDequeue = function() {
    return this.list.delete(0);
};

LinkedListQueue.prototype.doFront = function() {
    return this.list.get(0);
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

// CircularQueue.prototype.isEmpty = function() {
//     return this.size() === 0;
// };

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
//    MapQueue
//    - A Map keeps its own count
//
function MapQueue() {
    this.store = new Map();
    this.head = 0;
    this.tail = 0;
}

MapQueue.prototype = Object.create(Queue.prototype);
MapQueue.prototype.constructor = MapQueue;
Object.defineProperty(MapQueue.prototype, "constructor", {enumerable: false, configurable: false});

MapQueue.prototype.size = function() {
    return this.store.size;
};

MapQueue.prototype.clear = function() {
    this.store.clear();
    this.head = 0;
    this.tail = 0;
};

MapQueue.prototype.enqueue = function(obj) {
    this.store.set(this.tail, obj);
    this.tail++;
};

MapQueue.prototype.doDequeue = function() {
    let discard = this.front();
    this.store.delete(this.head);
    this.head++;

    return discard;
};

MapQueue.prototype.doFront = function() {
    return this.store.get(this.head);
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

PersistentQueue.prototype.fill = function(count = 1000) {
    let newQueue = this;
    for (var i = 1; i <= count; i++) {
        newQueue = newQueue.enqueue(i);
    }

    return newQueue;
};

PersistentQueue.prototype.size = function() {
    return this.count;
};

// PersistentQueue.prototype.isEmpty = function() {
//     return this.size() === 0;
// };

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

//
//    PersistentListQueue
// 
function PersistentListQueue() {
    this.list = PersistentListQueue.empty;
}

PersistentListQueue.prototype = Object.create(Queue.prototype);
PersistentListQueue.prototype.constructor = PersistentListQueue;
Object.defineProperty(PersistentListQueue.prototype, "constructor", {enumerable: false, configurable: false});

PersistentListQueue.empty = new PersistentList();
Object.defineProperty(PersistentListQueue, "empty", {enumerable: false, configurable: false});

PersistentListQueue.initializeQueue = function(list) {
    let newQueue = new PersistentListQueue();
    newQueue.list = list;

    return newQueue;
};

PersistentListQueue.prototype.fill = function(count = 1000) {
    let newQueue = this;
    for (var i = 1; i <= count; i++) {
        newQueue = newQueue.enqueue(i);
    }

    return newQueue;
};

PersistentListQueue.prototype.size = function() {
    return this.list.size();
};

PersistentListQueue.prototype.clear = function() {
    return new PersistentListQueue();
};

PersistentListQueue.prototype.enqueue = function(obj) {
    return PersistentListQueue.initializeQueue(this.list.add(obj));
};

PersistentListQueue.prototype.doDequeue = function() {
    return PersistentListQueue.initializeQueue(this.list.delete(0));
};

PersistentListQueue.prototype.doFront = function() {
    return this.list.get(0);
};

//
//    Deque (Double-ended queue)
//
function Deque() {
    throw new Error("Cannot instantiate Deque.");
}

Deque.prototype = Object.create(Queue.prototype);
Deque.prototype.constructor = Deque;
Object.defineProperty(Deque.prototype, "constructor", {enumerable: false, configurable: false});

// Deque.prototype.isEmpty = function() {
//     return this.size() === 0;
// };

Deque.prototype.enqueueFront = function(obj) {
    throw new Error("Deque does not implement enqueueFront().");
};

Deque.prototype.dequeueRear = function(obj) {
    if ( this.isEmpty() ) {
        throw new Error("Deque is empty.");
    } else {
        return this.doDequeueRear();
    }
};

Deque.prototype.rear = function(obj) {
    if ( this.isEmpty() ) {
        throw new Error("Deque is empty.");
    } else {
        return this.doRear();
    }
};

Deque.prototype.doDequeueRear = function(obj) {
    throw new Error("Deque does not implement doDequeueRear().");
};

Deque.prototype.doRear = function(obj) {
    throw new Error("Deque does not implement doRear().");
};

//
//    Doubly-linked-list deque
//
// function DllDeque(list) {
//     this.list = list;
// }

function DllDeque() {
    this.list = new DoublyLinkedList();
}

// (defun make-dll-deque (&optional (type t))
//   (make-instance 'dll-deque :type type :list (make-doubly-linked-list :type type))) ; ??
// ;  (make-instance 'dll-deque :type type :list (make-doubly-linked-list))) ; ??

DllDeque.prototype = Object.create(Deque.prototype);
DllDeque.prototype.constructor = DllDeque;
Object.defineProperty(DllDeque.prototype, "constructor", {enumerable: false, configurable: false});

DllDeque.prototype.size = function() {
    return this.list.size();
};

DllDeque.prototype.enqueue = function(obj) {
    this.list.add(obj);
};

DllDeque.prototype.doDequeue = function() {
    let discard = this.front();
    this.list.delete(0);

    return discard;
};

DllDeque.prototype.enqueueFront = function(obj) {
    this.list.insert(0, obj);
};

DllDeque.prototype.doDequeueRear = function() {
    let discard = this.rear();
    this.list.delete(-1);

    return discard;
};

DllDeque.prototype.doFront = function() {
    return this.list.get(0);
};

DllDeque.prototype.doRear = function() {
    return this.list.get(-1);
};

//
//    HashDeque
//
function HashDeque() {
    this.store = {};
    this.count = 0;
    this.head = 0;
    this.tail = 0;
}

HashDeque.prototype = Object.create(Deque.prototype);
HashDeque.prototype.constructor = HashDeque;
Object.defineProperty(HashDeque.prototype, "constructor", {enumerable: false, configurable: false});

HashDeque.prototype.size = function() {
    return this.count;
};

HashDeque.prototype.clear = function() {
    this.store = {};
    this.count = 0;
    this.head = 0;
    this.tail = 0;
};

HashDeque.prototype.enqueue = function(obj) {
    if ( !this.isEmpty() ) {
        this.tail++;
    }

    this.store[this.tail] = obj;
    this.count++;
};

HashDeque.prototype.enqueueFront = function(obj) {
    if ( !this.isEmpty() ) {
        this.head--;
    }

    this.store[this.head] = obj;
    this.count++;
};

HashDeque.prototype.doDequeue = function() {
    let discard = this.front();
    delete this.store[this.head];

    this.count--;

    if ( !this.isEmpty() ) {
        this.head++;
    }

    return discard;
};

HashDeque.prototype.doDequeueRear = function() {
    let discard = this.rear();
    delete this.store[this.tail];

    this.count--;

    if ( !this.isEmpty() ) {
        this.tail--;
    }

    return discard;
};

HashDeque.prototype.doFront = function() {
    return this.store[this.head];
};

HashDeque.prototype.doRear = function() {
    return this.store[this.tail];
};

//
//    MapDeque
//
function MapDeque() {
    this.store = new Map();
    this.head = 0;
    this.tail = 0;
}

MapDeque.prototype = Object.create(Deque.prototype);
MapDeque.prototype.constructor = MapDeque;
Object.defineProperty(MapDeque.prototype, "constructor", {enumerable: false, configurable: false});

MapDeque.prototype.size = function() {
    return this.store.size;
};

MapDeque.prototype.clear = function() {
    this.store.clear();
    this.head = 0;
    this.tail = 0;
};

MapDeque.prototype.enqueue = function(obj) {
    if ( !this.isEmpty() ) {
        this.tail++;
    }

    this.store.set(this.tail, obj);
};

MapDeque.prototype.enqueueFront = function(obj) {
    if ( !this.isEmpty() ) {
        this.head--;
    }

    this.store.set(this.head, obj);
};

MapDeque.prototype.doDequeue = function() {
    let discard = this.front();
    this.store.delete(this.head);

    if ( !this.isEmpty() ) {
        this.head++;
    }

    return discard;
};

MapDeque.prototype.doDequeueRear = function() {
    let discard = this.rear();
    this.store.delete(this.tail);

    if ( !this.isEmpty() ) {
        this.tail--;
    }

    return discard;
};

MapDeque.prototype.doFront = function() {
    return this.store.get(this.head);
};

MapDeque.prototype.doRear = function() {
    return this.store.get(this.tail);
};

//
//    PersistentDeque
//
function PersistentDeque() {
    this.head = null;
    this.tail = null;
    this.count = 0;
}

PersistentDeque.prototype = Object.create(Deque.prototype);
PersistentDeque.prototype.constructor = PersistentDeque;
Object.defineProperty(PersistentDeque.prototype, "constructor", {enumerable: false, configurable: false});

PersistentDeque.initializeDeque = function(head, tail, count) {
    let newDeque = new PersistentDeque();
    newDeque.head = head;
    newDeque.tail = tail
    newDeque.count = count;

    return newDeque;
};

PersistentDeque.prototype.fill = function(count = 1000) {
    let newDeque = this;
    for (var i = 1; i <= count; i++) {
        newDeque = newDeque.enqueue(i);
    }

    return newDeque;
};

PersistentDeque.prototype.size = function() {
    return this.count;
};

PersistentDeque.prototype.clear = function() {
    return new PersistentDeque();
};

PersistentDeque.prototype.enqueue = function(obj) {
    if ( this.isEmpty() ) {
        return PersistentDeque.initializeDeque(new Node(obj, null), new Node(obj, null), 1);
    } else {
        return PersistentDeque.initializeDeque(this.head, new Node(obj, this.tail), this.count+1);
    }
};

PersistentDeque.prototype.enqueueFront = function(obj) {
    if ( this.isEmpty() ) {
        return PersistentDeque.initializeDeque(new Node(obj, null), new Node(obj, null), 1);
    } else {
        return PersistentDeque.initializeDeque(new Node(obj, this.head), this.tail, this.count+1);
    }
};

PersistentDeque.prototype.doDequeue = function() {
    if ( this.head.rest() === null ) {
        if ( this.tail.rest() === null ) {
            return this.clear();
        } else {
            return PersistentDeque.initializeDeque(Node.reverse(this.tail).rest(), new Node(this.rear(), null), this.count-1);
        }
    } else {
        return PersistentDeque.initializeDeque(this.head.rest(), this.tail, this.count-1);
    }
};

PersistentDeque.prototype.doDequeueRear = function() {
    if ( this.tail.rest() === null ) {
        if ( this.head.rest() === null ) {
            return this.clear();
        } else {
            return PersistentDeque.initializeDeque(new Node(this.front(), null), Node.reverse(this.head).rest(), this.count-1);
        }
    } else {
        return PersistentDeque.initializeDeque(this.head, this.tail.rest(), this.count-1);
    }
};

PersistentDeque.prototype.doFront = function() {
    return this.head.first();
};

PersistentDeque.prototype.doRear = function() {
    return this.tail.first();
};

//
//    PersistentListDeque
//
function PersistentListDeque() {
    this.list = PersistentListDeque.empty;
}

PersistentListDeque.prototype = Object.create(Deque.prototype);
PersistentListDeque.prototype.constructor = PersistentListDeque;
Object.defineProperty(PersistentListDeque.prototype, "constructor", {enumerable: false, configurable: false});

PersistentListDeque.empty = new PersistentList();
Object.defineProperty(PersistentListDeque, "empty", {enumerable: false, configurable: false});

PersistentListDeque.initializeDeque = function(list) {
    let newDeque = new PersistentListDeque();
    newDeque.list = list;

    return newDeque;
};

//
//     Same as PersistentDeque?!
//     
PersistentListDeque.prototype.fill = function(count = 1000) {
    let newDeque = this;
    for (var i = 1; i <= count; i++) {
        newDeque = newDeque.enqueue(i);
    }

    return newDeque;
};

PersistentListDeque.prototype.size = function() {
    return this.list.size();
};

PersistentListDeque.prototype.clear = function() {
    return new PersistentListDeque();
};

PersistentListDeque.prototype.enqueue = function(obj) {
    return PersistentListDeque.initializeDeque(this.list.add(obj));
};

PersistentListDeque.prototype.enqueueFront = function(obj) {
    return PersistentListDeque.initializeDeque(this.list.insert(0, obj));
};

PersistentListDeque.prototype.doDequeue = function() {
    return PersistentListDeque.initializeDeque(this.list.delete(0));
};

PersistentListDeque.prototype.doDequeueRear = function() {
    return PersistentListDeque.initializeDeque(this.list.delete(-1));
};

PersistentListDeque.prototype.doFront = function() {
    return this.list.get(0);
};

PersistentListDeque.prototype.doRear = function() {
    return this.list.get(-1);
};
