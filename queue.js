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
//   Notes: Property `front` clashes with `front()` method!!!
//
//////////////////////////////////////////////////////////////////////////////
"use strict";

function Queue() {
    throw new Error("Cannot instantiate Queue.");
}

Queue.prototype = Object.create(Dispenser.prototype);
Queue.prototype.constructor = Queue;
Object.defineProperty(Queue.prototype, "constructor", {enumerable: false, configurable: false});

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
Queue.prototype.enqueue = function() {
    throw new Error("Queue does not implement enqueue().");
};

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
//    Not appropriate for PersistentQueue!
//    
Queue.prototype.fill = function({count = 1000, generator = x => x} = {}) {
    for (let i = 1; i <= count; i++) {
        this.enqueue(generator(i));
    }

    return this;
};

//
//     ArrayQueue (见 RubyQueue. Uses built-in array operations)
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
//     ArrayRingBuffer (见 Lisp ARRAY-QUEUE)
//
function ArrayRingBuffer() {
    this.store = new Array(ArrayRingBuffer.INITIAL_CAPACITY);
    this.head = 0;
    this.count = 0;
}

ArrayRingBuffer.prototype = Object.create(Queue.prototype);
ArrayRingBuffer.prototype.constructor = ArrayRingBuffer;
Object.defineProperty(ArrayRingBuffer.prototype, "constructor", {enumerable: false, configurable: false});

ArrayRingBuffer.INITIAL_CAPACITY = 20;

ArrayRingBuffer.prototype.offset = function(i) {
    return mod(this.head + i, this.store.length);
};

ArrayRingBuffer.prototype.resize = function() {
    if ( this.count === this.store.length ) {
        let newStore = new Array(this.store.length * 2);
        for (let i = 0; i < this.count; i++) {
            newStore[i] = this.store[this.offset(i)];
        }
        
        this.store = newStore;
        this.head = 0;
    } else {
        throw new Error("resize() called without full store.");
    }
};

ArrayRingBuffer.prototype.size = function() {
    return this.count;
};

ArrayRingBuffer.prototype.enqueue = function(obj) {
    if ( this.count === this.store.length ) {
        this.resize();
    }

    this.store[this.offset(this.count)] = obj;
    this.count++;
};

ArrayRingBuffer.prototype.doDequeue = function() {
    let discard = this.front();
    this.store[this.head] = null;
    this.head = this.offset(1);
    this.count--;

    return discard;
};

ArrayRingBuffer.prototype.doFront = function() {
    return this.store[this.head];
};

//
//     LinkedQueue
//     
function LinkedQueue() {
    this.head = null;
    this.tail = null;
    this.count = 0;
}

LinkedQueue.prototype = Object.create(Queue.prototype);
LinkedQueue.prototype.constructor = LinkedQueue;
Object.defineProperty(LinkedQueue.prototype, "constructor", {enumerable: false, configurable: false});

LinkedQueue.prototype.size = function() {
    return this.count;
};

LinkedQueue.prototype.clear = function() {
    this.head = null;
    this.tail = null;
    this.count = 0;
};

LinkedQueue.prototype.enqueue = function(obj) {
    let node = new Node(obj, null);

    if ( this.isEmpty() ) {
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
//     LinkedRingBuffer
//     
function LinkedRingBuffer() {
    LinkedQueue.call(this);
    this.head = Node.makeList(LinkedRingBuffer.INITIAL_CAPACITY);
    this.tail = this.head;
    this.head.last().setRest(this.head);
}

LinkedRingBuffer.prototype = Object.create(LinkedQueue.prototype);
LinkedRingBuffer.prototype.constructor = LinkedRingBuffer;
Object.defineProperty(LinkedRingBuffer.prototype, "constructor", {enumerable: false, configurable: false});

LinkedRingBuffer.INITIAL_CAPACITY = 20;

LinkedRingBuffer.prototype.clear = function() {
    while ( !this.isEmpty() ) {
        this.dequeue();
    }
};

LinkedRingBuffer.prototype.resize = function() {
    if ( this.tail.rest() === this.head ) {
        let more = Node.makeList(this.count + 1);
        more.last().setRest(this.head);
        this.tail.setRest(more);
    } else {
        throw new Error("resize() called without full store.");
    }
};

LinkedRingBuffer.prototype.enqueue = function(obj) {
    if ( this.tail.rest() === this.head ) {
        this.resize();
    }
    
    this.tail.setFirst(obj);
    this.tail = this.tail.rest();

    this.count++;
};

LinkedRingBuffer.prototype.doDequeue = function() {
    let discard = this.front();

    this.head.setFirst(null);
    this.head = this.head.rest();
    this.count--;

    return discard;
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
    throw new Error("Cannot instantiate PersistentQueue.");
}

PersistentQueue.prototype = Object.create(Queue.prototype);
PersistentQueue.prototype.constructor = PersistentQueue;
Object.defineProperty(PersistentQueue.prototype, "constructor", {enumerable: false, configurable: false});

PersistentQueue.prototype.clear = function() {
    return this.makeEmptyPersistentQueue();
};

PersistentQueue.prototype.fill = function({count = 1000, generator = x => x} = {}) {
    let newQueue = this;
    for (let i = 1; i <= count; i++) {
        newQueue = newQueue.enqueue(generator(i));
    }

    return newQueue;
};

//
//    PersistentLinkedQueue
// 
function PersistentLinkedQueue() {
    this.head = null;
    this.tail = null;
    this.count = 0;
}

PersistentLinkedQueue.prototype = Object.create(PersistentQueue.prototype);
PersistentLinkedQueue.prototype.constructor = PersistentLinkedQueue;
Object.defineProperty(PersistentLinkedQueue.prototype, "constructor", {enumerable: false, configurable: false});

PersistentLinkedQueue.initializeQueue = function(head, tail, count) {
    let newQueue = new PersistentLinkedQueue();
    newQueue.head = head;
    newQueue.tail = tail;
    newQueue.count = count;

    return newQueue;
};

PersistentLinkedQueue.prototype.makeEmptyPersistentQueue = function() {
    return new PersistentLinkedQueue();
};

PersistentLinkedQueue.prototype.size = function() {
    return this.count;
};

PersistentLinkedQueue.prototype.enqueue = function(obj) {
    if ( this.isEmpty() ) {
        return PersistentLinkedQueue.initializeQueue(new Node(obj, null), null, 1);
    } else {
        return PersistentLinkedQueue.initializeQueue(this.head, new Node(obj, this.tail), this.count+1);
    }
};

PersistentLinkedQueue.prototype.doDequeue = function() {
    if ( this.head.rest() === null ) {
        return PersistentLinkedQueue.initializeQueue(Node.reverse(this.tail), null, this.count-1);
    } else {
        return PersistentLinkedQueue.initializeQueue(this.head.rest(), this.tail, this.count-1);
    }
};

PersistentLinkedQueue.prototype.doFront = function() {
    return this.head.first();
};

//
//    PersistentListQueue
// 
function PersistentListQueue() {
    this.list = PersistentListQueue.empty;
}

PersistentListQueue.prototype = Object.create(PersistentQueue.prototype);
PersistentListQueue.prototype.constructor = PersistentListQueue;
Object.defineProperty(PersistentListQueue.prototype, "constructor", {enumerable: false, configurable: false});

PersistentListQueue.empty = new PersistentList();
Object.defineProperty(PersistentListQueue, "empty", {enumerable: false, configurable: false});

PersistentListQueue.initializeQueue = function(list) {
    let newQueue = new PersistentListQueue();
    newQueue.list = list;

    return newQueue;
};

PersistentListQueue.prototype.makeEmptyPersistentQueue = function() {
    return new PersistentListQueue();
};

PersistentListQueue.prototype.size = function() {
    return this.list.size();
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
//     ArrayRingBufferDeque (见 Lisp ARRAY-DEQUE)
//     - Single inheritance precludes much reuse?!
//
function ArrayRingBufferDeque() {
    this.store = new Array(ArrayRingBufferDeque.INITIAL_CAPACITY);
    this.head = 0;
    this.count = 0;
}

ArrayRingBufferDeque.prototype = Object.create(Deque.prototype);
ArrayRingBufferDeque.prototype.constructor = ArrayRingBufferDeque;
Object.defineProperty(ArrayRingBufferDeque.prototype, "constructor", {enumerable: false, configurable: false});

ArrayRingBufferDeque.INITIAL_CAPACITY = 20;

ArrayRingBufferDeque.prototype.offset = function(i) {
    return mod(this.head + i, this.store.length);
};

ArrayRingBufferDeque.prototype.resize = function() {
    if ( this.count === this.store.length ) {
        let newStore = new Array(this.store.length * 2);
        for (let i = 0; i < this.count; i++) {
            newStore[i] = this.store[this.offset(i)];
        }
        
        this.store = newStore;
        this.head = 0;
    } else {
        throw new Error("resize() called without full store.");
    }
};

ArrayRingBufferDeque.prototype.size = function() {
    return this.count;
};

ArrayRingBufferDeque.prototype.enqueue = function(obj) {
    if ( this.count === this.store.length ) {
        this.resize();
    }

    this.store[this.offset(this.count)] = obj;
    this.count++;
};

ArrayRingBufferDeque.prototype.enqueueFront = function(obj) {
    if ( this.count === this.store.length ) {
        this.resize();
    }

    this.head = this.offset(-1);
    this.store[this.offset(0)] = obj;
    this.count++;
};

ArrayRingBufferDeque.prototype.doDequeue = function() {
    let discard = this.front();
    this.store[this.head] = null;
    this.head = this.offset(1);
    this.count--;

    return discard;
};

ArrayRingBufferDeque.prototype.doDequeueRear = function() {
    let discard = this.rear();
    this.store[this.offset(this.count - 1)] = null;
    this.count--;

    return discard;
};

ArrayRingBufferDeque.prototype.doFront = function() {
    return this.store[this.head];
};

ArrayRingBufferDeque.prototype.doRear = function() {
    return this.store[this.offset(this.count - 1)];
};

//
//    Doubly-linked-list deque
//
function DllDeque() {
    this.list = new DoublyLinkedList();
}

DllDeque.prototype = Object.create(Deque.prototype);
DllDeque.prototype.constructor = DllDeque;
Object.defineProperty(DllDeque.prototype, "constructor", {enumerable: false, configurable: false});

DllDeque.prototype.size = function() {
    return this.list.size();
};

DllDeque.prototype.clear = function() {
    this.list.clear();
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
    throw new Error("Cannot instantiate PersistentDeque.");
}

PersistentDeque.prototype = Object.create(Deque.prototype);
PersistentDeque.prototype.constructor = PersistentDeque;
Object.defineProperty(PersistentDeque.prototype, "constructor", {enumerable: false, configurable: false});

PersistentDeque.prototype.clear = function() {
    return this.makeEmptyPersistentDeque();
};

//    Use PersistentQueue's fill()??
PersistentDeque.prototype.fill = function({count = 1000, generator = x => x} = {}) {
    let newDeque = this;
    for (let i = 1; i <= count; i++) {
        newDeque = newDeque.enqueue(generator(i));
    }

    return newDeque;
};

//
//    PersistentLinkedDeque
//
function PersistentLinkedDeque() {
    this.head = null;
    this.tail = null;
    this.count = 0;
}

PersistentLinkedDeque.prototype = Object.create(PersistentDeque.prototype);
PersistentLinkedDeque.prototype.constructor = PersistentLinkedDeque;
Object.defineProperty(PersistentLinkedDeque.prototype, "constructor", {enumerable: false, configurable: false});

PersistentLinkedDeque.initializeDeque = function(head, tail, count) {
    let newDeque = new PersistentLinkedDeque();
    newDeque.head = head;
    newDeque.tail = tail
    newDeque.count = count;

    return newDeque;
};

PersistentLinkedDeque.prototype.makeEmptyPersistentDeque = function() {
    return new PersistentLinkedDeque();
};

PersistentLinkedDeque.prototype.size = function() {
    return this.count;
};

PersistentLinkedDeque.prototype.enqueue = function(obj) {
    if ( this.isEmpty() ) {
        return PersistentLinkedDeque.initializeDeque(new Node(obj, null), new Node(obj, null), 1);
    } else {
        return PersistentLinkedDeque.initializeDeque(this.head, new Node(obj, this.tail), this.count+1);
    }
};

PersistentLinkedDeque.prototype.enqueueFront = function(obj) {
    if ( this.isEmpty() ) {
        return PersistentLinkedDeque.initializeDeque(new Node(obj, null), new Node(obj, null), 1);
    } else {
        return PersistentLinkedDeque.initializeDeque(new Node(obj, this.head), this.tail, this.count+1);
    }
};

PersistentLinkedDeque.prototype.doDequeue = function() {
    if ( this.head.rest() === null ) {
        if ( this.tail.rest() === null ) {
            return this.clear();
        } else {
            return PersistentLinkedDeque.initializeDeque(Node.reverse(this.tail).rest(), new Node(this.rear(), null), this.count-1);
        }
    } else {
        return PersistentLinkedDeque.initializeDeque(this.head.rest(), this.tail, this.count-1);
    }
};

PersistentLinkedDeque.prototype.doDequeueRear = function() {
    if ( this.tail.rest() === null ) {
        if ( this.head.rest() === null ) {
            return this.clear();
        } else {
            return PersistentLinkedDeque.initializeDeque(new Node(this.front(), null), Node.reverse(this.head).rest(), this.count-1);
        }
    } else {
        return PersistentLinkedDeque.initializeDeque(this.head, this.tail.rest(), this.count-1);
    }
};

PersistentLinkedDeque.prototype.doFront = function() {
    return this.head.first();
};

PersistentLinkedDeque.prototype.doRear = function() {
    return this.tail.first();
};

//
//    PersistentListDeque
//
function PersistentListDeque() {
    this.list = PersistentListDeque.empty;
}

PersistentListDeque.prototype = Object.create(PersistentDeque.prototype);
PersistentListDeque.prototype.constructor = PersistentListDeque;
Object.defineProperty(PersistentListDeque.prototype, "constructor", {enumerable: false, configurable: false});

PersistentListDeque.empty = new PersistentList();
Object.defineProperty(PersistentListDeque, "empty", {enumerable: false, configurable: false});

PersistentListDeque.initializeDeque = function(list) {
    let newDeque = new PersistentListDeque();
    newDeque.list = list;

    return newDeque;
};

PersistentListDeque.prototype.makeEmptyPersistentDeque = function() {
    return new PersistentListDeque();
};

PersistentListDeque.prototype.size = function() {
    return this.list.size();
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
