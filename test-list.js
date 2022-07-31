/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-list.js
//
//   Description
//
//   Started:           Sat Jan 22 22:26:47 2022
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
//   Notes: testListTime()
//
//////////////////////////////////////////////////////////////////////////////
"use strict";

function testListConstructor(listConstructor) {
    let list = listConstructor();

    if ( !list.isEmpty() ) {
        throw new Error("New list should be empty.");
    } else if ( list.size() !== 0 ) {
        throw new Error("Size of new list should be zero.");
    } else if ( list.get(0) !== null ) {
        throw new Error("Accessing element of empty list returns 'null'");
    } else {
        try {
            list.delete(0);
            throw new Error("Can't call delete() on empty list.");
        } catch (e) {
            switch (e.message) {
                case "List is empty.":
                    console.log("Got expected error: " + e);
                    break;
                default: throw e;
            }
        }
    }

    return true;
}

function testListIsEmpty(listConstructor) {
    let list = listConstructor();

    if ( !list.isEmpty() ) {
        throw new Error("New list should be empty.");
    }

    list.add(true);

    if ( list.isEmpty() ) {
        throw new Error("List with elt should not be empty.");
    }

    list.delete(0);
    
    if ( !list.isEmpty() ) {
        throw new Error("Empty list should be empty.");
    }

    return true;
}

function testListSize(listConstructor, count = 1000) {
    let list = listConstructor();

    if ( list.size() !== 0 ) {
        throw new Error("Size of new list should be zero.");
    }

    for (let i = 1; i <= count; i++) {
        list.add(i);

        if ( list.size() !== i ) {
            throw new Error("Size of list should be " + i);
        }
    }

    for (let i = count; i >= 1; i--) {
        if ( list.size() !== i ) {
            throw new Error("Size of list should be " + i);
        }

        list.delete(0);
    }

    if ( list.size() !== 0 ) {
        throw new Error("Size of empty list should be zero.");
    }

    return true;
}

function testListClear(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);

    if ( list.isEmpty() ) {
        throw new Error(`List should have ${count} elements.`);
    }

    list.clear();

    if ( !list.isEmpty() ) {
        throw new Error("List should be empty.");
    }

    return true;
}

function testListContains(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    
    for (let i = 1; i <= count; i++) {
        assert(list.contains(i), `The list should contain the value ${i}`);
    }

    return true;
}

function testListContainsPredicate(listConstructor) {
    let list = listConstructor();
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));
    list.add(...lowers);

    if ( !lowers.every(ch => list.contains(ch)) ) {
        throw new Error("Should be matchy matchy.");
    }

    if ( uppers.some(ch => list.contains(ch)) ) {
        throw new Error("Default test should fail.");
    }

    if ( !uppers.every(ch => list.contains(ch, (c1, c2) => c1 === c2.toUpperCase())) ) {
        throw new Error("Specific test should succeed.");
    }
    
    return true;
}

function testListContainsArithmetic(listConstructor) {
    let list = listConstructor().fill(20);

    if ( list.contains(3) !== 3 ) {
        throw new Error("Literal 3 should be present in list.");
    }

    if ( list.contains(3, (item, elt) => elt === item + 1) !== 4 ) {
        throw new Error("List contains the element one larger than 3.");
    }

    if ( list.contains(2, (item, elt) => elt > item * 2) !== 5 ) {
        throw new Error("First element in list larger than 2 doubled is 5.");
    }

    return true;
}

function testListEquals(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    let arrayList = new ArrayList().fill(count);
    let doublyLinkedList = new DoublyLinkedList().fill(count);

    if ( !list.equals(arrayList) ) {
        throw new Error("Lists with same content should be equal.");
    }

    if ( !arrayList.equals(list) ) {
        throw new Error("Equality should be commutative.");
    }
    
    if ( !list.equals(doublyLinkedList) ) {
        throw new Error("Lists with same content should be equal.");
    }

    if ( !doublyLinkedList.equals(list) ) {
        throw new Error("Equality should be commutative.");
    }
    
    return true;
}

function testListEqualsPredicate(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));

    let list = listConstructor().add(...lowers);
    let arrayList = new ArrayList().add(...uppers);
    let doublyLinkedList = new DoublyLinkedList().add(...uppers);

    if ( list.equals(arrayList) ) {
        throw new Error("Default test should fail.");
    }

    if ( list.equals(doublyLinkedList) ) {
        throw new Error("Default test should fail.");
    }

    if ( !list.equals(arrayList, (c1, c2) => c1.toUpperCase() === c2.toUpperCase()) ) {
        throw new Error("Specific test should succeed.");
    }
    
    if ( !list.equals(doublyLinkedList, (c1, c2) => c1.toUpperCase() === c2.toUpperCase()) ) {
        throw new Error("Specific test should succeed.");
    }
    
    return true;
}

function testListEach(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let list = listConstructor().add(...lowers);
    let result = "";
    list.each(ch => {result += ch;});
    let expected = lowers.join("");

    if ( result !== expected ) {
        throw new Error(`Writing each() char should produce ${expected}: ${result}`);
    }

    return true;
}

function testListAdd(listConstructor, count = 1000) {
    let list = listConstructor();

    for (let i = 1; i <= count; i++) {
        list.add(i);

        if ( list.size() !== i ) {
            throw new Error(`Size of list should be ${i} not ${list.size()}`);
        }

        if ( list.get(-1) !== i ) {
            throw new Error(`Last element of list should be ${i} not ${list.get(-1)}`);
        }
    }

    return true;
}

function testListInsert(listConstructor, fillElt = null) {
    let list = listConstructor(fillElt);
    let count = 6;

    list.insert(count-1, "foo");

    if ( list.size() !== count ) {
        throw new Error("Insert should extend list.");
    }

    if ( list.get(0) !== fillElt ) {
        console.log(list.get(0));
    console.log(fillElt);
        throw new Error(`Empty elements should be filled with ${fillElt}`);
    }

    list.insert(0, "bar");
    
    if ( list.size() !== count+1 ) {
        throw new Error("Insert should increase length.");
    }

    if ( list.get(0) !== "bar" ) {
        throw new Error("Inserted element should be 'bar'.");
    }

    return true;
}

function testListInsertFillZero(listConstructor) {
    return testListInsert(listConstructor, 0);
}

function testListInsertNegativeIndex(listConstructor) {
    let list = listConstructor();
    list.add(0);

    for (let i = 1; i <= 10; i++) {
        list.insert(-i, i);
    }

    let iterator = list.iterator();
    for (let i = 10; i >= 0; i--) {
        if ( i !== iterator.current() ) {
            throw new Error(`Inserted element should be: ${i} but found: ${iterator.current()}`);
        }
        iterator.next();
    }

    return true;
}

function testListInsertEnd(listConstructor) {
    let list = listConstructor();
    list.add(0, 1, 2);
    list.insert(3, 3);

    assert(list.get(3) === 3, "Element at index 3 should be 3");
    assert(list.size() === 4, `Size of list should be 4 not ${list.size()}.`);

    list.insert(5, 5);
    
    assert(list.get(5) === 5, "Element at index 5 should be 5");
    assert(list.size() === 6, `Size of list should be 6 not ${list.size()}.`);
    
    return true;
}
        
function testListDelete(listConstructor, count = 1000) {
    {
        let list = listConstructor().fill(count);

        for (let i = count; i >= 1; i--) {
            assert(list.size() === i, "List size should reflect deletions");
            list.delete(0);
        }

        assert(list.isEmpty(), "Empty list should be empty.");
    }

    {
        let list = listConstructor().fill(count);

        for (let i = count; i >= 1; i--) {
            let doomed = list.delete(i-1);
            assert(doomed === i, `Incorrect deleted value returned: ${doomed} rather than ${i}`);
        }

        assert(list.isEmpty(), "Empty list should be empty.");
    }

    return true;
}

function testListDeleteNegativeIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    
    for (let i = count; i >= 1; i--) {
        assert(list.delete(-1) === i, "Deleted element should be last in list");
    }
    
    assert(list.isEmpty(), "Empty list should be empty.");

    return true;
}

function testListGet(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    
    for (let i = 0; i < count; i++) {
        assert(list.get(i) === i + 1, `Element ${i} should be: ${i + 1}.`);
    }

    return true;
}

function testListGetNegativeIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    
    for (let i = -1; i >= -count; i--) {
        assert(list.get(i) === i+count+1, `Element ${i} should be: ${i+count+1} not ${list.get(i)}.`);
    }

    return true;
}

function testListSet(listConstructor, count = 1000) {
    let list = listConstructor();
    
    for (let i = 0; i <= count; i++) {
        assert(list.size() === i, `Prior to set() size should be ${i} not ${list.size()}`);
        list.set(i, i);
        assert(list.size() === i+1, `After set() size should be ${i+1} not ${list.size()}`);
    }

    for (let i = 0; i <= count; i++) {
        assert(list.get(i) === i, `Element ${i} should be: ${list.get(i)}.`);
    }

    return true;
}

function testListSetNegativeIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    
    for (let i = -1; i >= -count; i--) {
        list.set(i, i);
    }

    for (let i = 0; i < count; i++) {
        assert(list.get(i) === i-count, `Element ${i} should have value ${i-count} not ${list.get(i)}.`);
    }

    return true;
}

function testListSetOutOfBounds(listConstructor) {
    let list = listConstructor();
    let index = 10;
    list.set(index, "foo");

    assert(list.size() === index + 1, "List should expand to accommodate out-of-bounds index.");

    return true;
}

function testListIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    
    for (let i = 1; i <= count; i++) {
        assert(list.index(i) === i-1, `The value ${i-1} should be located at index ${i}`);
    }

    return true;
}

function testListIndexPredicate(listConstructor) {
    let list = listConstructor();
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));
    list.add(...lowers);

    assert(!uppers.some(ch => list.index(ch)), "Default test should fail.");
    assert(uppers.every(ch => list.index(ch, (c1, c2) => c1 === c2.toUpperCase()) !== null),
           "Specific test should succeed.");
    
    return true;
}

function testListIndexArithmetic(listConstructor) {
    let list = listConstructor().fill(20);

    assert(list.index(3) === 2, "Literal 3 should be at index 2.");
    assert(list.index(3, (item, elt) => mod(elt, item) === 0) === 2,
           "First multiple of 3 should be at index 2.");

    return true;
}

function testListSlice(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    let j = Math.floor(count/10);
    let n = Math.floor(count/2);
    let slice = list.slice(j, n);

    assert(slice.size() === n, `Slice should contain ${n} elements`);

    for (let i = 0; i < n; i++) {
        assert(slice.get(i) === i+j+1, `Element ${i} should have value ${i+j+1} not ${slice.get(i)}`);
    }

    return true;
}

function testListSliceNegativeIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    let j = Math.floor(count/2);
    let n = Math.floor(count/2);
    let slice = list.slice(-j);

    assert(slice.size() === n, `Slice should contain ${n} elements`);

    for (let i = 0; i < n; i++) {
        assert(slice.get(i) === i+j+1, `Element ${i} should have value ${i+j+1} not ${slice.get(i)}`);
    }

    return true;
}

function testListSliceCornerCases(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);

    {
        let slice = list.slice(list.size(), 10);
        assert(slice.isEmpty(), "Slice at end of list should be empty");
    }
    
    {
        let slice = list.slice(-10, 10);
        assert(slice.size() === 10, `Slice of last 10 elements should have 10 elements: ${slice.size()}`);
    }

    {
        let slice = list.slice(-1001, 10);
        assert(slice.isEmpty(), "Slice with invalid negative index should be empty");
    }

    return true;
}


function testListTime(listConstructor) {
    let list = listConstructor();
    console.log(list.constructor.name);

    let start = performance.now();
    for (let i = 0; i < 10; i++) {
        list.fill(10000);
        while ( !list.isEmpty() ) {
            list.delete(0);
        }
    }
    console.log(`Elapsed time: ${performance.now() - start}`);

    start = performance.now();
    for (let i = 0; i < 10; i++) {
        list.fill(10000);
        while ( !list.isEmpty() ) {
            list.delete(-1);
        }
    }
    console.log(`Elapsed time: ${performance.now() - start}`);

    return true;
}

function testArrayList() {
    return testListConstructor(() => new ArrayList()) &&
        testListIsEmpty(() => new ArrayList()) &&
        testListSize(() => new ArrayList()) &&
        testListClear(() => new ArrayList()) &&
        testListContains(() => new ArrayList()) &&
        testListContainsPredicate(() => new ArrayList()) &&
        testListContainsArithmetic(() => new ArrayList()) &&
        testListEquals(() => new ArrayList()) &&
        testListEqualsPredicate(() => new ArrayList()) &&
        testListEach(() => new ArrayList()) &&
        testListAdd(() => new ArrayList()) &&
        testListInsert(fillElt => new ArrayList(fillElt)) &&
        testListInsertFillZero(fillElt => new ArrayList(fillElt)) &&
        testListInsertNegativeIndex(() => new ArrayList()) &&
        testListInsertEnd(() => new ArrayList()) &&
        testListDelete(() => new ArrayList()) &&
        testListDeleteNegativeIndex(() => new ArrayList()) &&
        testListGet(() => new ArrayList()) &&
        testListGetNegativeIndex(() => new ArrayList()) &&
        testListSet(() => new ArrayList()) &&
        testListSetNegativeIndex(() => new ArrayList()) &&
        testListSetOutOfBounds(() => new ArrayList()) &&
        testListIndex(() => new ArrayList()) &&
        testListIndexPredicate(() => new ArrayList()) &&
        testListIndexArithmetic(() => new ArrayList()) &&
        testListSlice(() => new ArrayList()) &&
        testListSliceNegativeIndex(() => new ArrayList()) &&
        testListSliceCornerCases(() => new ArrayList()) &&
        testListTime(() => new ArrayList());
}

function testSinglyLinkedList() {
    return testListConstructor(() => new SinglyLinkedList()) &&
        testListIsEmpty(() => new SinglyLinkedList()) &&
        testListSize(() => new SinglyLinkedList()) &&
        testListClear(() => new SinglyLinkedList()) &&
        testListContains(() => new SinglyLinkedList()) &&
        testListContainsPredicate(() => new SinglyLinkedList()) &&
        testListContainsArithmetic(() => new SinglyLinkedList()) &&
        testListEquals(() => new SinglyLinkedList()) &&
        testListEqualsPredicate(() => new SinglyLinkedList()) &&
        testListEach(() => new SinglyLinkedList()) &&
        testListAdd(() => new SinglyLinkedList()) &&
        testListInsert(fillElt => new SinglyLinkedList(fillElt)) &&
        testListInsertFillZero(fillElt => new SinglyLinkedList(fillElt)) &&
        testListInsertNegativeIndex(() => new SinglyLinkedList()) &&
        testListInsertEnd(() => new SinglyLinkedList()) &&
        testListDelete(() => new SinglyLinkedList()) &&
        testListDeleteNegativeIndex(() => new SinglyLinkedList()) &&
        testListGet(() => new SinglyLinkedList()) &&
        testListGetNegativeIndex(() => new SinglyLinkedList()) &&
        testListSet(() => new SinglyLinkedList()) &&
        testListSetNegativeIndex(() => new SinglyLinkedList()) &&
        testListSetOutOfBounds(() => new SinglyLinkedList()) &&
        testListIndex(() => new SinglyLinkedList()) &&
        testListIndexPredicate(() => new SinglyLinkedList()) &&
        testListIndexArithmetic(() => new SinglyLinkedList()) &&
        testListSlice(() => new SinglyLinkedList()) &&
        testListSliceNegativeIndex(() => new SinglyLinkedList()) &&
        testListSliceCornerCases(() => new SinglyLinkedList()) &&
        testListTime(() => new SinglyLinkedList());
}

function testDoublyLinkedList() {
    return testListConstructor(() => new DoublyLinkedList()) &&
        testListIsEmpty(() => new DoublyLinkedList()) &&
        testListSize(() => new DoublyLinkedList()) &&
        testListClear(() => new DoublyLinkedList()) &&
        testListContains(() => new DoublyLinkedList()) &&
        testListContainsPredicate(() => new DoublyLinkedList()) &&
        testListContainsArithmetic(() => new DoublyLinkedList()) &&
        testListEquals(() => new DoublyLinkedList()) &&
        testListEqualsPredicate(() => new DoublyLinkedList()) &&
        testListEach(() => new DoublyLinkedList()) &&
        testListAdd(() => new DoublyLinkedList()) &&
        testListInsert(fillElt => new DoublyLinkedList(fillElt)) &&
        testListInsertFillZero(fillElt => new DoublyLinkedList(fillElt)) &&
        testListInsertNegativeIndex(() => new DoublyLinkedList()) &&
        testListInsertEnd(() => new DoublyLinkedList()) &&
        testListDelete(() => new DoublyLinkedList()) &&
        testListDeleteNegativeIndex(() => new DoublyLinkedList()) &&
        testListGet(() => new DoublyLinkedList()) &&
        testListGetNegativeIndex(() => new DoublyLinkedList()) &&
        testListSet(() => new DoublyLinkedList()) &&
        testListSetNegativeIndex(() => new DoublyLinkedList()) &&
        testListSetOutOfBounds(() => new DoublyLinkedList()) &&
        testListIndex(() => new DoublyLinkedList()) &&
        testListIndexPredicate(() => new DoublyLinkedList()) &&
        testListIndexArithmetic(() => new DoublyLinkedList()) &&
        testListSlice(() => new DoublyLinkedList()) &&
        testListSliceNegativeIndex(() => new DoublyLinkedList()) &&
        testListSliceCornerCases(() => new DoublyLinkedList()) &&
        testListTime(() => new DoublyLinkedList());
}

function testDoublyLinkedListRatchet() {
    return testListConstructor(() => new DoublyLinkedListRatchet()) &&
        testListIsEmpty(() => new DoublyLinkedListRatchet()) &&
        testListSize(() => new DoublyLinkedListRatchet()) &&
        testListClear(() => new DoublyLinkedListRatchet()) &&
        testListContains(() => new DoublyLinkedListRatchet()) &&
        testListContainsPredicate(() => new DoublyLinkedListRatchet()) &&
        testListContainsArithmetic(() => new DoublyLinkedListRatchet()) &&
        testListEquals(() => new DoublyLinkedListRatchet()) &&
        testListEqualsPredicate(() => new DoublyLinkedListRatchet()) &&
        testListEach(() => new DoublyLinkedListRatchet()) &&
        testListAdd(() => new DoublyLinkedListRatchet()) &&
        testListInsert(fillElt => new DoublyLinkedListRatchet(fillElt)) &&
        testListInsertFillZero(fillElt => new DoublyLinkedListRatchet(fillElt)) &&
        testListInsertNegativeIndex(() => new DoublyLinkedListRatchet()) &&
        testListInsertEnd(() => new DoublyLinkedListRatchet()) &&
        testListDelete(() => new DoublyLinkedListRatchet()) &&
        testListDeleteNegativeIndex(() => new DoublyLinkedListRatchet()) &&
        testListGet(() => new DoublyLinkedListRatchet()) &&
        testListGetNegativeIndex(() => new DoublyLinkedListRatchet()) &&
        testListSet(() => new DoublyLinkedListRatchet()) &&
        testListSetNegativeIndex(() => new DoublyLinkedListRatchet()) &&
        testListSetOutOfBounds(() => new DoublyLinkedListRatchet()) &&
        testListIndex(() => new DoublyLinkedListRatchet()) &&
        testListIndexPredicate(() => new DoublyLinkedListRatchet()) &&
        testListIndexArithmetic(() => new DoublyLinkedListRatchet()) &&
        testListSlice(() => new DoublyLinkedListRatchet()) &&
        testListSliceNegativeIndex(() => new DoublyLinkedListRatchet()) &&
        testListSliceCornerCases(() => new DoublyLinkedListRatchet()) &&
        testListTime(() => new DoublyLinkedListRatchet());
}

function testDoublyLinkedListMap() {
    return testListConstructor(() => new DoublyLinkedListMap()) &&
        testListIsEmpty(() => new DoublyLinkedListMap()) &&
        testListSize(() => new DoublyLinkedListMap()) &&
        testListClear(() => new DoublyLinkedListMap()) &&
        testListContains(() => new DoublyLinkedListMap()) &&
        testListContainsPredicate(() => new DoublyLinkedListMap()) &&
        testListContainsArithmetic(() => new DoublyLinkedListMap()) &&
        testListEquals(() => new DoublyLinkedListMap()) &&
        testListEqualsPredicate(() => new DoublyLinkedListMap()) &&
        testListEach(() => new DoublyLinkedListMap()) &&
        testListAdd(() => new DoublyLinkedListMap()) &&
        testListInsert(fillElt => new DoublyLinkedListMap(fillElt)) &&
        testListInsertFillZero(fillElt => new DoublyLinkedListMap(fillElt)) &&
        testListInsertNegativeIndex(() => new DoublyLinkedListMap()) &&
        testListInsertEnd(() => new DoublyLinkedListMap()) &&
        testListDelete(() => new DoublyLinkedListMap()) &&
        testListDeleteNegativeIndex(() => new DoublyLinkedListMap()) &&
        testListGet(() => new DoublyLinkedListMap()) &&
        testListGetNegativeIndex(() => new DoublyLinkedListMap()) &&
        testListSet(() => new DoublyLinkedListMap()) &&
        testListSetNegativeIndex(() => new DoublyLinkedListMap()) &&
        testListSetOutOfBounds(() => new DoublyLinkedListMap()) &&
        testListIndex(() => new DoublyLinkedListMap()) &&
        testListIndexPredicate(() => new DoublyLinkedListMap()) &&
        testListIndexArithmetic(() => new DoublyLinkedListMap()) &&
        testListSlice(() => new DoublyLinkedListMap()) &&
        testListSliceNegativeIndex(() => new DoublyLinkedListMap()) &&
        testListSliceCornerCases(() => new DoublyLinkedListMap()) &&
        testListTime(() => new DoublyLinkedListMap());
}

function testHashTableList() {
    return testListConstructor(() => new HashTableList()) &&
        testListIsEmpty(() => new HashTableList()) &&
        testListSize(() => new HashTableList()) &&
        testListClear(() => new HashTableList()) &&
        testListContains(() => new HashTableList()) &&
        testListContainsPredicate(() => new HashTableList()) &&
        testListContainsArithmetic(() => new HashTableList()) &&
        testListEquals(() => new HashTableList()) &&
        testListEqualsPredicate(() => new HashTableList()) &&
        testListEach(() => new HashTableList()) &&
        testListAdd(() => new HashTableList()) &&
        testListInsert(fillElt => new HashTableList(fillElt)) &&
        testListInsertFillZero(fillElt => new HashTableList(fillElt)) &&
        testListInsertNegativeIndex(() => new HashTableList()) &&
        testListInsertEnd(() => new HashTableList()) &&
        testListDelete(() => new HashTableList()) &&
        testListDeleteNegativeIndex(() => new HashTableList()) &&
        testListGet(() => new HashTableList()) &&
        testListGetNegativeIndex(() => new HashTableList()) &&
        testListSet(() => new HashTableList()) &&
        testListSetNegativeIndex(() => new HashTableList()) &&
        testListSetOutOfBounds(() => new HashTableList()) &&
        testListIndex(() => new HashTableList()) &&
        testListIndexPredicate(() => new HashTableList()) &&
        testListIndexArithmetic(() => new HashTableList()) &&
        testListSlice(() => new HashTableList()) &&
        testListSliceNegativeIndex(() => new HashTableList()) &&
        testListSliceCornerCases(() => new HashTableList()) &&
        testListTime(() => new HashTableList());
}

function testListAll() {
    return testArrayList() &&
        testSinglyLinkedList() &&
        testDoublyLinkedList() &&
        testDoublyLinkedListRatchet() &&
        testDoublyLinkedListMap() &&
        testHashTableList();
}

// var al = new ArrayList()
// var al = new ArrayList()
// [Function]
// > al.add('a', 'b', 'c')
// al.add('a', 'b', 'c')
// undefined
// > var sll = new SinglyLinkedList()
// var sll = new SinglyLinkedList()
// undefined
// > sll.add('A', 'B', 'C')
// sll.add('A', 'B', 'C')
// undefined
// > al.equals(sll)
// al.equals(sll)
// false
// > sll.equals(al)
// sll.equals(al)
// false
// > al.equals(sll, (x, y) => x.toLowerCase() === y.toLowerCase())
// al.equals(sll, (x, y) => x.toLowerCase() === y.toLowerCase())
// true
// > sll.equals(al, (x, y) => x.toLowerCase() === y.toLowerCase())
// sll.equals(al, (x, y) => x.toLowerCase() === y.toLowerCase())
// true
//     >

// var al = new ArrayList()
// al.add(1, 2, 3, 4, 5)
// al.index(3)
// 2
// al.index(3, (item, elt) => elt % item === 0)
// 2

// var sll = new SinglyLinkedList()
// sll.add(1, 2, 3, 4, 5)
// sll.index(3)
// 2
// sll.index(3, (item, elt) => elt % item === 0)
// 2

// var dll = new DoublyLinkedList()
// dll.add(1, 2, 3, 4, 5)
// dll.index(3)
// 2
// dll.index(3, (item, elt) => elt % item === 0)
// 2

// var sll = new SinglyLinkedList()
// sll.add(1, 2, 3, 4, 5)
// var dll = new DoublyLinkedList()
// dll.add(-1, -2, -3, -4, -5)

// sll.equals(dll)
// false

// sll.equals(dll, (x, y) => x + y === 0)
// true

// var sll = new SinglyLinkedList()
// sll.add(1, 2, 3, 4, 5)
// sll.contains(3)
// 3

// sll.contains(3, (item, elt) => elt === item + 1)
// 4

// sll.contains(2, (item, elt) => elt > item * 2)
// 5
