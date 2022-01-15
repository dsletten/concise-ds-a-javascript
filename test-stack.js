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
    var s = new stackConstructor();

    if ( !s.isEmpty() ) {
        throw new Error("New Stack should be empty.");
    }

    if ( s.size() !== 0 ) {
        throw new Error("New Stack size should be 0.");
    }

    try {
        s.peek();
        throw new Error("Can't call peek() on empty stack.");
    } catch (e) {
        console.log("New Stack should be empty: " + e.toString());
    }

    try {
        s.pop();
        throw new Error("Can't call pop() on empty stack.");
    } catch (e) {
        console.log("New Stack should be empty: " + e.toString());
    }
}

function testStackIsEmpty(stackConstructor) {
    var s = new stackConstructor();

    if ( !s.isEmpty() ) {
        throw new Error("New stack should be empty.");
    }

    s.push(-1);
    
    if ( s.isEmpty() ) {
        throw new Error("Stack with elt should not be empty.");
    }

    s.pop();
    
    if ( !s.isEmpty() ) {
        throw new Error("Empty stack should be empty.");
    }
}
    
function testStackSize(stackConstructor) {
    var s = new stackConstructor();

    if ( s.size() !== 0 ) {
        throw new Error("Size of new stack should be 0.");
    }

    for (var i = 1; i <= 10000; i++) {
        s.push(i);
        assertStackSize(s, i);
    }
}

function assertStackSize(s, n) {
    if ( s.size() !== n ) {
        throw new Error("Size of stack should be " + n);
    }
}

function testStackMakeEmpty(stackConstructor) {
    var s = new stackConstructor();
    fillStack(s);

    if ( s.isEmpty() ) {
        throw new Error("Stack should be not be empty.");
    }

    s.clear();

    if ( !s.isEmpty() ) {
        throw new Error("Stack should be empty.");
    }

    if ( s.size() !== 0 ) {
        throw new Error("Size of stack should be 0.");
    }
}

function testStackPeek(stackConstructor) {
    function testRecursive(s, n) {
        if ( s.isEmpty() ) {
            return true;
        } else if ( s.peek() === n ) {
            s.pop();
            return testRecursive(s, n-1);
        } else {
            throw new Error("Wrong value on stack: " + s.peek() + " should be: " + n);
        }
    }

    var s = new stackConstructor();
    fillStack(s);
    testRecursive(s, s.size());
}

function testStackTime(stackConstructor) {
    var s = new stackConstructor();
    var start = Date.now();

    for (var i = 0; i < 10; i++) {
//         for (var j = 0; j < 100000; j++) {
//             s.push(j);
//         }
        fillStack(s, 1, 100000);
        s.clear();
    }

    var end = Date.now();

    console.log("Elapsed time: " + (end - start));
}

function fillStack(s, start, end) {
    start = start || 1;
    end = end || 10000;

    for (var i = start; i <= end; i++) {
        s.push(i);
    }
}

function emptyStack(s, count) {
    count = count || s.size();

    for (var i = 0; i < count; i++) {
        s.pop();
    }
}

function testStackWave(stackConstructor) {
    var s = new stackConstructor();

//     for (var i = 0; i < 5000; i++) {
//         s.push(i);
//     }

    fillStack(s, 1, 5000);
    console.log(s.size());

//     for (var i = 0; i < 3000; i++) {
//         s.pop(i);
//     }

    emptyStack(s, 3000);
    console.log(s.size());

//     for (var i = 0; i < 5000; i++) {
//         s.push(i);
//     }

    fillStack(s, 1, 5000);
    console.log(s.size());

//     for (var i = 0; i < 3000; i++) {
//         s.pop(i);
//     }

    emptyStack(s, 3000);
    console.log(s.size());

//     for (var i = 0; i < 5000; i++) {
//         s.push(i);
//     }

    fillStack(s, 1, 5000);
    console.log(s.size());

//     for (var i = 0; i < 3000; i++) {
//         s.pop(i);
//     }

    emptyStack(s, 3000);
    console.log(s.size());

//     for (var i = 0; i < 4000; i++) {
//         s.push(i);
//     }

    fillStack(s, 1, 4000);
    console.log(s.size());

//     for (var i = 0; i < 10000; i++) {
//         s.pop(i);
//     }

    emptyStack(s, 10000);
    console.log(s.size());
}

function runAllStackTests(stackConstructor) {
    console.log("Testing: " + stackConstructor);
    testStackConstructor(stackConstructor);
    testStackIsEmpty(stackConstructor);
    testStackSize(stackConstructor);
    testStackMakeEmpty(stackConstructor);
    testStackPeek(stackConstructor);
    testStackTime(stackConstructor);
    testStackWave(stackConstructor);
}

function testStackAll() {
    var constructors = [LinkedStack, ArrayStack, HashStack];
    constructors.forEach(function(constructor) { runAllStackTests(constructor); });
}
