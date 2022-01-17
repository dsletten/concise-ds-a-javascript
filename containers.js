/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   containers.js
//
//   Description
//
//   Started:           Tue Jan 11 12:20:51 2022
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

//
//     Container
//     
function Container() {
    throw new Error("Cannot instantiate Container.");
}

Container.prototype.isEmpty = function() {
    throw new Error("Container does not implement isEmpty().");
};

Container.prototype.size = function() {
    throw new Error("Container does not implement size().");
};

Container.prototype.clear = function() {
    throw new Error("Container does not implement clear().");
};

function Dispenser() {
    throw new Error("Cannot instantiate Dispenser.");
}

Dispenser.prototype = Object.create(Container.prototype);
Dispenser.prototype.constructor = Dispenser;
Object.defineProperty(Dispenser.prototype, "constructor", {enumerable: false, configurable: false});

//
//    Node
// 
function Node(head, tail) {
    this.head = head;
    this.tail = tail;
}

Node.prototype.first = function() {
    return this.head;
};

Node.prototype.rest = function() {
    return this.tail;
};

Node.prototype.setFirst = function(head) {
    this.head = head;
};

Node.prototype.setRest = function(tail) {
    this.tail = tail;
};
    
Node.prototype.toString = function() {
    return carPrint(this.first()) + cdrPrint(this.rest());

    function carPrint(obj) {
        return "(" + obj;
    }

    function cdrPrint(obj) {
        if ( obj === null ) {
            return ")";
        } else if ( !(obj instanceof Node) ) { // I.e., (atom obj)
            return " . " + obj + ")";
        } else {
            return " " + obj.first() + cdrPrint(obj.rest());
        }
    }
};

Node.prototype.spliceBefore = function(obj) {
    let copy = new Node(this.first(), this.rest());
    this.setFirst(obj);
    this.setRest(copy);
};

Node.prototype.spliceAfter = function(obj) {
    let tail = new Node(obj, this.rest());
    this.setRest(tail);
};

Node.prototype.exciseNode = function() {
    let doomed = this.first();
    let saved = this.rest();

    if ( saved === null ) {
        throw new Error("Target node must have non-nil next node");
    } else {
        this.setFirst(saved.first());
        this.setRest(saved.rest());
    }

    return doomed;
};

Node.prototype.exciseChild = function() {
    let child = this.rest();

    if ( child === null ) {
        throw new Error("Parent must have child node");
    } else {
        this.setRest(child.rest());
    }

    return child.first();
};

Node.reverse = function(list) {
    function reverse(list, rest) {

        if ( list === null ) {
            return rest;
        } else {
            return reverse(list.rest(), new Node(list.first(), rest));
        }
    }

    return reverse(list, null);
};

//
//     Collection
//     
function Collection() {
    throw new Error("Cannot instantiate Collection.");
}

Collection.prototype = Object.create(Container.prototype);
Collection.prototype.constructor = Collection;
Object.defineProperty(Collection.prototype, "constructor", {enumerable: false, configurable: false});

Collection.prototype.iterator = function() {
    throw new Error("Collection does not implement iterator().");
};

//
//     - Check type?
//     - Equality test?
//     
Collection.prototype.contains = function(obj) {
    throw new Error("Collection does not implement contains().");
};

Collection.prototype.equals = function(collection) {
    throw new Error("Collection does not implement equals().");
};

Collection.prototype.each = function(op) {
    throw new Error("Collection does not implement each().");
};

//
//    Iterator
//
function Iterator() {
    throw new Error("Cannot instantiate Iterator.");
}

Iterator.prototype.current = function() {
    if ( this.isDone() ) {
        throw new Error("Iteration already finished");
    } else {
        return this.doCurrent();
    }
};

Iterator.prototype.doCurrent = function() {
    throw new Error("Iterator does not implement doCurrent().");
};

Iterator.prototype.next = function() {
    throw new Error("Iterator does not implement next().");
};

Iterator.prototype.done = function() {
    throw new Error("Iterator does not implement done().");
};

//
//    MutableCollectionIterator
// 
function MutableCollectionIterator(collection) {
    this.collection = collection;
    this.expectedModificationCount = collection.modificationCount;
}

MutableCollectionIterator.prototype = Object.create(Iterator.prototype);
MutableCollectionIterator.prototype.constructor = MutableCollectionIterator;
Object.defineProperty(MutableCollectionIterator.prototype, "constructor", {enumerable: false, configurable: false});

MutableCollectionIterator.prototype.comodified = function() {
    return this.expectedModificationCount !== this.collection.modificationCount;
};

MutableCollectionIterator.prototype.doCurrent = function() {
    if ( this.comodified() ) {
        throw new Error("Iterator invalid due to structural modification of collection");
    } else {
        return this.doDoCurrent();
    }
};

MutableCollectionIterator.prototype.doDoCurrent = function() {
    throw new Error("MutableCollectionIterator does not implement doDoCurrent().");
};

MutableCollectionIterator.prototype.next = function() {
    if ( this.comodified() ) {
        throw new Error("Iterator invalid due to structural modification of collection");
    } else {
        return this.doNext();
    }
};

MutableCollectionIterator.prototype.doNext = function() {
    throw new Error("MutableCollectionIterator does not implement doNext().");
};

MutableCollectionIterator.prototype.isDone = function() {
    if ( this.comodified() ) {
        throw new Error("Iterator invalid due to structural modification of collection");
    } else {
        return this.doIsDone();
    }
};

MutableCollectionIterator.prototype.doIsDone = function() {
    throw new Error("MutableCollectionIterator does not implement doIsDone().");
};
