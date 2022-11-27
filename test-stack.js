/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-stack.js
//
//   Description
//
//   Started:           Thu Jan 13 11:07:03 2022
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

function testStackConstructor(stackConstructor) {
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

function testStackIsEmpty(stackConstructor) {
    let s = stackConstructor();

    assert(s.isEmpty(), "New stack should be empty.");

    s.push(-1);
    
    assert(!s.isEmpty(), "Stack with elt should not be empty.");

    s.pop();
    
    assert(s.isEmpty(), "Empty stack should be empty.");

    return true;
}
    
function testStackSize(stackConstructor, count = 1000) {
    let s = stackConstructor();

    assert(s.size() === 0, "Size of new stack should be 0.");

    for (let i = 1; i <= count; i++) {
        s.push(i);
        assertStackSize(s, i);
    }

    for (let i = count-1; i >= 0; i--) {
        s.pop();
        assertStackSize(s, i);
    }

    assert(s.isEmpty(), "Stack should be empty.");
    
    return true;
}

function assertStackSize(s, n) {
    assert(s.size() === n, `Size of stack should be ${n}`);
}

function testStackClear(stackConstructor, count = 1000) {
    let s = stackConstructor().fill({count: count});

    assert(!s.isEmpty(), `Stack should have ${count} elements.`);

    s.clear();

    assert(s.isEmpty(), "Stack should be empty.");
    assertStackSize(s, 0);

    return true;
}

function testStackPush(stackConstructor, count = 1000) {
    let s = stackConstructor();

    for (let i = 1; i <= count; i++) {
        s.push(i);
        assert(s.peek() === i, `Wrong value pushed: ${s.peek()} should be: ${i}`);
    }

    return true;
}

function testStackPeekPop(stackConstructor, count = 1000) {
    function testRecursive(s, n) {
        if ( s.isEmpty() ) {
            return n === 0;
        } else {
            let top = s.peek();
            let popped = s.pop();

            if ( top === popped ) {
                return testRecursive(s, n-1);
            } else {
                throw new Error(`Wrong value popped: ${popped} should be: ${top}`);
            }
        }
    }

    let s = stackConstructor().fill({count: count});
    return testRecursive(s, s.size());
}

function testStackTime(stackConstructor, count = 100000) {
    let s = stackConstructor();
//    let start = Date.now();
    let start = performance.now();

    for (let i = 0; i < 10; i++) {
//         for (let j = 0; j < 100000; j++) {
//             s.push(j);
//         }
        s.fill({count: count});
        //        s.clear();
        emptyStack(s);
    }

//    let end = Date.now();

    console.log(`Elapsed time: ${performance.now() - start}`);
//    console.log("Elapsed time: " + (end - start));

    return true;
}

function emptyStack(s, count = s.size()) {
    for (let i = 0; i < count; i++) {
        s.pop();
    }
}

function testStackWave(stackConstructor) {
    let s = stackConstructor();

    s.fill({count: 5000});
    assertStackSize(s, 5000);

    emptyStack(s, 3000);
    assertStackSize(s, 2000);

    s.fill({count: 5000});
    assertStackSize(s, 7000);

    emptyStack(s, 3000);
    assertStackSize(s, 4000);

    s.fill({count: 5000});
    assertStackSize(s, 9000);

    emptyStack(s, 3000);
    assertStackSize(s, 6000);

    s.fill({count: 4000});
    assertStackSize(s, 10000);

    emptyStack(s, 10000);
    assert(s.isEmpty(), "Stack should be empty.");

    return true;
}

function stackTestSuite(stackConstructor) {
    console.log(`Testing ${stackConstructor().constructor.name}`);

    let tests = [testStackConstructor,
                 testStackIsEmpty,
                 testStackSize,
                 testStackClear,
                 testStackPush,
                 testStackPeekPop,
                 testStackTime,
                 testStackWave];

    assert(!tests.some(test => { console.log(test); return test(stackConstructor) === false; }));

    return true;
}

function testStackAll() {
    let constructors = [() => new LinkedStack(),
                        () => new LinkedListStack(),
                        () => new ArrayStack(),
                        () => new HashStack(),
                        () => new MapStack()];
    return constructors.every(constructor => stackTestSuite(constructor));
}
