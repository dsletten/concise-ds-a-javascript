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

    for (let i = count - 1; i >= 0; i--) {
        list.delete(-1);

        assertListSize(list, i);
    }

    assert(list.size() === 0, "Size of empty list should be zero.");

    for (let i = 1; i <= count; i++) {
        list.insert(0, i);

        assertListSize(list, i);
    }

    for (let i = count - 1; i >= 0; i--) {
        list.delete(0);

        assertListSize(list, i);
    }

    assert(list.size() === 0, "Size of empty list should be zero.");

    return true;
}

function assertListSize(l, n) {
    assert(l.size() === n, `Size of list should be ${n}`);
}

function testListClear(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});

    assert(!list.isEmpty(), `List should have ${count} elements.`);

    list.clear();
    assert(list.isEmpty(), "List should be empty.");
    assert(list.size() === 0, "Size of empty list should be zero.");

    return true;
}

function testListElements(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    let expected = [...Array(count)].map((_,i) => i + 1);
    let elements = list.elements();

    for (let i = 0; i < count; i++) {
        assert(expected[i] === elements[i], `Element ${i} should be ${expected[i]} not ${elements[i]}.`);
    }

    assert(list.isEmpty(), "Mutable list should be empty after elements are extracted.");

    return true;
}
    
function testListContains(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
    for (let i = 1; i <= count; i++) {
        assert(list.contains(i) === i, `The list should contain the value ${i}`);
    }

    return true;
}

function testListContainsPredicate(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));
    let list = listConstructor().add(...lowers);

    assert(lowers.every(ch => list.contains(ch)), "Should be matchy matchy.");
    assert(!uppers.some(ch => list.contains(ch)), "Default test should fail.");
    assert(uppers.every(ch => list.contains(ch, (c1, c2) => c1 === c2.toUpperCase())),
           "Specific test should succeed.");
    
    return true;
}

function testListContainsArithmetic(listConstructor) {
    let list = listConstructor().fill({count: 20});

    assert(list.contains(3) === 3, "Literal 3 should be present in list.");
//    (assert (eql (contains list 3d0 :test #'=) 3) () "Float equal to 3 should be present in list.")
    assert(list.contains(3, (item, elt) => elt === item + 1) === 4,
           "List contains the element one larger than 3.");
    assert(list.contains(2, (item, elt) => elt > item * 2) === 5,
           "First element in list larger than 2 doubled is 5.");
    assert(list.contains(3, (item, elt) => elt % item === 0) === 3,
           "First multiple of 3 should be present in list.");

    return true;
}

function testListEquals(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    let arrayList = new ArrayList().fill({count: count});
    let doublyLinkedList = new DoublyLinkedList().fill({count: count});

    assert(list.equals(list), "Equality should be reflexive.");

    assert(list.equals(arrayList), "Lists with same content should be equal.");
    assert(arrayList.equals(list), "Equality should be symmetric.");
    
    assert(list.equals(doublyLinkedList), "Lists with same content should be equal.");
    assert(doublyLinkedList.equals(list), "Equality should be symmetric.");
    
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

function testListEqualsTransform(listConstructor) {
    function compare(o1, o2) {
        return value(o1) === value(o2);
    }

    function value(o) {
        if ( typeof o === 'string' ) {
            return o.length;
        } else {
            return o;
        }
    }
    
    let wordList1 = listConstructor().add("Is", "this", "not", "pung?");
    let wordList2 = listConstructor().add("gg", "mcmc", "uuu", "ixncm");
    let wordList3 = listConstructor().add("Is", "this", "no", "pung?");
    let numberList = listConstructor().add(2, 4, 3, 5);

    assert(!wordList1.equals(wordList2), "Default test should fail.");
    assert(wordList1.equals(wordList2, compare), "Specific test should succeed.");
    assert(wordList2.equals(wordList1, compare), "Equality should be symmetric.");
    assert(wordList1.equals(numberList, compare), "Specific test should succeed.");
    assert(wordList2.equals(numberList, compare), "Specific test should succeed.");
    assert(numberList.equals(wordList1, compare), "Equality should be symmetric.");
    assert(!wordList1.equals(wordList3, compare), "Unequal lists are not equal.");
    assert(!numberList.equals(wordList3, compare), "Unequal lists are not equal.");

    return true;
}

function testListEach(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let list = listConstructor().add(...lowers);
    let result = "";
    list.each(ch => {result += ch;});
    let expected = lowers.join("");

    assert(result === expected, `Concatenating each() char should produce ${expected}: ${result}`);

    return true;
}

function testListAdd(listConstructor, count = 1000) {
    let list = listConstructor();

    for (let i = 1; i <= count; i++) {
        list.add(i);

        assert(list.get(-1) === i, `Last element of list should be ${i} not ${list.get(-1)}`);
    }

    return true;
}

function testListInsert(listConstructor, fillElt = null) {
    let list = listConstructor(fillElt);
    let count = 6;
    let elt1 = "foo";
    let elt2 = "bar";

    list.insert(count-1, elt1);

    assert(list.size() === count, "Insert should extend list.");
    assert(list.get(count-1) === elt1, `Inserted element should be '${elt1}'.`);
    assert(list.slice(0, count-1).elements().every(elt => elt === fillElt), `Empty elements should be filled with ${fillElt}`);

    list.insert(0, elt2);
    
    assert(list.size() === count+1, "Insert should increase length.");
    assert(list.get(0) === elt2, `Inserted element should be '${elt2}'.`);

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
        let list = listConstructor().fill({count: count});
        list.delete(0);
        assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
        
        list.insert(0, elt);
        assert(list.get(0) === elt, `First element should be ${elt} not ${list.get(0)}.`);
    }

    {
        let list = listConstructor().fill({count: count});
        list.delete(0);
        
        list.insert(lowIndex, elt);
        assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
        assert(list.get(lowIndex) === elt, `Element ${lowIndex} element should be ${elt} not ${list.get(lowIndex)}.`);
    }

    {
        let list = listConstructor().fill({count: count});
        list.delete(0);
        
        list.insert(highIndex, elt);
        assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
        assert(list.get(highIndex) === elt, `Element ${highIndex} should be ${elt} not ${list.get(highIndex)}.`);
    }

    return true;
}
        
function testListDelete(listConstructor, count = 1000) {
    {
        let list = listConstructor().fill({count: count});

        for (let i = 1; i <= count; i++) {
            let expected = list.get(0);
            let doomed = list.delete(0);
            assert(doomed === expected, `Incorrect deleted value returned: ${doomed} rather than ${expected}`);
        }

        assert(list.isEmpty(), "Empty list should be empty.");
    }

    {
        let list = listConstructor().fill({count: count});

        for (let i = count - 1; i >= 0; i--) {
            let expected = list.get(i);
            let doomed = list.delete(i);
            assert(doomed === expected, `Incorrect deleted value returned: ${doomed} rather than ${expected}`);
        }

        assert(list.isEmpty(), "Empty list should be empty.");
    }

    {
        let list = listConstructor().fill({count: count});

        for (let i = 1; i <= count; i++) {
            let expected = list.get(-1);
            let doomed = list.delete(-1);
            assert(doomed === expected, `Incorrect deleted value returned: ${doomed} rather than ${expected}`);
        }

        assert(list.isEmpty(), "Empty list should be empty.");
    }

    return true;
}

function testListDeleteOffset(listConstructor, count = 1000) {
    let lowIndex = 1;
    let highIndex = 3/4 * count;
    let list = listConstructor().fill({count: count});

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

function testListDeleteRandom(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});

    for (let i = 1; i <= count; i++) {
        let j = Math.floor(Math.random() * list.size());
        let expected = list.get(j);
        let doomed = list.delete(j);
        assert(expected === doomed, `Incorrect deleted value returned: ${doomed} rather than ${expected}`);
    }
        
    assert(list.isEmpty(), "Empty list should be empty.");

    return true;
}
    
function testListGet(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
    for (let i = 0; i < count; i++) {
        assert(list.get(i) === i + 1, `Element ${i} should be: ${i + 1}.`);
    }

    return true;
}

function testListGetNegativeIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
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
    let list = listConstructor().fill({count: count});
    
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

    assert(list.slice(0, index).elements().every(elt => elt === list.fillElt), `Empty elements should be filled with ${list.fillElt}`);
    assert(list.size() === index + 1, "List should expand to accommodate out-of-bounds index.");
    assert(list.get(index) === elt, `Element ${index} should be: ${elt}.`);

    return true;
}

function testListIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
    for (let i = 1; i <= count; i++) {
        assert(list.index(i) === i-1, `The value ${i-1} should be located at index ${i}`);
    }

    return true;
}

function testListIndexPredicate(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));
    let list = listConstructor().add(...lowers);

    assert(!uppers.some(ch => list.index(ch)), "Default test should fail.");
    assert(uppers.every(ch => list.index(ch, (c1, c2) => c1 === c2.toUpperCase()) !== null),
           "Specific test should succeed.");
    
    return true;
}

function testListIndexArithmetic(listConstructor) {
    let list = listConstructor().fill({count: 20});

    assert(list.index(3) === 2, "Literal 3 should be at index 2.");
//    (assert (= (index list 3d0 :test #'=) 2) () "Integer equal to 3.0 should be present in list at index 2.")
    assert(list.index(3, (item, elt) => elt === item + 1) === 3,
           "List contains the element one larger than 3 at index 3.");
    assert(list.index(2, (item, elt) => elt > 2 * item) === 4,
           "First element in list larger than 2 doubled is 5 at index 4.");
    assert(list.index(3, (item, elt) => mod(elt, item) === 0) === 2,
           "First multiple of 3 should be at index 2.");

    return true;
}

function testListSlice(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
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
    let list = listConstructor().fill({count: count});
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
    let list = listConstructor().fill({count: count});
    let n = 10;

    {
        let slice = list.slice(list.size(), n);
        assert(slice.isEmpty(), "Slice at end of list should be empty");
    }
    
    {
        let slice = list.slice(-n, n);
        assert(slice.size() === n, `Slice of last ${n} elements should have ${n} elements: ${slice.size()}`);
    }

    {
        let slice = list.slice(-(count + 1), n);
        assert(slice.isEmpty(), "Slice with invalid negative index should be empty");
    }

    return true;
}

function testListReverse(listConstructor, count = 1000) {
    let original = listConstructor().fill({count: count});
    let backward = original.reverse();
    let expected = listConstructor().fill({count: count, generator: i => count - i + 1});

    assert(expected.equals(backward), `Reversed list should be: ${expected.slice(0, 20)} instead of: ${backward.slice(0, 20)}`);

    let forward = backward.reverse();
    assert(original.equals(forward), `Reversed reversed should be: ${original.slice(0, 20)} instead of: ${forward.slice(0, 20)}`);

    return true;
}

function testListAppend(listConstructor, count = 1000) {
    let list1 = listConstructor().fill({count: count});
    let list2 = listConstructor().fill({count: count});
    let list3 = list1.append(list2);
    let list4 = list2.append(list1);
    let listX = listConstructor();

    assert(list3.size() === list1.size() + list2.size(), "Result list should have same size as sum of input sizes");
    assert(list4.size() === list1.size() + list2.size(), "Result list should have same size as sum of input sizes");

    assert(list1.equals(list3.slice(0, count)), "Front of list3 should match list1");
    assert(list2.equals(list4.slice(0, count)), "Front of list4 should match list2");
    assert(list2.equals(list3.slice(count, count)), "Rear of list3 should match list2");
    assert(list1.equals(list4.slice(count, count)), "Rear of list4 should match list1");

    assert(list1.equals(list1.append(listX)), "Appending empty list yields equal list");
    assert(list1.equals(listX.append(list1)), "Appending empty list yields equal list");

    return true;
}

function testListAppendDifferentConstructor(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    let arrayList = new ArrayList().fill({count: count});
    let doublyLinkedList = new DoublyLinkedList().fill({count: count});

    assert(list.constructor === list.append(arrayList).constructor, "Appending list yields instance of same constructor as first list.");
    assert(list.constructor === list.append(doublyLinkedList).constructor, "Appending list yields instance of same constructor as first list.");
    assert(list.constructor === list.append(arrayList.append(doublyLinkedList)).constructor, "Appending list yields instance of same constructor as first list.");

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

        console.log("Delete from front of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list.fill({count: 10000});
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
            list.fill({count: 10000});
            while ( !list.isEmpty() ) {
                list.delete(-1);
            }
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Delete from random index.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list.fill({count: 10000});
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
        let list = listConstructor().fill({count: 10000});

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
        let list = listConstructor().fill({count: 10000});

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

function emptyList(list, count = list.size()) {
    for (let i = 0; i < count; i++) {
        list.delete(0);
    }
}

function testListWave(listConstructor) {
    let list = listConstructor();
    let start = performance.now();

    list.fill({count: 5000});
    assertListSize(list, 5000);

    emptyList(list, 3000);
    assertListSize(list, 2000);

    list.fill({count: 5000});
    assertListSize(list, 7000);

    emptyList(list, 3000);
    assertListSize(list, 4000);

    list.fill({count: 5000});
    assertListSize(list, 9000);

    emptyList(list, 3000);
    assertListSize(list, 6000);

    list.fill({count: 4000});
    assertListSize(list, 10000);

    emptyList(list, 10000);
    assert(list.isEmpty(), "List should be empty.");

    console.log(`Elapsed time: ${performance.now() - start}\n`);

    return true;
}

function listTestSuite(listConstructor) {
    console.log(`Testing ${listConstructor().constructor.name}`);

    let tests = [testListConstructor,
                 testListIsEmpty,
                 testListSize,
                 testListClear,
                 testListElements,
                 testListContains,
                 testListContainsPredicate,
                 testListContainsArithmetic,
                 testListEquals,
                 testListEqualsPredicate,
                 testListEqualsTransform,
                 testListEach,
                 testListAdd,
                 testListInsert,
                 testListInsertFillZero,
                 testListInsertNegativeIndex,
                 testListInsertEnd,
                 testListInsertOffset,
                 testListDelete,
                 testListDeleteOffset,
                 testListDeleteRandom,
                 testListGet,
                 testListGetNegativeIndex,
                 testListSet,
                 testListSetNegativeIndex,
                 testListSetOutOfBounds,
                 testListIndex,
                 testListIndexPredicate,
                 testListIndexArithmetic,
                 testListSlice,
                 testListSliceNegativeIndex,
                 testListSliceCornerCases,
                 testListReverse,
                 testListAppend,
                 testListAppendDifferentConstructor,
                 testListTime,
                 testListWave];

    assert(tests.every(test => { console.log(test); return test(listConstructor); }));

    return true;
}

function testArrayList() {
    return listTestSuite(fillElt => new ArrayList(fillElt));
}

function testSinglyLinkedList() {
    return listTestSuite(fillElt => new SinglyLinkedList(fillElt));
}

function testDoublyLinkedList() {
    return listTestSuite(fillElt => new DoublyLinkedList(fillElt));
}

function testDoublyLinkedListRatchet() {
    return listTestSuite(fillElt => new DoublyLinkedListRatchet(fillElt));
}

function testDoublyLinkedListMap() {
    return listTestSuite(fillElt => new DoublyLinkedListMap(fillElt));
}

function testHashTableList() {
    return listTestSuite(fillElt => new HashTableList(fillElt));
}

function testHashTableListX() {
    return listTestSuite(fillElt => new HashTableListX(fillElt));
}

function testMapList() {
    return listTestSuite(fillElt => new MapList(fillElt));
}

function testMapListX() {
    return listTestSuite(fillElt => new MapListX(fillElt));
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
