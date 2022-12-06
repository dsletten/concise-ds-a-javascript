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

    let thrown = assertRaises(Error, () => q.front(), "Can't call front() on empty queue.");
    console.log("Got expected error: " + thrown);

    thrown = assertRaises(Error, () => q.dequeue(), "Can't call dequeue() on empty queue.");
    console.log("Got expected error: " + thrown);

    return true;
}

function testPersistentDequeConstructor(dequeConstructor) {
    let dq = dequeConstructor();

    assert(dq.isEmpty(), "New Deque should be empty.");
    assert(dq.size() === 0, "New Deque size should be 0.");

    let thrown = assertRaises(Error, () => dq.rear(), "Can't call rear() on empty deque.");
    console.log("Got expected error: " + thrown);

    thrown = assertRaises(Error, () => dq.dequeueRear(), "Can't call dequeueRear() on empty deque.");
    console.log("Got expected error: " + thrown);

    return true;
}

function testPersistentQueueIsEmpty(queueConstructor) {
    let q = queueConstructor();

    assert(q.isEmpty(), "New queue should be empty.");

    q = q.enqueue(-1);
    assert(!q.isEmpty(), "Queue with elt should not be empty.");

    q = q.dequeue();
    assert(q.isEmpty(), "Empty queue should be empty.");

    return true;
}

function testPersistentDequeIsEmpty(dequeConstructor) {
    let deque = dequeConstructor();

    assert(deque.isEmpty(), "New deque should be empty.");

    deque = deque.enqueueFront(-1);
    assert(!deque.isEmpty(), "Deque with elt should not be empty.");

    deque = deque.dequeueRear();
    assert(deque.isEmpty(), "Empty deque should be empty.");

    return true;
}

function testPersistentQueueSize(queueConstructor, count = 1000) {
    let q = queueConstructor();

    assert(q.size() === 0, "Size of new queue should be 0.");

    for (let i = 1; i <= count; i++) {
        q = q.enqueue(i);
        assertPersistentQueueSize(q, i);
    }

    for (let i = count - 1; i >= 0; i--) {
        q = q.dequeue(i);
        assertPersistentQueueSize(q, i);
    }

    return true;
}

function assertPersistentQueueSize(q, n) {
    assert(q.size() === n, `Size of queue should be ${n}`);
}

function testPersistentDequeSize(dequeConstructor, count = 1000) {
    let dq = dequeConstructor();

    assert(dq.size() === 0, "Size of new deque should be 0.");

    for (let i = 1; i <= count; i++) {
        dq = dq.enqueueFront(i);
        assertPersistentQueueSize(dq, i);
    }

    for (let i = count - 1; i >= 0; i--) {
        dq = dq.dequeueRear(i);
        assertPersistentQueueSize(dq, i);
    }

    return true;
}

function testPersistentQueueClear(queueConstructor, count = 1000) {
    let q = queueConstructor().fill({count: count});

    assert(!q.isEmpty(), `Queue should have ${count} elements.`);

    q = q.clear();
    assert(q.isEmpty(), "Queue should be empty.");
    assertPersistentQueueSize(q, 0);

    q = q.fill({count: count});
    assert(!q.isEmpty(), "Emptying queue should not break it.");

    return true;
}

function testPersistentQueueEnqueue(queueConstructor, count = 1000) {
    let q = queueConstructor();

    for (let i = 1; i <= count; i++) {
        let dequeued = q.enqueue(i).front(); // ????????????????
        
        assert(dequeued === i, `Wrong value enqueued: ${dequeued} should be: ${i}`);
    }

    return true;
}

function testPersistentDequeEnqueueFront(dequeConstructor, count = 1000) {
    let dq = dequeConstructor();

    for (let i = 1; i <= count; i++) {
        let dequeued = dq.enqueueFront(i).rear(); // ?????????????
        
        assert(dequeued === i, `Wrong value enqueued at front: ${dequeued} should be: ${i}`);
    }

    return true;
}

function testPersistentQueueFrontDequeue(queueConstructor, count = 1000) {
    let q = queueConstructor().fill({count: count});

    for (let i = 1; i <= count; i++) {
        let front = q.front();
        q = q.dequeue();

        assert(front === i, `Wrong value dequeued: ${front} should be: ${i}`);
    }

    assert(q.isEmpty(), "Queue should be empty." + q.size());

    return true;
}

function testPersistentDequeRearDequeueRear(dequeConstructor, count = 1000) {
    let dq = dequeConstructor().fill({count: count});

    for (let i = count; i >= 1; i--) {
        let rear = dq.rear();
        dq = dq.dequeueRear();

        assert(rear === i, `Wrong value dequeued from rear: ${rear} should be: ${i}`);
    }

    assert(dq.isEmpty(), "Deque should be empty." + dq.size());

    return true;
}

function testPersistentQueueTime(queueConstructor, count = 10000) {
    let q = queueConstructor();
    let start = performance.now();

    for (let i = 0; i < 10; i++) {
        q = q.fill({count: count});

        while ( !q.isEmpty() ) {
            q = q.dequeue();
        }
    }

    console.log(`Elapsed time: ${performance.now() - start}`);

    return true;
}

function testPersistentDequeTime(dequeConstructor, count = 10000) {
    let dq = dequeConstructor();
    let start = performance.now();

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < count; j++) {
            dq = dq.enqueueFront(j);
        }

        while ( !dq.isEmpty() ) {
            dq = dq.dequeueRear();
        }
    }

    console.log(`Elapsed time: ${performance.now() - start}`);

    return true;
}
function persistentQueueTestSuite(queueConstructor) {
    console.log(`Testing ${queueConstructor().constructor.name}`);

    let tests = [testPersistentQueueConstructor,
                 testPersistentQueueIsEmpty,
                 testPersistentQueueSize,
                 testPersistentQueueClear,
                 testPersistentQueueEnqueue,
                 testPersistentQueueFrontDequeue,
                 testPersistentQueueTime];

    assert(!tests.some(test => { console.log(test); return test(queueConstructor) === false; }));

    return true;
}

function persistentDequeTestSuite(dequeConstructor) {
    console.log(`Testing ${dequeConstructor().constructor.name}`);

    let tests = [testPersistentDequeConstructor,
                 testPersistentDequeIsEmpty,
                 testPersistentDequeSize,
                 testPersistentDequeEnqueueFront,
                 testPersistentDequeRearDequeueRear,
                 testPersistentDequeTime];

    assert(!tests.some(test => { console.log(test); return test(dequeConstructor) === false; }));

    return true;
}

function testPersistentQueueAll() {
    let constructors = [() => new PersistentLinkedQueue(),
                        () => new PersistentListQueue()];
    return constructors.every(constructor => persistentQueueTestSuite(constructor));
}

function testPersistentDequeAll() {
    let constructors = [() => new PersistentLinkedDeque(),
                        () => new PersistentListDeque()];
    return constructors.every(constructor => 
        persistentQueueTestSuite(constructor)  &&  persistentDequeTestSuite(constructor));
}
