/// -*- Mode: JavaScript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   cyclic-counter.js
//
//   Description
//
//   Started:           Sat Jun 24 23:17:15 2023
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

function Counter() {
    throw new Error("Cannot instantiate Counter.");
}

Counter.prototype.constructor = Counter;
Object.defineProperty(Counter.prototype, "constructor", {enumerable: false, configurable: false});

// Counter.prototype.toString = () => `[${this.index()}/${this.modulus()}]`;
//'[undefined/undefined]'    ?!?!??!?!
Counter.prototype.toString = function() {
    return `[${this.index()}/${this.modulus()}]`;
};

Counter.prototype.index = function() {
    throw new Error("Counter does not implement index().");
};

Counter.prototype.modulus = function() {
    throw new Error("Counter does not implement modulus().");
};

Counter.prototype.advance = function() {
    throw new Error("Counter does not implement advance().");
};

Counter.prototype.set = function() {
    throw new Error("Counter does not implement set().");
};

Counter.prototype.reset = function() {
    return this.set(0);
};

function CyclicCounter(n) {
    if ( n < 1 ) {
        throw new Error("Modulus must be at least 1.");
    } else {
        this.clicks = 0;
        this.limit = n;
    }
}

CyclicCounter.prototype = Object.create(Counter.prototype);
CyclicCounter.prototype.constructor = CyclicCounter;
Object.defineProperty(CyclicCounter.prototype, "constructor", {enumerable: false, configurable: false});

CyclicCounter.prototype.index = function() {
    return this.clicks ;
};

CyclicCounter.prototype.modulus = function() {
    return this.limit ;
};

CyclicCounter.prototype.advance = function(n = 1) {
    return this.clicks = mod(this.clicks + n, this.limit);
};

CyclicCounter.prototype.set = function(n) {
    return this.clicks = mod(n, this.limit);
};

function PersistentCyclicCounter(modulus, index = 0) {
    if ( modulus < 1 ) {
        throw new Error("Modulus must be at least 1.");
    } else {
        this.clicks = mod(index, modulus);
        this.limit = modulus;
    }
}

PersistentCyclicCounter.prototype = Object.create(Counter.prototype);
PersistentCyclicCounter.prototype.constructor = PersistentCyclicCounter;
Object.defineProperty(PersistentCyclicCounter.prototype, "constructor", {enumerable: false, configurable: false});

PersistentCyclicCounter.prototype.index = function() {
    return this.clicks ;
};

PersistentCyclicCounter.prototype.modulus = function() {
    return this.limit ;
};

PersistentCyclicCounter.prototype.advance = function(n = 1) {
    return new PersistentCyclicCounter(this.limit, this.clicks + n);
};

PersistentCyclicCounter.prototype.set = function(n) {
    return new PersistentCyclicCounter(this.limit, n);
};
