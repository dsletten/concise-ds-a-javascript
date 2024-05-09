/// -*- Mode: JavaScript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   yfi.js
//
//   Description
//
//   Started:           Mon May  6 21:45:18 2024
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

function YFI(length = 0) {
    if ( length < 0 ) {
        throw new Error("Length must be non-negative.");
    } else {
        this.length = length;
    }
}

YFI.makeYFI = function({yards = 0, feet = 0, inches = 0} = {}) {
    function isValidInteger(x) {
        return x >= 0  &&  x % 1 === 0;
    }
    
    function feetToInches(feet) {
        return feet * 12;
    }

    function yardsToInches(yards) {
        return yards * 36;
    }
    
    if ( ![yards, feet, inches].every(x => isValidInteger(x)) ) {
        throw new Error("Length components must be non-negative integers.");
    } else {
        return new YFI(yardsToInches(yards) + feetToInches(feet) + inches);
    }
}

YFI.prototype.constructor = YFI;
Object.defineProperty(YFI.prototype, "constructor", {enumerable: false, configurable: false});

YFI.prototype.toString = function() {
    return `${this.constructor.name} [yards: ${this.getYards()} feet: ${this.getFeet()} inches: ${this.getInches()}]`;
};

YFI.prototype.getLength = function() {
    return this.length;
};

YFI.prototype.getInches = function() {
    return this.getLength() % 12;
};

YFI.prototype.getFeet = function() {
    return Math.floor(this.getLength() / 12) % 3;
};

YFI.prototype.getYards = function() {
    return Math.floor(this.getLength() / 36);
};

//
//    The only reason to have both add() methods is to support the identity element
//    behavior: YFI.add() => 0
//    Can't do that with an instance method and no instance!
//    
YFI.prototype.add = function(yfi) {
    return new YFI(this.getLength() + yfi.getLength());
};

YFI.add = function(...yfis) {
    let zero = new YFI();

    return yfis.reduce((sum, yfi) => sum.add(yfi), zero);
};

YFI.prototype.equals = function(yfi) {
    return this.getLength() === yfi.getLength();
};

YFI.equals = function(yfi, ...yfis) {
    return yfis.every(elt => yfi.equals(elt));
};
