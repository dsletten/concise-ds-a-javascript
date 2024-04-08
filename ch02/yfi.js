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

function YFI(x, y, z) {
    function srsly() {
        throw new Error("SRSLY?.");
    }

    function bad() {
        throw new Error("Length components must be non-negative.");
    }
    
    //
    //     Some pathological cases can circumvent this logic, e.g.,
    //     new YFI(undefined, undefined, 8)
    //     
    if ( x === undefined ) {
        srsly();
    } else if ( x < 0 ) {
        bad();
    } else if ( y === undefined ) {
        if ( x instanceof YFI ) {
            return x;
        } else {
            this.len = x;
        }
    } else if ( y < 0 ) {
        bad();
    } else if ( z === undefined ) {
        this.len = x * 12 + y;
    } else if ( z < 0 ) {
        bad();
    } else {
        this.len = x * 36 + y * 12 + z;
    }
}

YFI.prototype.constructor = YFI;
Object.defineProperty(YFI.prototype, "constructor", {enumerable: false, configurable: false});

YFI.prototype.toString = function() {
    return `[yards: ${this.yards()} feet: ${this.feet()} inches: ${this.inches()}]`;
};

YFI.prototype.length = function() {
    return this.len;
};

YFI.prototype.inches = function() {
    return this.length() % 12;
};

YFI.prototype.feet = function() {
    return Math.floor(this.length() / 12) % 3;
};

YFI.prototype.yards = function() {
    return Math.floor(this.length() / 36);
};

YFI.prototype.add = function(obj) {
    if ( obj instanceof YFI ) {
        return new YFI(this.length() + obj.length());
    } else {
        return new YFI(this.length() + obj);
    }
};

YFI.add = function(obj1, obj2) {
    if ( obj1 instanceof YFI ) {
        return obj1.add(obj2);
    } else if ( obj2 instanceof YFI ) {
        return obj2.add(obj1);
    } else {
        return new YFI(obj1 + obj2);
    }
};

    
