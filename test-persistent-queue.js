/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-persistent-queue.js
//
//   Description
//
//   Started:           Sun Jul 24 23:57:32 2022
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

function testPersistentQueueConstructor(queueConstructor) {
    let q = queueConstructor();

    assert(q.isEmpty(), "New Queue should be empty.");
    assert(q.size() === 0, "New Queue size should be 0.");

    try {
        q.front();
        throw new Error("Can't call front() on empty queue.");
    } catch (e) {
        switch (e.message) {
            case "Queue is empty.":
                console.log("Got expected error: " + e);
                break;
            default: throw e;
        }
    }

    try {
        q.dequeue();
        throw new Error("Can't call dequeue() on empty queue.");
    } catch (e) {
        switch (e.message) {
            case "Queue is empty.":
                console.log("Got expected error: " + e);
                break;
            default: throw e;
        }
    }

    return true;
}

function testPersistentDequeConstructor(dequeConstructor) {
    let q = dequeConstructor();

    assert(q.isEmpty(), "New Deque should be empty.");
    assert(q.size() === 0, "New Deque size should be 0.");

    try {
        q.rear();
        throw new Error("Can't call rear() on empty deque.");
    } catch (e) {
        switch (e.message) {
            case "Deque is empty.":
                console.log("Got expected error: " + e);
                break;
            default: throw e;
        }
    }

    try {
        q.dequeueRear();
        throw new Error("Can't call dequeueRear() on empty deque.");
    } catch (e) {
        switch (e.message) {
            case "Deque is empty.":
                console.log("Got expected error: " + e);
                break;
            default: throw e;
        }
    }

    return true;
}

function runAllPersistentQueueTests(queueConstructor) {
    console.log("Testing: " + queueConstructor().constructor.name); // ??????
    return testPersistentQueueConstructor(queueConstructor);
        // testPersistentQueueIsEmpty(queueConstructor) &&
        // testPersistentQueueSize(queueConstructor) &&
        // testPersistentQueueClear(queueConstructor) &&
        // testPersistentQueueDequeue(queueConstructor) &&
        // testPersistentQueueFront(queueConstructor) &&
        // testPersistentQueueTime(queueConstructor) &&
        // testPersistentQueueWave(queueConstructor);
}

function runAllPersistentDequeTests(dequeConstructor) {
    return runAllPersistentQueueTests(dequeConstructor) &&
        testPersistentDequeConstructor(dequeConstructor);
        // testPersistentDequeIsEmpty(dequeConstructor) &&
        // testPersistentDequeSize(dequeConstructor) &&
        // testPersistentDequeDequeueRear(dequeConstructor) &&
        // testPersistentDequeRear(dequeConstructor) &&
        // testPersistentDequeTime(dequeConstructor);
}

function testPersistentQueueAll() {
    let constructors = [() => new PersistentLinkedQueue(),
                        () => new PersistentListQueue()];
    return constructors.every(constructor => runAllPersistentQueueTests(constructor));
}

function testPersistentDequeAll() {
    let constructors = [() => new PersistentLinkedDeque(),
                        () => new PersistentListDeque()];
    return constructors.every(constructor => runAllPersistentDequeTests(constructor));
}
