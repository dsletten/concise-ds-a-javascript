/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-mutable-linked-list.js
//
//   Description
//
//   Started:           Thu Dec 22 00:55:49 2022
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

function testMutableLinkedListInsertBefore(listConstructor, getNode, nextNode) {
    let list = listConstructor();

    let thrown = assertRaises(Error, () => list.insertBefore(null, 8), "Can't call insertBefore() on empty list.");
    console.log("Got expected error: " + thrown);

    list.fill({count: 20});
    thrown = assertRaises(Error, () => list.insertBefore(null, 8), "Can't insertBefore() null node.");
    console.log("Got expected error: " + thrown);

    let start = getNode(list);
    let child = nextNode(list, start);
    let grandChild = nextNode(list, child);

    list.insertBefore(grandChild, -99);
    assert(-99 === list.get(2), "Element after child should be -99");

    return true;
}

function testMutableLinkedListInsertAfter(listConstructor, getNode, nextNode) {
    let list = listConstructor();

    let thrown = assertRaises(Error, () => list.insertAfter(null, 8), "Can't call insertAfter() on empty list.");
    console.log("Got expected error: " + thrown);

    list.fill({count: 20});
    thrown = assertRaises(Error, () => list.insertAfter(null, 8), "Can't insertAfter() null node.");
    console.log("Got expected error: " + thrown);

    let start = getNode(list);
    let child = nextNode(list, start);

    list.insertAfter(child, -99);
    assert(-99 === list.get(2), "Element after child should be -99");

    return true;
}

function testMutableLinkedListDeleteNode(listConstructor, getNode, nextNode) {
    let list = listConstructor();

    let thrown = assertRaises(Error, () => list.deleteNode(null), "Can't call deleteNode() on empty list.");
    console.log("Got expected error: " + thrown);

    list.fill({count: 20});
    thrown = assertRaises(Error, () => list.deleteNode(null), "Can't deleteNode() for null node.");
    console.log("Got expected error: " + thrown);

    let start = getNode(list);
    let child = nextNode(list, start);
    let grandChild = nextNode(list, child);

    list.deleteNode(grandChild);
    assert(4 === list.get(2), "Element after child should be 4");

    return true;
}

function testMutableLinkedListDeleteChild(listConstructor, getNode, nextNode) {
    let list = listConstructor();

    let thrown = assertRaises(Error, () => list.deleteChild(null), "Can't call deleteChild() on empty list.");
    console.log("Got expected error: " + thrown);

    list.fill({count: 20});
    thrown = assertRaises(Error, () => list.deleteChild(null), "Can't deleteChild() for null node.");
    console.log("Got expected error: " + thrown);

    let start = getNode(list);
    let child = nextNode(list, start);

    list.deleteChild(child);
    assert(4 === list.get(2), "Element after child should be 4");

    return true;
}

function mutableLinkedListTestSuite(listConstructor, getNode, nextNode) {
    console.log(`Testing ${listConstructor().constructor.name}`);

    let tests = [testMutableLinkedListInsertBefore,
                 testMutableLinkedListInsertAfter,
                 testMutableLinkedListDeleteNode,
                 testMutableLinkedListDeleteChild];

    assert(tests.every(test => { console.log(test); return test(listConstructor, getNode, nextNode); }));

    return true;
}

function testMllSinglyLinkedList() {
    return mutableLinkedListTestSuite(fillElt => new SinglyLinkedList(fillElt),
                                      list => list.front,
                                      (list, node) => node.rest());
}

function testMllDoublyLinkedList() {
    return mutableLinkedListTestSuite(fillElt => new DoublyLinkedList(fillElt),
                                      list => list.store,
                                      (list, node) => node.getNext());
}

function testMllDoublyLinkedListRatchet() {
    return mutableLinkedListTestSuite(fillElt => new DoublyLinkedListRatchet(fillElt),
                                      list => list.store,
                                      (list, node) => node.getNext());
}

function testMllDoublyLinkedListMap() {
    return mutableLinkedListTestSuite(fillElt => new DoublyLinkedListMap(fillElt),
                                      list => list.head,
                                      (list, node) => list.nextDnode(node));
}

function testMutableLinkedListAll() {
    return testMllSinglyLinkedList() &&
           testMllDoublyLinkedList() &&
           testMllDoublyLinkedListRatchet() &&
           testMllDoublyLinkedListMap();
}
