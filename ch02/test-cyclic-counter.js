/// -*- Mode: JavaScript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-cyclic-counter.js
//
//   Description
//
//   Started:           Sat Apr  6 21:57:34 2024
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

function testMakeCounter() {
    assert(0 === new CyclicCounter(8).index(), "New counter index should be zero.");

    {
        let n = 10;
        assert(n === new CyclicCounter(n).modulus(), `Modulus of counter should be ${n}.`);
        
    }

    let thrown = assertRaises(Error, () => new CyclicCounter(0), "Can't create counter with modulus of 0.");
    console.log("Got expected error: " + thrown);

    return true;
}

function testAdvance() {
    {
        let c = new CyclicCounter(10);
        c.advance();
        assert(1 === c.index(), "Index should be 1 after advancing once.");
    }

    {
        let n = 10;
        let c = new CyclicCounter(n);
        c.advance(n);
        assert(0 === c.index(), `Index should be 0 after advancing ${n} times.`);
    }

    {
        let n = 10;
        let c = new CyclicCounter(n);
        c.advance(-2);
        assert(n - 2 === c.index(), `Index should be ${n-2} after advancing -2 times.`);
    }

    return true;
}
        
function testSet() {
    {
        let c = new CyclicCounter(10);
        c.advance();
        c.set(0);
        assert(0 === c.index(), "Index should be 0 after setting.");
    }

    {
        let c = new CyclicCounter(10);
        c.advance(2);
        c.set(0);
        assert(0 === c.index(), "Index should be 0 after setting.");
    }
    
    {
        let n = 10;
        let c = new CyclicCounter(n);
        c.set(-4);
        assert(n - 4 === c.index(), `Index should be ${n-4} after setting.`);
    }
        
    {
        let n = 10;
        let m = 6;
        let c = new CyclicCounter(n);
        c.advance();
        c.set(m);
        assert(mod(m, n) === c.index(), `Index should be ${mod(m, n)} after setting.`);
    }
        
    {
        let n = 10;
        let m = 16;
        let c = new CyclicCounter(n);
        c.set(m);
        assert(mod(m, n) === c.index(), `Index should be ${mod(m, n)} after setting.`);
    }
        
    return true;
}

function testReset() {
    {
        let c = new CyclicCounter(10);
        c.advance();
        c.reset();
        assert(0 === c.index(), "Index should be 0 after reset.");
    }

    {
        let n = 10;
        let c = new CyclicCounter(n);
        c.set(n - 1);
        c.reset();
        assert(0 === c.index(), "Index should be 0 after reset.");
    }

    return true;
}

function testRollover() {
    let n = 10;
    let c = new CyclicCounter(n);

    for (let i = 0; i < n; i++) {
        c.advance();
    }
    
    assert(0 === c.index(), `Counter should roll over after advancing ${n} times.`);

    return true;
}

function counterTestSuite() {
    let tests = [testMakeCounter,
                 testAdvance,
                 testSet,
                 testReset,
                 testRollover];

    return tests.every(test => { console.log(test); return test(); });
}
