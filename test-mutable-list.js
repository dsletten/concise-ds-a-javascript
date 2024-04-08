/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-mutable-list.js
//
//   Description
//
//   Started:           Thu Dec 22 00:55:35 2022
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

function testMutableListClear(listConstructor) {
    let list = listConstructor();

    assert(list.modificationCount === 0, "New list should not have been modified");

    list.fill({count: 20});
    list.clear();
    assert(list.modificationCount === 2, "Clearing filled list modifies it twice");

    list.clear();
    assert(list.modificationCount === 2, "Clearing empty list does not modify it again");

    return true;
}

function testMutableListAdd(listConstructor) {
    let list = listConstructor();

    list.add(2, 4, 6, 8);
    assert(list.modificationCount === 1, "Adding multiple items is one modification");

    list.add(10);
    assert(list.modificationCount === 2, "Subsequent addition is another modification");

    return true;
}

function testMutableListInsert(listConstructor) {
    let list = listConstructor();

    list.insert(0, 99);
    assert(list.modificationCount === 1, "Inserting into empty list causes modification");

    list.insert(-5, 88);
    assert(list.modificationCount === 1, "Invalid insertion does not cause modification");

    return true;
}

function testMutableListDelete(listConstructor) {
    let list = listConstructor().fill({count: 20})

    list.delete(0);
    assert(list.modificationCount === 2, "Deleting from filled list modifies it twice");

    list.delete(0);
    assert(list.modificationCount === 3, "Subsequent deletion is another modification");

    list.delete(-20);
    assert(list.modificationCount === 3, "Invalid deletion does not cause modification");

    return true;
}

function mutableListTestSuite(listConstructor) {
    console.log(`Testing ${listConstructor().constructor.name}`);

    let tests = [testMutableListClear,
                 testMutableListAdd,
                 testMutableListInsert,
                 testMutableListDelete];

    assert(tests.every(test => { console.log(test); return test(listConstructor); }));

    return true;
}

function testMutableArrayList() {
    return mutableListTestSuite(fillElt => new ArrayList(fillElt));
}

function testMutableSinglyLinkedList() {
    return mutableListTestSuite(fillElt => new SinglyLinkedList(fillElt));
}

function testMutableDoublyLinkedList() {
    return mutableListTestSuite(fillElt => new DoublyLinkedList(fillElt));
}

function testMutableDoublyLinkedListRatchet() {
    return mutableListTestSuite(fillElt => new DoublyLinkedListRatchet(fillElt));
}

function testMutableDoublyLinkedListMap() {
    return mutableListTestSuite(fillElt => new DoublyLinkedListMap(fillElt));
}

function testMutableHashTableList() {
    return mutableListTestSuite(fillElt => new HashTableList(fillElt));
}

function testMutableHashTableListX() {
    return mutableListTestSuite(fillElt => new HashTableListX(fillElt));
}

function testMutableMapList() {
    return mutableListTestSuite(fillElt => new MapList(fillElt));
}

function testMutableMapListX() {
    return mutableListTestSuite(fillElt => new MapListX(fillElt));
}

function testMutableListAll() {
    return testMutableArrayList() &&
           testMutableSinglyLinkedList() &&
           testMutableDoublyLinkedList() &&
           testMutableDoublyLinkedListRatchet() &&
           testMutableDoublyLinkedListMap() &&
           testMutableHashTableList() &&
           testMutableHashTableListX() &&
           testMutableMapList() &&
           testMutableMapListX();
}
