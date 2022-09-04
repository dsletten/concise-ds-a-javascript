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

    assert(list.isEmpty(), "New list should be empty.");
    assert(list.size() === 0, "Size of new list should be zero.");
    assert(list.get(0) === null, "Accessing element of empty list returns 'null'");

        // try {
        //     list.delete(0);
        //     throw new Error("Can't call delete() on empty list.");
        // } catch (e) {
        //     switch (e.message) {
        //         case "List is empty.":
        //             console.log("Got expected error: " + e);
        //             break;
        //         default: throw e;
        //     }
        // }

    let thrown = assertRaises(Error, () => list.delete(0), "Can't call delete() on empty list.");
    console.log("Got expected error: " + thrown);

    return true;
}

function testListIsEmpty(listConstructor) {
    let list = listConstructor();

    assert(list.isEmpty(), "New list should be empty.");

    list.add(true);
    assert(!list.isEmpty(), "List with elt should not be empty.");

    list.delete(0);
    assert(list.isEmpty(), "Empty list should be empty.");

    return true;
}

function testListSize(listConstructor, count = 1000) {
    let list = listConstructor();

    assert(list.size() === 0, "Size of new list should be zero.");

    for (let i = 1; i <= count; i++) {
        list.add(i);

        assertListSize(list, i);
    }

    for (let i = count; i >= 1; i--) {
        assertListSize(list, i);

        list.delete(0);
    }

    assert(list.size() === 0, "Size of empty list should be zero.");

    return true;
}

function assertListSize(l, n) {
    assert(l.size() === n, `Size of list should be ${n}`);
}

function testListClear(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);

    assert(!list.isEmpty(), `List should have ${count} elements.`);

    list.clear();
    assert(list.isEmpty(), "List should be empty.");
    assert(list.size() === 0, "Size of empty list should be zero.");

    return true;
}

function testListContains(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    
    for (let i = 1; i <= count; i++) {
        assert(list.contains(i) === i, `The list should contain the value ${i}`);
    }

    return true;
}

function testListContainsPredicate(listConstructor) {
    let list = listConstructor();
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));
    list.add(...lowers);

    assert(lowers.every(ch => list.contains(ch)), "Should be matchy matchy.");
    assert(!uppers.some(ch => list.contains(ch)), "Default test should fail.");
    assert(uppers.every(ch => list.contains(ch, (c1, c2) => c1 === c2.toUpperCase())),
           "Specific test should succeed.");
    
    return true;
}

function testListContainsArithmetic(listConstructor) {
    let list = listConstructor().fill(20);

    assert(list.contains(3) === 3, "Literal 3 should be present in list.");
//    (assert (eql (contains list 3d0 :test #'=) 3) () "Float equal to 3 should be present in list.")
    assert(list.contains(3, (item, elt) => elt === item + 1) === 4,
           "List contains the element one larger than 3.");
    assert(list.contains(2, (item, elt) => elt > item * 2) === 5,
           "First element in list larger than 2 doubled is 5.");

    return true;
}

function testListEquals(listConstructor, count = 1000) {
    let list = listConstructor().fill(count);
    let arrayList = new ArrayList().fill(count);
    let doublyLinkedList = new DoublyLinkedList().fill(count);

    assert(list.equals(arrayList), "Lists with same content should be equal.");
    assert(arrayList.equals(list), "Equality should be commutative.");
    
    assert(list.equals(doublyLinkedList), "Lists with same content should be equal.");
    assert(doublyLinkedList.equals(list), "Equality should be commutative.");
    
    return true;
}

function testListEqualsPredicate(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));

    let list = listConstructor().add(...lowers);
    let arrayList = new ArrayList().add(...uppers);
    let doublyLinkedList = new DoublyLinkedList().add(...uppers);

    assert(!list.equals(arrayList), "Default test should fail.");
    assert(!list.equals(doublyLinkedList), "Default test should fail.");

    assert(list.equals(arrayList, (c1, c2) => c1.toUpperCase() === c2.toUpperCase()),
           "Specific test should succeed.");
    assert(list.equals(doublyLinkedList, (c1, c2) => c1.toUpperCase() === c2.toUpperCase()),
           "Specific test should succeed.");
    
    return true;
}

function testListEach(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let list = listConstructor().add(...lowers);
    let result = "";
    list.each(ch => {result += ch;});
    let expected = lowers.join("");

    assert(result === expected, `Writing each() char should produce ${expected}: ${result}`);

    return true;
}

function testListAdd(listConstructor, count = 1000) {
    let list = listConstructor();

    for (let i = 1; i <= count; i++) {
        list.add(i);

        assert(list.size() === i, `Size of list should be ${i} not ${list.size()}`);
        assert(list.get(-1) === i, `Last element of list should be ${i} not ${list.get(-1)}`);
    }

    return true;
}

function testListInsert(listConstructor, fillElt = null) {
    let list = listConstructor(fillElt);
    let count = 6;
    let elt = "bar";

    list.insert(count-1, "foo");

    assert(list.size() === count, "Insert should extend list.");
    assert(list.get(0) === fillElt, `Empty elements should be filled with ${fillElt}`);

    list.insert(0, elt);
    
    assert(list.size() === count+1, "Insert should increase length.");
    assert(list.get(0) === elt, `Inserted element should be '${elt}'.`);

    return true;
}

function testListInsertFillZero(listConstructor) {
    return testListInsert(listConstructor, 0);
}

function testListInsertNegativeIndex(listConstructor) {
    let list = listConstructor().add(0);

    for (let i = 1; i <= 10; i++) {
        list.insert(-i, i);
    }

    let iterator = list.iterator();
    for (let i = 10; i >= 0; i--) {
        assert(i === iterator.current(), `Inserted element should be: ${i} but found: ${iterator.current()}`);
        iterator.next();
    }

    return true;
}

function testListInsertEnd(listConstructor) {
    let list = listConstructor().add(0, 1, 2);
    let x = 3;
    let y = 10;

    list.insert(x, x);

    assert(list.get(x) === x, `Element at index ${x} should be ${x}`);
    assert(list.size() === x+1, `Size of list should be ${x+1} not ${list.size()}.`);

    list.insert(y, y);
    
    assert(list.get(y) === y, `Element at index ${y} should be ${y}`);
    assert(list.size() === y+1, `Size of list should be ${y+1} not ${list.size()}.`);
    
    return true;
}

function testListInsertOffset(listConstructor, count = 1000) {
    let lowIndex = 1;
    let highIndex = 3/4 * count;
    let elt = 88;
    
    {
        let list = listConstructor().fill(count);
        list.delete(0);
        assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
        
        list.insert(0, elt);
        assert(list.get(0) === elt, `First element should be ${elt} not ${list.get(0)}.`);
    }

    {
        let list = listConstructor().fill(count);
        list.delete(0);
        
        list.insert(lowIndex, elt);
        assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
        assert(list.get(lowIndex) === elt, `Element ${lowIndex} element should be ${elt} not ${list.get(lowIndex)}.`);
    }

    {
        let list = listConstructor().fill(count);
        list.delete(0);
        
        list.insert(highIndex, elt);
        assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
        assert(list.get(highIndex) === elt, `Element ${highIndex} should be ${elt} not ${list.get(highIndex)}.`);
    }

    return true;
}
        
function testListDelete(listConstructor, count = 1000) {
    {
        let list = listConstructor().fill(count);

        for (let i = count, j = 1; i >= 1; i--, j++) {
            let size = list.size();
            let doomed = list.delete(0);
            assert(size === i, "List size should reflect deletions");
            assert(doomed === j, `Incorrect deleted value returned: ${doomed} rather than ${j}`);
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

function testListDeleteOffset(listConstructor, count = 1000) {
    let lowIndex = 1;
    let highIndex = 3/4 * count;
    let list = listConstructor().fill(count);

    list.delete(0);
    assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);

    list.delete(lowIndex);
    assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
    assert(list.get(lowIndex) === lowIndex + 3, `Element ${lowIndex} should be ${lowIndex + 3} not ${list.get(lowIndex)}.`);

    list.delete(highIndex);
    assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
    assert(list.get(highIndex) === highIndex + 4, `Element ${highIndex} should be ${highIndex + 4} not ${list.get(highIndex)}.`);

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
    let elt = "foo";

    list.set(index, elt);

    assert(list.get(0) === list.fillElt, `Empty elements should be filled with ${list.fillElt}`);
    assert(list.size() === index + 1, "List should expand to accommodate out-of-bounds index.");
    assert(list.get(index) === elt, `Element ${index} should be: ${elt}.`);

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
        assert(slice.get(i) === list.get(i+j), `Element ${i} should have value ${list.get(i+j)} not ${slice.get(i)}`);
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
        assert(slice.get(i) === list.get(i+j), `Element ${i} should have value ${list.get(i+j)} not ${slice.get(i)}`);
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
        let slice = list.slice(-(count + 1), 10);
        assert(slice.isEmpty(), "Slice with invalid negative index should be empty");
    }

    return true;
}

function testListTime(listConstructor) {
    console.log();
    {
        let list = listConstructor();
        console.log(`Timing ${list.constructor.name}`);

        console.log("Add to front of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10000; j++) {
                list.insert(0, j);
            }
            list.clear();
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Add to end of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10000; j++) {
                list.add(j);
            }
            list.clear();
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Delete from front of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list.fill(10000);
            while ( !list.isEmpty() ) {
                list.delete(0);
            }
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Delete from end of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list.fill(10000);
            while ( !list.isEmpty() ) {
                list.delete(-1);
            }
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Insert at random index.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list.add(null);
            for (let j = 0; j < 10000; j++) {
                list.insert(Math.floor(Math.random() * list.size()), j);
            }
            list.clear();
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Delete from random index.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list.fill(10000);
            for (let j = 0; j < 10000; j++) {
                try {
                    var index = Math.floor(Math.random() * list.size());
                    list.delete(index);
                } catch (e) {
                    console.log(index);
                    console.log(`i: ${i} j: ${j} ${e}`);
                    return false;
                }
            }
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor().fill(10000);

        console.log("Sequential access of list elements.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < list.size(); j++) {
                assert(list.get(j) === j + 1, `Element ${j} should be: ${j + 1}.`);
            }
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor().fill(10000);

        console.log("Random access of list elements.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < list.size(); j++) {
                let index = Math.floor(Math.random() * list.size());
                assert(list.get(index) === index + 1, `Element ${index} should be: ${index + 1}.`);
            }
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    console.log();

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
        testListInsertOffset(() => new ArrayList()) &&
        testListDelete(() => new ArrayList()) &&
        testListDeleteOffset(() => new ArrayList()) &&
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
        testListInsertOffset(() => new SinglyLinkedList()) &&
        testListDelete(() => new SinglyLinkedList()) &&
        testListDeleteOffset(() => new SinglyLinkedList()) &&
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
        testListInsertOffset(() => new DoublyLinkedList()) &&
        testListDelete(() => new DoublyLinkedList()) &&
        testListDeleteOffset(() => new DoublyLinkedList()) &&
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
        testListInsertOffset(() => new DoublyLinkedListRatchet()) &&
        testListDelete(() => new DoublyLinkedListRatchet()) &&
        testListDeleteOffset(() => new DoublyLinkedListRatchet()) &&
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
        testListInsertOffset(() => new DoublyLinkedListMap()) &&
        testListDelete(() => new DoublyLinkedListMap()) &&
        testListDeleteOffset(() => new DoublyLinkedListMap()) &&
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
        testListInsertOffset(() => new HashTableList()) &&
        testListDelete(() => new HashTableList()) &&
        testListDeleteOffset(() => new HashTableList()) &&
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

function testHashTableListX() {
    return testListConstructor(() => new HashTableListX()) &&
        testListIsEmpty(() => new HashTableListX()) &&
        testListSize(() => new HashTableListX()) &&
        testListClear(() => new HashTableListX()) &&
        testListContains(() => new HashTableListX()) &&
        testListContainsPredicate(() => new HashTableListX()) &&
        testListContainsArithmetic(() => new HashTableListX()) &&
        testListEquals(() => new HashTableListX()) &&
        testListEqualsPredicate(() => new HashTableListX()) &&
        testListEach(() => new HashTableListX()) &&
        testListAdd(() => new HashTableListX()) &&
        testListInsert(fillElt => new HashTableListX(fillElt)) &&
        testListInsertFillZero(fillElt => new HashTableListX(fillElt)) &&
        testListInsertNegativeIndex(() => new HashTableListX()) &&
        testListInsertEnd(() => new HashTableListX()) &&
        testListInsertOffset(() => new HashTableListX()) &&
        testListDelete(() => new HashTableListX()) &&
        testListDeleteOffset(() => new HashTableListX()) &&
        testListDeleteNegativeIndex(() => new HashTableListX()) &&
        testListGet(() => new HashTableListX()) &&
        testListGetNegativeIndex(() => new HashTableListX()) &&
        testListSet(() => new HashTableListX()) &&
        testListSetNegativeIndex(() => new HashTableListX()) &&
        testListSetOutOfBounds(() => new HashTableListX()) &&
        testListIndex(() => new HashTableListX()) &&
        testListIndexPredicate(() => new HashTableListX()) &&
        testListIndexArithmetic(() => new HashTableListX()) &&
        testListSlice(() => new HashTableListX()) &&
        testListSliceNegativeIndex(() => new HashTableListX()) &&
        testListSliceCornerCases(() => new HashTableListX()) &&
        testListTime(() => new HashTableListX());
}

function testMapList() {
    return testListConstructor(() => new MapList()) &&
        testListIsEmpty(() => new MapList()) &&
        testListSize(() => new MapList()) &&
        testListClear(() => new MapList()) &&
        testListContains(() => new MapList()) &&
        testListContainsPredicate(() => new MapList()) &&
        testListContainsArithmetic(() => new MapList()) &&
        testListEquals(() => new MapList()) &&
        testListEqualsPredicate(() => new MapList()) &&
        testListEach(() => new MapList()) &&
        testListAdd(() => new MapList()) &&
        testListInsert(fillElt => new MapList(fillElt)) &&
        testListInsertFillZero(fillElt => new MapList(fillElt)) &&
        testListInsertNegativeIndex(() => new MapList()) &&
        testListInsertEnd(() => new MapList()) &&
        testListInsertOffset(() => new MapList()) &&
        testListDelete(() => new MapList()) &&
        testListDeleteOffset(() => new MapList()) &&
        testListDeleteNegativeIndex(() => new MapList()) &&
        testListGet(() => new MapList()) &&
        testListGetNegativeIndex(() => new MapList()) &&
        testListSet(() => new MapList()) &&
        testListSetNegativeIndex(() => new MapList()) &&
        testListSetOutOfBounds(() => new MapList()) &&
        testListIndex(() => new MapList()) &&
        testListIndexPredicate(() => new MapList()) &&
        testListIndexArithmetic(() => new MapList()) &&
        testListSlice(() => new MapList()) &&
        testListSliceNegativeIndex(() => new MapList()) &&
        testListSliceCornerCases(() => new MapList()) &&
        testListTime(() => new MapList());
}

function testMapListX() {
    return testListConstructor(() => new MapListX()) &&
        testListIsEmpty(() => new MapListX()) &&
        testListSize(() => new MapListX()) &&
        testListClear(() => new MapListX()) &&
        testListContains(() => new MapListX()) &&
        testListContainsPredicate(() => new MapListX()) &&
        testListContainsArithmetic(() => new MapListX()) &&
        testListEquals(() => new MapListX()) &&
        testListEqualsPredicate(() => new MapListX()) &&
        testListEach(() => new MapListX()) &&
        testListAdd(() => new MapListX()) &&
        testListInsert(fillElt => new MapListX(fillElt)) &&
        testListInsertFillZero(fillElt => new MapListX(fillElt)) &&
        testListInsertNegativeIndex(() => new MapListX()) &&
        testListInsertEnd(() => new MapListX()) &&
        testListInsertOffset(() => new MapListX()) &&
        testListDelete(() => new MapListX()) &&
        testListDeleteOffset(() => new MapListX()) &&
        testListDeleteNegativeIndex(() => new MapListX()) &&
        testListGet(() => new MapListX()) &&
        testListGetNegativeIndex(() => new MapListX()) &&
        testListSet(() => new MapListX()) &&
        testListSetNegativeIndex(() => new MapListX()) &&
        testListSetOutOfBounds(() => new MapListX()) &&
        testListIndex(() => new MapListX()) &&
        testListIndexPredicate(() => new MapListX()) &&
        testListIndexArithmetic(() => new MapListX()) &&
        testListSlice(() => new MapListX()) &&
        testListSliceNegativeIndex(() => new MapListX()) &&
        testListSliceCornerCases(() => new MapListX()) &&
        testListTime(() => new MapListX());
}

function testListAll() {
    return testArrayList() &&
        testSinglyLinkedList() &&
        testDoublyLinkedList() &&
        testDoublyLinkedListRatchet() &&
        testDoublyLinkedListMap() &&
        testHashTableList() &&
        testHashTableListX() &&
        testMapList() &&
        testMapListX();
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
