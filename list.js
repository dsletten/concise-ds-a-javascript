/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   list.js
//
//   Description
//
//   Started:           Tue Jan 11 12:26:51 2022
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

function List() {
    throw new Error("Cannot instantiate List.");
}

List.prototype = Object.create(Container.prototype);
List.prototype.constructor = List;
Object.defineProperty(List.prototype, "constructor", {enumerable: false, configurable: false});

List.prototype.addFront = function(obj) {
    throw new Error("Abstract method.");
};

List.prototype.addRear = function(obj) {
    throw new Error("Abstract method.");
};

//
//    :AROUND method -> Template Method design pattern
//    
List.prototype.front = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        return this.doFront();
    }
};

List.prototype.rear = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        return this.doRear();
    }
};

List.prototype.removeFront = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        this.doRemoveFront();
    }
};

List.prototype.removeRear = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        this.doRemoveRear();
    }
};

List.prototype.isEmpty = function() {
    return this.size() === 0;
};

List.prototype.makeEmpty = function() {
    while ( !this.isEmpty() ) {
        this.removeFront();
    }
};

List.prototype.elements = function() {
    throw new Error("Abstract method.");
};

List.prototype.contains = function() {
    throw new Error("Abstract method.");
};
