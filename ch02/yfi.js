/// -*- Mode: JavaScript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   yfi.js
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

YFI.prototype.add = function(obj) {
    if ( obj instanceof YFI ) {
        return new YFI(this.getLength() + obj.getLength());
    } else {
        return new YFI(this.getLength() + obj);
    }
};

YFI.add = function(...objs) {
    let zero = new YFI();

    return objs.reduce((obj1, obj2) => {
        if ( obj1 instanceof YFI ) {
            return obj1.add(obj2);
        } else if ( obj2 instanceof YFI ) {
            return obj2.add(obj1);
        } else {
            return new YFI(obj1 + obj2);
        }
    }, zero);
};

YFI.prototype.equals = function(obj) {
    if ( obj instanceof YFI ) {
        return this.getLength() === obj.getLength();
    } else {
        return this.getLength() === obj;
    }
};

YFI.equals = function(obj, ...objs) {
    return objs.every(elt => {
        if ( obj instanceof YFI ) {
            return obj.equals(elt);
        } else if ( elt instanceof YFI ) {
            return elt.equals(obj);
        } else {
            return obj === elt
        }
    });
};
