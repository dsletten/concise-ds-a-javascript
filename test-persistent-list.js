/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-persistent-list.js
//
//   Description
//
//   Started:           Tue Nov 22 15:57:03 2022
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

function testPersistentListConstructor(listConstructor) {
    let list = listConstructor();

    assert(list.isEmpty(), "New list should be empty.");
    assert(list.size() === 0, "Size of new list should be zero.");
    assert(list.get(0) === null, "Accessing element of empty list returns 'null'");

    let thrown = assertRaises(Error, () => list.delete(0), "Can't call delete() on empty list.");
    console.log("Got expected error: " + thrown);

    return true;
}

function testPersistentListIsEmpty(listConstructor) {
    let list = listConstructor();

    assert(list.isEmpty(), "New list should be empty.");
    assert(!list.add(true).isEmpty(), "List with elt should not be empty.");
    assert(list.add(true).delete(0).isEmpty(), "Empty list should be empty.");

    return true;
}

function testPersistentListSize(listConstructor, count = 1000) {
    let list = listConstructor();

    assert(list.size() === 0, "Size of new list should be zero.");

    for (let i = 1; i <= count; i++) {
        list = list.add(i);
        assertListSize(list, i);
    }

    for (let i = count - 1; i >= 0; i--) {
        list = list.delete(-1);
        assertListSize(list, i);
    }

    assert(list.size() === 0, "Size of empty list should be zero.");

    for (let i = 1; i <= count; i++) {
        list = list.insert(0, i);
        assertListSize(list, i);
    }

    for (let i = count - 1; i >= 0; i--) {
        list = list.delete(0);
        assertListSize(list, i);
    }

    assert(list.size() === 0, "Size of empty list should be zero.");

    return true;
}

function assertListSize(l, n) {
    assert(l.size() === n, `Size of list should be ${n}`);
}

function testPersistentListClear(listConstructor, count = 1000) {
    let originalList = listConstructor().fill({count: count});

    assert(!originalList.isEmpty(), `List should have ${count} elements.`);

    let list = originalList.clear();
    assert(list.isEmpty(), "List should be empty.");
    assert(!originalList.isEmpty(), "Original list is unaffected.");
    assert(list !== originalList, "Cleared list is new list.");
    assert(list.size() === 0, "Size of empty list should be zero.");
    assert(list === list.clear(), "Clearing empty list has no effect.");

    return true;
}

function testPersistentListElements(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    let expected = [...Array(count)].map((_,i) => i + 1);
    let elements = list.elements();

    for (let i = 0; i < count; i++) {
        assert(expected[i] === elements[i], `Element ${i} should be ${expected[i]} not ${elements[i]}.`);
    }

    return true;
}

function testPersistentListContains(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
    for (let i = 1; i <= count; i++) {
        assert(list.contains(i) === i, `The list should contain the value ${i}`);
    }

    return true;
}

function testPersistentListContainsPredicate(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));
    let list = listConstructor().add(...lowers);

    assert(lowers.every(ch => list.contains(ch)), "Should be matchy matchy.");
    assert(!uppers.some(ch => list.contains(ch)), "Default test should fail.");
    assert(uppers.every(ch => list.contains(ch, (c1, c2) => c1 === c2.toUpperCase())),
           "Specific test should succeed.");
    
    return true;
}

function testPersistentListContainsArithmetic(listConstructor) {
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

function testPersistentListEquals(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    let persistentList = new PersistentList().fill({count: count});
    let arrayList = new ArrayList().fill({count: count});
    let doublyLinkedList = new DoublyLinkedList().fill({count: count});

    assert(list.equals(list), "Equality should be reflexive.");

    assert(list.equals(persistentList), "Lists with same content should be equal.");
    assert(persistentList.equals(list), "Equality should be symmetric.");

    assert(list.equals(arrayList), "Lists with same content should be equal.");
    assert(arrayList.equals(list), "Equality should be symmetric.");
    
    assert(list.equals(doublyLinkedList), "Lists with same content should be equal.");
    assert(doublyLinkedList.equals(list), "Equality should be symmetric.");
    
    return true;
}

function testPersistentListEqualsPredicate(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));

    let list = listConstructor().add(...lowers);
    let persistentList = new PersistentList().add(...uppers);
    let arrayList = new ArrayList().add(...uppers);
    let doublyLinkedList = new DoublyLinkedList().add(...uppers);

    assert(!list.equals(persistentList), "Default test should fail.");
    assert(!list.equals(arrayList), "Default test should fail.");
    assert(!list.equals(doublyLinkedList), "Default test should fail.");

    assert(list.equals(persistentList, (c1, c2) => c1.toUpperCase() === c2.toUpperCase()),
           "Specific test should succeed.");
    assert(list.equals(arrayList, (c1, c2) => c1.toUpperCase() === c2.toUpperCase()),
           "Specific test should succeed.");
    assert(list.equals(doublyLinkedList, (c1, c2) => c1.toUpperCase() === c2.toUpperCase()),
           "Specific test should succeed.");
    
    return true;
}

function testPersistentListEqualsTransform(listConstructor) {
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

function testPersistentListEach(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let list = listConstructor().add(...lowers);
    let result = "";
    list.each(ch => {result += ch;});
    let expected = lowers.join("");

    assert(result === expected, `Concatenating each() char should produce ${expected}: ${result}`);

    return true;
}

function testPersistentListAdd(listConstructor, count = 1000) {
    let list = listConstructor();

    for (let i = 1; i <= count; i++) {
        list = list.add(i);

        assert(list.size() === i, `Size of list should be ${i} not ${list.size()}`);
        assert(list.get(-1) === i, `Last element of list should be ${i} not ${list.get(-1)}`);
    }

    return true;
}

function testPersistentListInsert(listConstructor, fillElt = null) {
    let list = listConstructor(fillElt);
    let count = 6;
    let elt1 = "foo";
    let elt2 = "bar";

    list = list.insert(count-1, elt1);

    assert(list.size() === count, "Insert should extend list.");
    assert(list.get(count-1) === elt1, `Inserted element should be '${elt1}'.`);
    assert(list.slice(0, count-1).elements().every(elt => elt === fillElt), `Empty elements should be filled with ${fillElt}`);

    list = list.insert(0, elt2);
    
    assert(list.size() === count+1, "Insert should increase length.");
    assert(list.get(0) === elt2, `Inserted element should be '${elt2}'.`);

    return true;
}

function testPersistentListInsertFillZero(listConstructor) {
    return testPersistentListInsert(listConstructor, 0);
}

function testPersistentListInsertNegativeIndex(listConstructor) {
    let list = listConstructor().add(0);

    for (let i = 1; i <= 10; i++) {
        list = list.insert(-i, i);
    }

    let iterator = list.iterator();
    for (let i = 10; i >= 0; i--) {
        assert(i === iterator.current(), `Inserted element should be: ${i} but found: ${iterator.current()}`);
        iterator = iterator.next();
    }

    return true;
}

function testPersistentListInsertEnd(listConstructor) {
    let list = listConstructor().add(0, 1, 2);
    let x = 3;
    let y = 10;

    list = list.insert(x, x);
    assert(list.get(x) === x, `Element at index ${x} should be ${x}`);
    assert(list.size() === x+1, `Size of list should be ${x+1} not ${list.size()}.`);

    list = list.insert(y, y);
    assert(list.get(y) === y, `Element at index ${y} should be ${y}`);
    assert(list.size() === y+1, `Size of list should be ${y+1} not ${list.size()}.`);
    
    return true;
}

// function testPersistentListInsertOffset(listConstructor, count = 1000) {
//     let lowIndex = 1;
//     let highIndex = 3/4 * count;
//     let elt = 88;
    
//     {
//         let list = listConstructor().fill({count: count});
//         list.delete(0);
//         assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
        
//         list.insert(0, elt);
//         assert(list.get(0) === elt, `First element should be ${elt} not ${list.get(0)}.`);
//     }

//     {
//         let list = listConstructor().fill({count: count});
//         list.delete(0);
        
//         list.insert(lowIndex, elt);
//         assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
//         assert(list.get(lowIndex) === elt, `Element ${lowIndex} element should be ${elt} not ${list.get(lowIndex)}.`);
//     }

//     {
//         let list = listConstructor().fill({count: count});
//         list.delete(0);
        
//         list.insert(highIndex, elt);
//         assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
//         assert(list.get(highIndex) === elt, `Element ${highIndex} should be ${elt} not ${list.get(highIndex)}.`);
//     }

//     return true;
// }
        
function testPersistentListDelete(listConstructor, count = 1000) {
    {
        let list = listConstructor().fill({count: count});

        for (let i = 1; i <= count; i++) {
            let elt = list.get(0);
            assert(i === elt, `Incorrect value at front of list: ${elt} rather than ${i}`);
            list = list.delete(0);
        }

        assert(list.isEmpty(), "Empty list should be empty.");
    }

    {
        let list = listConstructor().fill({count: count});

        for (let i = count; i >= 1; i--) {
            let elt = list.get(i - 1);
            assert(i === elt, `Incorrect value at end of list: ${elt} rather than ${i}`);
            list = list.delete(i - 1);
        }

        assert(list.isEmpty(), "Empty list should be empty.");
    }

    {
        let list = listConstructor().fill({count: count});

        for (let i = count; i >= 1; i--) {
            let elt = list.get(-1);
            assert(i === elt, `Incorrect value at end of list: ${elt} rather than ${i}`);
            list = list.delete(-1);
        }

        assert(list.isEmpty(), "Empty list should be empty.");
    }

    return true;
}

// function testPersistentListDeleteOffset(listConstructor, count = 1000) {
//     let lowIndex = 1;
//     let highIndex = 3/4 * count;
//     let list = listConstructor().fill({count: count});

//     list.delete(0);
//     assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);

//     list.delete(lowIndex);
//     assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
//     assert(list.get(lowIndex) === lowIndex + 3, `Element ${lowIndex} should be ${lowIndex + 3} not ${list.get(lowIndex)}.`);

//     list.delete(highIndex);
//     assert(list.get(0) === 2, `First element should be 2 not ${list.get(0)}.`);
//     assert(list.get(highIndex) === highIndex + 4, `Element ${highIndex} should be ${highIndex + 4} not ${list.get(highIndex)}.`);

//     return true;
// }

function testPersistentListDeleteRandom(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});

    for (let i = 1; i <= count; i++) {
        let j = Math.floor(Math.random() * list.size());
        let expected = list.get(j);
        list = list.delete(j);
        assert(!list.contains(expected), `Element ${j} should have been deleted: ${expected}`);
    }
        
    assert(list.isEmpty(), "Empty list should be empty.");

    return true;
}
    
function testPersistentListGet(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
    for (let i = 0; i < count; i++) {
        assert(list.get(i) === i + 1, `Element ${i} should be: ${i + 1}.`);
    }

    return true;
}

function testPersistentListGetNegativeIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
    for (let i = -1; i >= -count; i--) {
        assert(list.get(i) === i+count+1, `Element ${i} should be: ${i+count+1} not ${list.get(i)}.`);
    }

    return true;
}

function testPersistentListSet(listConstructor, count = 1000) {
    let list = listConstructor();

    for (let i = 0; i <= count; i++) {
        assert(list.size() === i, `Prior to set() size should be ${i} not ${list.size()}`);
        list = list.set(i, i);
        assert(list.size() === i+1, `After set() size should be ${i+1} not ${list.size()}`);
    }

    for (let i = 0; i <= count; i++) {
        assert(list.get(i) === i, `Element ${i} should be: ${list.get(i)}.`);
    }

    return true;
}

function testPersistentListSetNegativeIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
    for (let i = -1; i >= -count; i--) {
        list = list.set(i, i);
    }

    for (let i = 0; i < count; i++) {
        assert(list.get(i) === i-count, `Element ${i} should have value ${i-count} not ${list.get(i)}.`);
    }

    return true;
}

function testPersistentListSetOutOfBounds(listConstructor) {
    let list = listConstructor();
    let index = 10;
    let elt = "foo";

    list = list.set(index, elt);

    assert(list.slice(0, index).elements().every(elt => elt === list.fillElt), `Empty elements should be filled with ${list.fillElt}`);
    assert(list.size() === index + 1, "List should expand to accommodate out-of-bounds index.");
    assert(list.get(index) === elt, `Element ${index} should be: ${elt}.`);

    return true;
}

function testPersistentListIndex(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    
    for (let i = 1; i <= count; i++) {
        assert(list.index(i) === i-1, `The value ${i-1} should be located at index ${i}`);
    }

    return true;
}

function testPersistentListIndexPredicate(listConstructor) {
    let lowers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'a'.charCodeAt()));
    let uppers = [...Array(26)].map((_,i) => String.fromCharCode(i + 'A'.charCodeAt()));
    let list = listConstructor().add(...lowers);

    assert(!uppers.some(ch => list.index(ch)), "Default test should fail.");
    assert(uppers.every(ch => list.index(ch, (c1, c2) => c1 === c2.toUpperCase()) !== null),
           "Specific test should succeed.");
    
    return true;
}

function testPersistentListIndexArithmetic(listConstructor) {
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

function testPersistentListSlice(listConstructor, count = 1000) {
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

function testPersistentListSliceNegativeIndex(listConstructor, count = 1000) {
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

function testPersistentListSliceCornerCases(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});

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

function testPersistentListReverse(listConstructor, count = 1000) {
    let original = listConstructor().fill({count: count});
    let backward = original.reverse();
    let expected = listConstructor().fill({count: count, generator: i => count - i + 1});

    assert(expected.equals(backward), `Reversed list should be: ${expected.slice(0, 20)} instead of: ${backward.slice(0, 20)}`);

    let forward = backward.reverse();
    assert(original.equals(forward), `Reversed reversed should be: ${original.slice(0, 20)} instead of: ${forward.slice(0, 20)}`);

    return true;
}

function testPersistentListAppend(listConstructor, count = 1000) {
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

function testPersistentListAppendDifferentConstructor(listConstructor, count = 1000) {
    let list = listConstructor().fill({count: count});
    let arrayList = new ArrayList().fill({count: count});
    let doublyLinkedList = new DoublyLinkedList().fill({count: count});

    assert(list.constructor === list.append(arrayList).constructor, "Appending list yields instance of same constructor as first list.");
    assert(list.constructor === list.append(doublyLinkedList).constructor, "Appending list yields instance of same constructor as first list.");
    assert(list.constructor === list.append(arrayList.append(doublyLinkedList)).constructor, "Appending list yields instance of same constructor as first list.");

    return true;
}

function testPersistentListTime(listConstructor) {
    console.log();
    {
        let list = listConstructor();
        console.log(`Timing ${list.constructor.name}`);

        console.log("Add to front of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10000; j++) {
                list = list.insert(0, j);
            }
            list = list.clear();
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Add to end of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10000; j++) {
                list = list.add(j);
            }
            list = list.clear();
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Insert at random index.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list = list.add(null);
            for (let j = 0; j < 10000; j++) {
                list = list.insert(Math.floor(Math.random() * list.size()), j);
            }
            list = list.clear();
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Delete from front of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list = list.fill({count: 10000});
            while ( !list.isEmpty() ) {
                list = list.delete(0);
            }
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Delete from end of list.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list = list.fill({count: 10000});
            while ( !list.isEmpty() ) {
                list = list.delete(-1);
            }
        }
        console.log(`Elapsed time: ${performance.now() - start}`);
    }

    {
        let list = listConstructor();

        console.log("Delete from random index.");
        let start = performance.now();
        for (let i = 0; i < 10; i++) {
            list = list.fill({count: 10000});
            for (let j = 0; j < 10000; j++) {
                try {
                    var index = Math.floor(Math.random() * list.size());
                    list = list.delete(index);
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

function persistentListTestSuite(listConstructor) {
    console.log(`Testing ${listConstructor().constructor.name}`);

    let tests = [testPersistentListConstructor,
                 testPersistentListIsEmpty,
                 testPersistentListSize,
                 testPersistentListClear,
                 testPersistentListElements,
                 testPersistentListContains,
                 testPersistentListContainsPredicate,
                 testPersistentListContainsArithmetic,
                 testPersistentListEquals,
                 testPersistentListEqualsPredicate,
                 testPersistentListEqualsTransform,
                 testPersistentListEach,
                 testPersistentListAdd,
                 testPersistentListInsert,
                 testPersistentListInsertFillZero,
                 testPersistentListInsertNegativeIndex,
                 testPersistentListInsertEnd,
                 testPersistentListDelete,
                 testPersistentListDeleteRandom,
                 testPersistentListGet,
                 testPersistentListGetNegativeIndex,
                 testPersistentListSet,
                 testPersistentListSetNegativeIndex,
                 testPersistentListSetOutOfBounds,
                 testPersistentListIndex,
                 testPersistentListIndexPredicate,
                 testPersistentListIndexArithmetic,
                 testPersistentListSlice,
                 testPersistentListSliceNegativeIndex,
                 testPersistentListSliceCornerCases,
                 testPersistentListReverse,
                 testPersistentListAppend,
                 testPersistentListAppendDifferentConstructor,
                 testPersistentListTime];

    assert(tests.every(test => { console.log(test); return test(listConstructor); }));

    return true;
}

function testPersistentList() {
    return persistentListTestSuite(fillElt => new PersistentList(fillElt));
}
