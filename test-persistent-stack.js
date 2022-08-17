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

    try {
        s.peek();
        throw new Error("Can't call peek() on empty stack.");
    } catch (e) {
        switch (e.message) {
            case "Stack is empty.":
                console.log("Got expected error: " + e);
                break;
            default: throw e;
        }
    }

    try {
        s.pop();
        throw new Error("Can't call pop() on empty stack.");
    } catch (e) {
        switch (e.message) {
            case "Stack is empty.":
                console.log("Got expected error: " + e);
                break;
            default: throw e;
        }
    }

    return true;
}

function testPersistentStackIsEmpty(stackConstructor) {
    let s = stackConstructor();

    assert(s.isEmpty(), "New stack should be empty.");
    assert(!s.push(-1).isEmpty(), "Stack with elt should not be empty.");
    assert(s.push(-1).pop().isEmpty(), "Empty stack should be empty.");

    return true;
}
    
function testPersistentStackSize(stackConstructor, count = 1000) {
    let s = stackConstructor();

    assert(s.size() === 0, "Size of new stack should be 0.");

    for (let i = 1; i <= count; i++) {
        s = s.push(i);
        assertStackSize(s, i);
    }

    return true;
}

//    See test-stack.js
// function assertStackSize(s, n) {
//     assert(s.size() === n, `Size of stack should be ${n}`);
// }

function testPersistentStackClear(stackConstructor, count = 1000) {
    let s = stackConstructor().fill(count);

    assert(!s.isEmpty(), `Stack should have ${count} elements.`);
    assert(s.clear().isEmpty(), "Stack should be empty.");
    assertStackSize(s.clear(), 0);

    return true;
}

//
//     Can't test pop() and peek() independently??
//     
// function testPersistentStackPop(stackConstructor, count = 1000) {
//     function testRecursive(s, n) {
//         if ( s.isEmpty() ) {
//             return true;
//         } else if ( s.pop() === n ) {
//             return testRecursive(s, n-1);
//         } else {
//             throw new Error("Wrong value on stack: " + s.peek() + " should be: " + n);
//         }
//     }

//     let s = stackConstructor().fill(count);
//     testRecursive(s, s.size());

//     return true;
// }

function testPersistentStackPeek(stackConstructor, count = 1000) {
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

    let s = stackConstructor().fill(count);
    return testRecursive(s, s.size());
}

function testPersistentStackTime(stackConstructor, count = 100000) {
    let s = stackConstructor();
    let start = performance.now();

    for (let i = 0; i < 10; i++) {
        let newStack = s.fill(count);
        while ( !newStack.isEmpty() ) {
            newStack = newStack.pop();
        }
    }

    console.log(`Elapsed time: ${performance.now() - start}`);

    return true;
}

function runAllPersistentStackTests(stackConstructor) {
    console.log("Testing: " + stackConstructor().constructor.name); // ??????
    return testPersistentStackConstructor(stackConstructor) &&
        testPersistentStackIsEmpty(stackConstructor) &&
        testPersistentStackSize(stackConstructor) &&
        testPersistentStackClear(stackConstructor) &&
        // testPersistentStackPop(stackConstructor) &&
        testPersistentStackPeek(stackConstructor) &&
        testPersistentStackTime(stackConstructor);
}

function testPersistentStackAll() {
    let constructors = [() => new PersistentStack(),
                        () => new PersistentListStack()];
    return constructors.every(constructor => runAllPersistentStackTests(constructor));
}
