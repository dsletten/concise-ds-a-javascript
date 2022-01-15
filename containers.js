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

function Container() {
    throw new Error("Cannot instantiate Container.");
}

//
//    JavaScript DEFGENERIC
//    
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

function Collection() {
    throw new Error("Cannot instantiate Collection.");
}

Collection.prototype = Object.create(Container.prototype);
Collection.prototype.constructor = Collection;
Object.defineProperty(Collection.prototype, "constructor", {enumerable: false, configurable: false});

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

