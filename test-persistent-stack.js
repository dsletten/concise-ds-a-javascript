/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-persistent-stack.js
//
//   Description
//
//   Started:           Sun Jul 10 18:48:52 2022
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

function testPersistentStackConstructor(stackConstructor) {
    let s = stackConstructor();

    assert(s.isEmpty(), "New Stack should be empty.");
    assert(s.size() === 0, "New Stack size should be 0.");

    let thrown = assertRaises(Error, () => s.peek(), "Can't call peek() on empty stack.");
    console.log("Got expected error: " + thrown);

    // try {
    //     s.peek();
    //     throw new Error("Can't call peek() on empty stack.");
    // } catch (e) {
    //     switch (e.message) {
    //         case "Stack is empty.":
    //             console.log("Got expected error: " + e);
    //             break;
    //         default: throw e;
    //     }
    // }

    thrown = assertRaises(Error, () => s.pop(), "Can't call pop() on empty stack.");
    console.log("Got expected error: " + thrown);

    // try {
    //     s.pop();
    //     throw new Error("Can't call pop() on empty stack.");
    // } catch (e) {
    //     switch (e.message) {
    //         case "Stack is empty.":
    //             console.log("Got expected error: " + e);
    //             break;
    //         default: throw e;
    //     }
    // }

    return true;
}

function testPersistentStackIsEmpty(stackConstructor) {
    let s = stackConstructor();

    assert(s.isEmpty(), "New stack should be empty.");
    
    s = s.push(-1);
    assert(!s.isEmpty(), "Stack with elt should not be empty.");

    s = s.pop()
    assert(s.isEmpty(), "Empty stack should be empty.");

    return true;
}
    
function testPersistentStackSize(stackConstructor, count = 1000) {
    let s = stackConstructor();

    assert(s.size() === 0, "Size of new stack should be 0.");

    for (let i = 1; i <= count; i++) {
        s = s.push(i);
        assertStackSize(s, i);
    }

    for (let i = count-1; i >= 0; i--) {
        s = s.pop();
        assertStackSize(s, i);
    }

    assert(s.isEmpty(), "Stack should be empty.");

    return true;
}

//    See test-stack.js
// function assertStackSize(s, n) {
//     assert(s.size() === n, `Size of stack should be ${n}`);
// }

function testPersistentStackClear(stackConstructor, count = 1000) {
    let s = stackConstructor().fill({count: count});

    assert(!s.isEmpty(), `Stack should have ${count} elements.`);

    s = s.clear()
    assert(s.isEmpty(), "Stack should be empty.");
    assertStackSize(s, 0);

    return true;
}

function testPersistentStackPush(stackConstructor, count = 1000) {
    let s = stackConstructor();

    for (let i = 1; i <= count; i++) {
        s = s.push(i);
        assert(s.peek() === i, `Wrong value pushed: ${s.peek()} should be: ${i}`);
    }

    return true;
}


function testPersistentStackPeekPop(stackConstructor, count = 1000) {
    function testRecursive(s, i) {
        if ( s.isEmpty() ) {
            return i === 0;
        } else if ( s.peek() === i ) {
            s = s.pop();
            return testRecursive(s, i-1);
        } else {
            throw new Error(`Wrong value on stack: ${s.peek()} should be: ${i}`);
        }
    }

    let s = stackConstructor().fill({count: count});
    return testRecursive(s, s.size());
}

function testPersistentStackTime(stackConstructor, count = 100000) {
    let start = performance.now();

    for (let i = 0; i < 10; i++) {
        let s = stackConstructor().fill({count: count});
        while ( !s.isEmpty() ) {
            s = s.pop();
        }
    }

    console.log(`Elapsed time: ${performance.now() - start}`);

    return true;
}

function persistentStackTestSuite(stackConstructor) {
    console.log(`Testing ${stackConstructor().constructor.name}`);

    let tests = [testPersistentStackConstructor,
                 testPersistentStackIsEmpty,
                 testPersistentStackSize,
                 testPersistentStackClear,
                 testPersistentStackPush,
                 testPersistentStackPeekPop,
                 testPersistentStackTime];

    assert(!tests.some(test => { console.log(test); return test(stackConstructor) === false; }));

    return true;
}

function testPersistentStackAll() {
    let constructors = [() => new PersistentStack(),
                        () => new PersistentListStack()];
    return constructors.every(constructor => persistentStackTestSuite(constructor));
}
