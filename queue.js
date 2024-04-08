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

Queue.prototype.elements = function() {
    let elements = [];

    while ( !this.isEmpty() ) {
        elements.push(this.dequeue());
    }

    return elements;
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
//     RingBuffer
//     
function RingBuffer() {
    throw new Error("Cannot instantiate RingBuffer.");
}

RingBuffer.prototype = Object.create(Queue.prototype);
RingBuffer.prototype.constructor = RingBuffer;
Object.defineProperty(RingBuffer.prototype, "constructor", {enumerable: false, configurable: false});

RingBuffer.prototype.enqueue = function(obj) {
    if ( this.isFull() ) {
        this.resize();
    }

    this.doEnqueue(obj);
};

RingBuffer.prototype.resize = function() {
    if ( this.isFull() ) {
        this.doResize();
    } else {
        throw new Error("resize() called without full buffer");
    }
};

RingBuffer.prototype.isFull = function() {
    throw new Error("RingBuffer does not implement isFull().");
};

RingBuffer.prototype.doEnqueue = function() {
    throw new Error("RingBuffer does not implement doEnqueue().");
};

RingBuffer.prototype.doResize = function() {
    throw new Error("RingBuffer does not implement doResize().");
};

//
//     ArrayRingBuffer (见 Lisp ARRAY-QUEUE)
//
function ArrayRingBuffer() {
    this.store = new Array(ArrayRingBuffer.INITIAL_CAPACITY);
    this.head = 0;
    this.count = 0;
}

ArrayRingBuffer.prototype = Object.create(RingBuffer.prototype);
ArrayRingBuffer.prototype.constructor = ArrayRingBuffer;
Object.defineProperty(ArrayRingBuffer.prototype, "constructor", {enumerable: false, configurable: false});

ArrayRingBuffer.INITIAL_CAPACITY = 20;

ArrayRingBuffer.prototype.offset = function(i) {
    return mod(this.head + i, this.store.length);
};

ArrayRingBuffer.prototype.isFull = function() {
    return this.count === this.store.length;
};

ArrayRingBuffer.prototype.doResize = function() {
    let newStore = new Array(this.store.length * 2);
    for (let i = 0; i < this.count; i++) {
        newStore[i] = this.store[this.offset(i)];
    }
    
    this.store = newStore;
    this.head = 0;
};

ArrayRingBuffer.prototype.size = function() {
    return this.count;
};

ArrayRingBuffer.prototype.doEnqueue = function(obj) {
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
    this.head = Node.makeList(LinkedRingBuffer.INITIAL_CAPACITY);
    this.tail = this.head;
    this.head.last().setRest(this.head);
    this.count = 0;
}

LinkedRingBuffer.prototype = Object.create(RingBuffer.prototype);
LinkedRingBuffer.prototype.constructor = LinkedRingBuffer;
Object.defineProperty(LinkedRingBuffer.prototype, "constructor", {enumerable: false, configurable: false});

LinkedRingBuffer.INITIAL_CAPACITY = 20;

LinkedRingBuffer.prototype.size = function() {
    return this.count;
};

// LinkedRingBuffer.prototype.clear = function() {
//     while ( !this.isEmpty() ) {
//         this.dequeue();
//     }
// };

LinkedRingBuffer.prototype.isFull = function() {
    return this.tail.rest() === this.head;
};

LinkedRingBuffer.prototype.doResize = function() {
    let more = Node.makeList(this.count + 1);
    more.last().setRest(this.head);
    this.tail.setRest(more);
};

LinkedRingBuffer.prototype.doEnqueue = function(obj) {
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

LinkedRingBuffer.prototype.doFront = function() {
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
//     DllQueue
//     
function DllQueue() {
    this.list = new DoublyLinkedList();
}

DllQueue.prototype = Object.create(Queue.prototype);
DllQueue.prototype.constructor = DllQueue;
Object.defineProperty(DllQueue.prototype, "constructor", {enumerable: false, configurable: false});

DllQueue.prototype.size = function() {
    return this.list.size();
};

DllQueue.prototype.clear = function() {
    this.list.clear();
};

DllQueue.prototype.enqueue = function(obj) {
    this.list.add(obj);
};

DllQueue.prototype.doDequeue = function() {
    return this.list.delete(0);
};

DllQueue.prototype.doFront = function() {
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
    if ( this.isEmpty() ) {
        return this;
    } else {
        return this.makeEmptyPersistentQueue();
    }
};

PersistentQueue.prototype.fill = function({count = 1000, generator = x => x} = {}) {
    let newQueue = this;
    for (let i = 1; i <= count; i++) {
        newQueue = newQueue.enqueue(generator(i));
    }

    return newQueue;
};

PersistentQueue.prototype.elements = function() {
    let elements = [];
    let queue = this;

    while ( !queue.isEmpty() ) {
        elements.push(queue.front());
        queue = queue.dequeue();
    }

    return elements;
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
//     - No actual connection to RingBuffer...
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

//
//    These must be copied from RingBuffer!
//
// ArrayRingBufferDeque.prototype.enqueue = function(obj) {
//     if ( this.isFull() ) {
//         this.resize();
//     }

//     this.doEnqueue(obj);
// };

// ArrayRingBufferDeque.prototype.resize = function() {
//     if ( this.isFull() ) {
//         this.doResize();
//     } else {
//         throw new Error("resize() called without full buffer");
//     }
// };
// 
// 
//    ArrayRingBuffer is not a class! Add methods from another prototype:
ArrayRingBufferDeque.prototype.enqueue = RingBuffer.prototype.enqueue
ArrayRingBufferDeque.prototype.resize = RingBuffer.prototype.resize

ArrayRingBufferDeque.prototype.enqueueFront = function(obj) {
    if ( this.isFull() ) {
        this.resize();
    }

    this.doEnqueueFront(obj);
};

ArrayRingBufferDeque.prototype.isFull = function() {
    return this.count === this.store.length;
};

ArrayRingBufferDeque.prototype.doResize = function() {
    let newStore = new Array(this.store.length * 2);
    for (let i = 0; i < this.count; i++) {
        newStore[i] = this.store[this.offset(i)];
    }
    
    this.store = newStore;
    this.head = 0;
};

ArrayRingBufferDeque.prototype.size = function() {
    return this.count;
};

ArrayRingBufferDeque.prototype.doEnqueue = function(obj) {
    this.store[this.offset(this.count)] = obj;
    this.count++;
};

ArrayRingBufferDeque.prototype.doEnqueueFront = function(obj) {
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
//     ArrayRingBufferDequeX
//     - Design exercise in composition
//     - Must violate encapsulation of contained ArrayRingBuffer????
//
function ArrayRingBufferDequeX() {
    this.ringBuffer = new ArrayRingBuffer();
}

ArrayRingBufferDequeX.prototype = Object.create(Deque.prototype);
ArrayRingBufferDequeX.prototype.constructor = ArrayRingBufferDequeX;
Object.defineProperty(ArrayRingBufferDequeX.prototype, "constructor", {enumerable: false, configurable: false});

ArrayRingBufferDequeX.prototype.size = function() {
    return this.ringBuffer.size();
};

ArrayRingBufferDequeX.prototype.enqueue = function(obj) {
    this.ringBuffer.enqueue(obj);
};

ArrayRingBufferDequeX.prototype.enqueueFront = function(obj) {
    let rb = this.ringBuffer;
    if ( rb.isFull() ) { //  ???
        rb.resize();
    }

    rb.head = rb.offset(-1);
    rb.store[rb.offset(0)] = obj;
    rb.count++;
};

ArrayRingBufferDequeX.prototype.doDequeue = function() {
    return this.ringBuffer.dequeue();
};

ArrayRingBufferDequeX.prototype.doDequeueRear = function() {
    let rb = this.ringBuffer;
    let discard = this.rear();

    rb.store[rb.offset(rb.count - 1)] = null;
    rb.count--;

    return discard;
};

ArrayRingBufferDequeX.prototype.doFront = function() {
    return this.ringBuffer.front();
};

ArrayRingBufferDequeX.prototype.doRear = function() {
    let rb = this.ringBuffer;
    return rb.store[rb.offset(rb.count - 1)];
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
    return this.list.delete(0);
};

DllDeque.prototype.enqueueFront = function(obj) {
    this.list.insert(0, obj);
};

DllDeque.prototype.doDequeueRear = function() {
    return this.list.delete(-1);
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
    if ( this.isEmpty() ) {
        return this;
    } else {
        return this.makeEmptyPersistentDeque();
    }
};

//    Use PersistentQueue's fill()??
PersistentDeque.prototype.fill = function({count = 1000, generator = x => x} = {}) {
    let newDeque = this;
    for (let i = 1; i <= count; i++) {
        newDeque = newDeque.enqueue(generator(i));
    }

    return newDeque;
};

PersistentDeque.prototype.elements = function() {
    let elements = [];
    let deque = this;

    while ( !deque.isEmpty() ) {
        elements.push(deque.front());
        deque = deque.dequeue();
    }

    return elements;
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
