/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   stack.js
//
//   Description
//
//   Started:           Tue Jan 11 12:28:51 2022
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

function Stack() {
    throw new Error("Cannot instantiate Stack.");
}

Stack.prototype = Object.create(Dispenser.prototype);
Stack.prototype.constructor = Stack;
Object.defineProperty(Stack.prototype, "constructor", {enumerable: false, configurable: false});

//    Check type???
//Stack.prototype.push = function() {
Stack.prototype.push = function() {
    throw new Error("Stack does not implement push().");
};

Stack.prototype.pop = function() {
    if ( this.isEmpty() ) {
        throw new Error("Stack is empty.");
    } else {
        return this.doPop();
    }
};

Stack.prototype.peek = function() {
    if ( this.isEmpty() ) {
        throw new Error("Stack is empty.");
    } else {
        return this.doPeek();
    }
};

Stack.prototype.doPop = function() {
    throw new Error("Stack does not implement doPop().");
};

Stack.prototype.doPeek = function() {
    throw new Error("Stack does not implement doPeek().");
};

//
//    For testing...
//    
Stack.prototype.fill = function({count = 1000, generator = x => x} = {}) {
    for (let i = 1; i <= count; i++) {
        this.push(generator(i));
    }

    return this;
};

Stack.prototype.elements = function() {
    let elements = [];

    while ( !this.isEmpty() ) {
        elements.push(this.pop());
    }

    return elements;
};

//
//     ArrayStack
//
function ArrayStack() {
    this.store = [];
}

ArrayStack.prototype = Object.create(Stack.prototype);
ArrayStack.prototype.constructor = ArrayStack;
Object.defineProperty(ArrayStack.prototype, "constructor", {enumerable: false, configurable: false});

ArrayStack.prototype.size = function() {
    return this.store.length;
};

ArrayStack.prototype.isEmpty = function() {
    return this.store.length === 0;
};

ArrayStack.prototype.doClear = function() {
    this.store = [];
};

ArrayStack.prototype.push = function(obj) {
    this.store.push(obj);
};

ArrayStack.prototype.doPop = function() {
    return this.store.pop();
};

ArrayStack.prototype.doPeek = function() {
    return this.store[this.store.length-1];
};

//
//     LinkedStack
//     
function LinkedStack() {
    this.top = null;
    this.count = 0;
}

LinkedStack.prototype = Object.create(Stack.prototype);
LinkedStack.prototype.constructor = LinkedStack;
Object.defineProperty(LinkedStack.prototype, "constructor", {enumerable: false, configurable: false});

LinkedStack.prototype.size = function() {
    return this.count;
};

LinkedStack.prototype.isEmpty = function() {
    return this.top === null;
};

LinkedStack.prototype.doClear = function() {
    this.top = null;
    this.count = 0;
};

LinkedStack.prototype.push = function(obj) {
    this.top = new Node(obj, this.top);
    this.count++;
};

LinkedStack.prototype.doPop = function() {
    let discard = this.peek();
    this.top = this.top.rest();
    this.count--;

    return discard;
};

LinkedStack.prototype.doPeek = function() {
    return this.top.first();
};

//
//     LinkedListStack
//
function LinkedListStack() {
    this.list = new SinglyLinkedList();
}

LinkedListStack.prototype = Object.create(Stack.prototype);
LinkedListStack.prototype.constructor = LinkedListStack;
Object.defineProperty(LinkedListStack.prototype, "constructor", {enumerable: false, configurable: false});

LinkedListStack.prototype.size = function() {
    return this.list.size();
};

LinkedListStack.prototype.isEmpty = function() {
    return this.list.isEmpty();
};

LinkedListStack.prototype.doClear = function() {
    this.list.clear();
};

LinkedListStack.prototype.push = function(obj) {
    this.list.insert(0, obj);
};

LinkedListStack.prototype.doPop = function() {
    return this.list.delete(0);
};

LinkedListStack.prototype.doPeek = function() {
    return this.list.get(0);
};

//
//    HashStack
//
function HashStack() {
    this.store = {};
    this.count = 0;
}

HashStack.prototype = Object.create(Stack.prototype);
HashStack.prototype.constructor = HashStack;
Object.defineProperty(HashStack.prototype, "constructor", {enumerable: false, configurable: false});

HashStack.prototype.size = function() {
    return this.count;
};

HashStack.prototype.isEmpty = function() {
    return this.count === 0;
};

HashStack.prototype.doClear = function() {
    this.store = {};
    this.count = 0;
};

HashStack.prototype.push = function(obj) {
    this.store[++this.count] = obj;
};

HashStack.prototype.doPop = function() {
    let discard = this.peek();
    delete this.store[this.count--];

    return discard;
};

HashStack.prototype.doPeek = function() {
    return this.store[this.count];
};

//
//    MapStack
//    - A Map keeps its own count
//
function MapStack() {
    this.store = new Map();
}

MapStack.prototype = Object.create(Stack.prototype);
MapStack.prototype.constructor = MapStack;
Object.defineProperty(MapStack.prototype, "constructor", {enumerable: false, configurable: false});

MapStack.prototype.size = function() {
    return this.store.size;
};

MapStack.prototype.isEmpty = function() {
    return this.size() === 0;
};

MapStack.prototype.doClear = function() {
    this.store.clear();
};

MapStack.prototype.push = function(obj) {
    this.store.set(this.size()+1, obj);
};

MapStack.prototype.doPop = function() {
    let discard = this.peek();
    this.store.delete(this.size());

    return discard;
};

MapStack.prototype.doPeek = function() {
    return this.store.get(this.size());
};

//
//     PersistentStack
//     
function PersistentStack() {
    throw new Error("Cannot instantiate PersistentStack.");
}

PersistentStack.prototype = Object.create(Stack.prototype);
PersistentStack.prototype.constructor = PersistentStack;
Object.defineProperty(PersistentStack.prototype, "constructor", {enumerable: false, configurable: false});

PersistentStack.prototype.clear = function() {
    if ( this.isEmpty() ) {
        return this;
    } else {
        return this.makeEmptyPersistentStack();
    }
};

PersistentStack.prototype.fill = function({count = 1000, generator = x => x} = {}) {
    let newStack = this;
    for (let i = 1; i <= count; i++) {
        newStack = newStack.push(generator(i));
    }

    return newStack;
};

PersistentStack.prototype.elements = function() {
    let elements = [];
    let stack = this;

    while ( !stack.isEmpty() ) {
        elements.push(stack.peek());
        stack = stack.pop();
    }

    return elements;
};

//
//     PersistentLinkedStack
//     
function PersistentLinkedStack() {
    this.top = null;
    this.count = 0;
}

PersistentLinkedStack.prototype = Object.create(PersistentStack.prototype);
PersistentLinkedStack.prototype.constructor = PersistentLinkedStack;
Object.defineProperty(PersistentLinkedStack.prototype, "constructor", {enumerable: false, configurable: false});

PersistentLinkedStack.initializeStack = function(top, count) {
    let newStack = new PersistentLinkedStack();
    newStack.top = top;
    newStack.count = count;

    return newStack;
};

PersistentLinkedStack.prototype.makeEmptyPersistentStack = function() {
    return new PersistentLinkedStack();
};

PersistentLinkedStack.prototype.size = function() {
    return this.count;
};

PersistentLinkedStack.prototype.isEmpty = function() {
    return this.top === null;
};

PersistentLinkedStack.prototype.push = function(obj) {
    return PersistentLinkedStack.initializeStack(new Node(obj, this.top), this.count+1);
};

PersistentLinkedStack.prototype.doPop = function() {
    return PersistentLinkedStack.initializeStack(this.top.rest(), this.count-1);
};

PersistentLinkedStack.prototype.doPeek = function() {
    return this.top.first();
};

//
//     PersistentListStack
//     
function PersistentListStack() {
    this.list = PersistentListStack.empty;
}

PersistentListStack.prototype = Object.create(PersistentStack.prototype);
PersistentListStack.prototype.constructor = PersistentListStack;
Object.defineProperty(PersistentListStack.prototype, "constructor", {enumerable: false, configurable: false});

PersistentListStack.empty = new PersistentList();
Object.defineProperty(PersistentListStack, "empty", {enumerable: false, configurable: false});

PersistentListStack.initializeStack = function(list) {
    let newStack = new PersistentListStack();
    newStack.list = list;

    return newStack;
};

PersistentListStack.prototype.makeEmptyPersistentStack = function() {
    return new PersistentListStack();
};

PersistentListStack.prototype.size = function() {
    return this.list.size();
};

PersistentListStack.prototype.isEmpty = function() {
    return this.list.isEmpty();
};

PersistentListStack.prototype.push = function(obj) {
    return PersistentListStack.initializeStack(this.list.insert(0, obj));
};

PersistentListStack.prototype.doPop = function() {
    return PersistentListStack.initializeStack(this.list.delete(0));
};

PersistentListStack.prototype.doPeek = function() {
    return this.list.get(0);
};
