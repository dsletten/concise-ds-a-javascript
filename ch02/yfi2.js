/// -*- Mode: JavaScript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   yfi2.js
//
//   Description
//
//   Started:           Thu Jul 20 02:06:44 2023
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

function YFI2(length = 0) {
    if ( length < 0 ) {
        throw new Error("Length must be non-negative.");
    } else {
        this.length = length;
    }
}

YFI2.makeYFI = function({yards = 0, feet = 0, inches = 0} = {}) {
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
        return new YFI2(yardsToInches(yards) + feetToInches(feet) + inches);
    }
}

YFI2.prototype.constructor = YFI2;
Object.defineProperty(YFI2.prototype, "constructor", {enumerable: false, configurable: false});

YFI2.prototype.toString = function() {
    return `${this.constructor.name} [yards: ${this.getYards()} feet: ${this.getFeet()} inches: ${this.getInches()}]`;
};

YFI2.prototype.getLength = function() {
    return this.length;
};

YFI2.prototype.getInches = function() {
    return this.getLength() % 12;
};

YFI2.prototype.getFeet = function() {
    return Math.floor(this.getLength() / 12) % 3;
};

YFI2.prototype.getYards = function() {
    return Math.floor(this.getLength() / 36);
};

YFI2.prototype.add = function(obj) {
    if ( obj instanceof YFI2 ) {
        return new YFI2(this.getLength() + obj.getLength());
    } else {
        return new YFI2(this.getLength() + obj);
    }
};

YFI2.add = function(...objs) {
    let zero = new YFI2();

    return objs.reduce((obj1, obj2) => {
        if ( obj1 instanceof YFI2 ) {
            return obj1.add(obj2);
        } else if ( obj2 instanceof YFI2 ) {
            return obj2.add(obj1);
        } else {
            return new YFI2(obj1 + obj2);
        }
    }, zero);
};

YFI2.prototype.equals = function(obj) {
    if ( obj instanceof YFI2 ) {
        return this.getLength() === obj.getLength();
    } else {
        return this.getLength() === obj;
    }
};

YFI2.equals = function(obj, ...objs) {
    return objs.every(elt => {
        if ( obj instanceof YFI2 ) {
            return obj.equals(elt);
        } else if ( elt instanceof YFI2 ) {
            return elt.equals(obj);
        } else {
            return obj === elt
        }
    });
};
