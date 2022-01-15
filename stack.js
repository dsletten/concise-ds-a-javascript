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

ArrayStack.prototype.clear = function() {
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

LinkedStack.prototype.clear = function() {
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

HashStack.prototype.clear = function() {
    this.store = {};
    this.count = 0;
};

HashStack.prototype.push = function(obj) {
    this.count++;
    this.store[this.count] = obj;
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
//     PersistentStack
//     
function PersistentStack() {
    this.top = null;
    this.count = 0;
}

PersistentStack.prototype = Object.create(Stack.prototype);
PersistentStack.prototype.constructor = PersistentStack;
Object.defineProperty(PersistentStack.prototype, "constructor", {enumerable: false, configurable: false});

function initializeStack(top, count) {
    let newStack = new PersistentStack();
    newStack.top = top;
    newStack.count = count;

    return newStack;
}

PersistentStack.prototype.size = function() {
    return this.count;
};

PersistentStack.prototype.isEmpty = function() {
    return this.top === null;
};

PersistentStack.prototype.clear = function() {
    return new PersistentStack();
};

PersistentStack.prototype.push = function(obj) {
    return initializeStack(new Node(obj, this.top), this.count+1);
};

PersistentStack.prototype.doPop = function() {
    return initializeStack(this.top.rest(), this.count-1);
};

PersistentStack.prototype.doPeek = function() {
    return this.top.first();
};
