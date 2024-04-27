/// -*- Mode: JavaScript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-persistent-cyclic-counter.js
//
//   Description
//
//   Started:           Sun Apr  7 04:03:10 2024
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

function testMakePersistentCounter() {
    assert(0 === new PersistentCyclicCounter(8).index(), "New counter index should be zero.");

    {
        let n = 10;
        assert(n === new PersistentCyclicCounter(n).modulus(), `Modulus of counter should be ${n}.`);
        
    }

    let thrown = assertRaises(Error, () => new PersistentCyclicCounter(0), "Can't create counter with modulus of 0.");
    console.log("Got expected error: " + thrown);

    return true;
}

function testPersistentCounterAdvance() {
    assert(1 === new PersistentCyclicCounter(10).advance().index(), "Index should be 1 after advancing once.");

    {
        let n = 10;
        assert(0 === new PersistentCyclicCounter(10).advance(n).index(), `Index should be 0 after advancing ${n} times.`);
    }

    {
        let n = 10;
        assert(n - 2 === new PersistentCyclicCounter(10).advance(-2).index(), `Index should be ${n-2} after advancing -2 times.`);
    }

    return true;
}
        
function testPersistentCounterSet() {
    assert(0 === new PersistentCyclicCounter(10).advance().set(0).index(), "Index should be 0 after setting.");
    assert(0 === new PersistentCyclicCounter(10).advance(2).set(0).index(), "Index should be 0 after setting.");
    
    {
        let n = 10;
        assert(n - 4 === new PersistentCyclicCounter(n).set(-4).index(), `Index should be ${n-4} after setting.`);
    }
        
    {
        let n = 10;
        let m = 6;
        assert(mod(m, n) === new PersistentCyclicCounter(n).advance().set(m).index(), `Index should be ${mod(m, n)} after setting.`);
    }
        
    {
        let n = 10;
        let m = 16;
        assert(mod(m, n) === new PersistentCyclicCounter(n).set(m).index(), `Index should be ${mod(m, n)} after setting.`);
    }
        
    return true;
}

function testPersistentCounterReset() {
    assert(0 === new PersistentCyclicCounter(10).advance().reset().index(), "Index should be 0 after reset.");

    {
        let n = 10;
        assert(0 === new PersistentCyclicCounter(n).set(n - 1).reset().index(), "Index should be 0 after reset.");
    }

    return true;
}

function testPersistentCounterRollover() {
    let n = 10;
    let c = new PersistentCyclicCounter(n);

    for (let i = 0; i < n; i++) {
        c = c.advance();
    }
    
    assert(0 === c.index(), `Counter should roll over after advancing ${n} times.`);

    return true;
}

function persistentCyclicCounterTestSuite() {
    let tests = [testMakePersistentCounter,
                 testPersistentCounterAdvance,
                 testPersistentCounterSet,
                 testPersistentCounterReset,
                 testPersistentCounterRollover];

    return tests.every(test => { console.log(test); return test(); });
}
