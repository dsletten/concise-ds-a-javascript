/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-queue.js
//
//   Description
//
//   Started:           Thu Jul  7 14:05:56 2022
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

function testQueueConstructor(queueConstructor) {
    let q = queueConstructor();

    assert(q.isEmpty(), "New Queue should be empty.");
    assert(q.size() === 0, "New Queue size should be 0.");

    let thrown = assertRaises(Error, () => q.front(), "Can't call front() on empty queue.");
    console.log("Got expected error: " + thrown);

    // try {
    //     q.front();
    //     throw new Error("Can't call front() on empty queue.");
    // } catch (e) {
    //     switch (e.message) {
    //         case "Queue is empty.":
    //             console.log("Got expected error: " + e);
    //             break;
    //         default: throw e;
    //     }
    // }

    thrown = assertRaises(Error, () => q.dequeue(), "Can't call dequeue() on empty queue.");
    console.log("Got expected error: " + thrown);

    // try {
    //     q.dequeue();
    //     throw new Error("Can't call dequeue() on empty queue.");
    // } catch (e) {
    //     switch (e.message) {
    //         case "Queue is empty.":
    //             console.log("Got expected error: " + e);
    //             break;
    //         default: throw e;
    //     }
    // }

    return true;
}

function testDequeConstructor(dequeConstructor) {
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

function testQueueIsEmpty(queueConstructor) {
    let q = queueConstructor();

    assert(q.isEmpty(), "New queue should be empty.");

    q.enqueue(-1);
    
    assert(!q.isEmpty(), "Queue with elt should not be empty.");

    q.dequeue();
    
    assert(q.isEmpty(), "Empty queue should be empty.");

    return true;
}

function testDequeIsEmpty(dequeConstructor) {
    let deque = dequeConstructor();

    assert(deque.isEmpty(), "New deque should be empty.");

    deque.enqueue(-1);
    
    assert(!deque.isEmpty(), "Deque with elt should not be empty.");

    deque.dequeue();
    
    assert(deque.isEmpty(), "Empty deque should be empty.");

    return true;
}

function testQueueSize(queueConstructor, count = 1000) {
    let q = queueConstructor();

    assert(q.size() === 0, "Size of new queue should be 0.");

    for (let i = 1; i <= count; i++) {
        q.enqueue(i);
        assertQueueSize(q, i);
    }

    return true;
}

function assertQueueSize(q, n) {
    assert(q.size() === n, `Size of queue should be ${n}`);
}

function testDequeSize(dequeConstructor, count = 1000) {
    let q = dequeConstructor();

    assert(q.size() === 0, "Size of new deque should be 0.");

    for (let i = 1; i <= count; i++) {
        q.enqueueFront(i);
        assertQueueSize(q, i);
    }

    return true;
}

function testQueueClear(queueConstructor, count = 1000) {
    let q = queueConstructor().fill(count);

    assert(!q.isEmpty(), `Queue should have ${count} elements.`);

    q.clear();

    assert(q.isEmpty(), "Queue should be empty.");
    assertQueueSize(q, 0);

    q.fill(count);
    assert(!q.isEmpty(), "Emptying queue should not break it.");

    return true;
}

function testQueueDequeue(queueConstructor, count = 1000) {
    let q = queueConstructor().fill(count);

    for (let i = 1; i <= count; i++) {
        let dequeued = q.dequeue();

        assert(i === dequeued, `Wrong value on queue: ${dequeued} should be: ${i}`);
    }

    assert(q.isEmpty(), "Queue should be empty." + q.size());

    return true;
}

function testQueueFront(queueConstructor, count = 1000) {
    let q = queueConstructor().fill(count);

    for (let i = 1; i <= count; i++) {
        let front = q.front();

        assert(i === front, `Wrong value on queue: ${front} should be: ${i}`);
        q.dequeue();
    }

    assert(q.isEmpty(), "Queue should be empty." + q.size());

    return true;
}

function testDequeDequeueRear(dequeConstructor, count = 1000) {
    let dq = dequeConstructor().fill(count);

    for (let i = count; i >= 1; i--) {
        let dequeued = dq.dequeueRear();

        assert(i === dequeued, `Wrong value on deque: ${dequeued} should be: ${i}`);
    }

    assert(dq.isEmpty(), "Deque should be empty." + dq.size());

    return true;
}

function testDequeRear(dequeConstructor, count = 1000) {
    let dq = dequeConstructor().fill(count);

    for (let i = count; i >= 1; i--) {
        let rear = dq.rear();

        assert(i === rear, `Wrong value on deque: ${rear} should be: ${i}`);
        dq.dequeueRear();
    }

    assert(dq.isEmpty(), "Deque should be empty." + dq.size());

    return true;
}

function testQueueTime(queueConstructor, count = 100000) {
    let q = queueConstructor();
    let start = performance.now();

    for (let i = 0; i < 10; i++) {
        q.fill(count);
        emptyQueue(q);
    }

    console.log(`Elapsed time: ${performance.now() - start}`);

    return true;
}

function emptyQueue(q, count = q.size()) {
    for (let i = 0; i < count; i++) {
        q.dequeue();
    }
}

function testDequeTime(dequeConstructor, count = 100000) {
    let dq = dequeConstructor();
    let start = performance.now();

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < count; j++) {
            dq.enqueueFront(j);
        }

        while ( !dq.isEmpty() ) {
            dq.dequeueRear();
        }
    }

    console.log(`Elapsed time: ${performance.now() - start}`);

    return true;
}

function testQueueWave(queueConstructor) {
    let q = queueConstructor();

    q.fill(5000);
    assertQueueSize(q, 5000);

    emptyQueue(q, 3000);
    assertQueueSize(q, 2000);

    q.fill(5000);
    assertQueueSize(q, 7000);

    emptyQueue(q, 3000);
    assertQueueSize(q, 4000);

    q.fill(5000);
    assertQueueSize(q, 9000);

    emptyQueue(q, 3000);
    assertQueueSize(q, 6000);

    q.fill(4000);
    assertQueueSize(q, 10000);

    emptyQueue(q, 10000);
    assert(q.isEmpty(), "Queue should be empty.");

    return true;
}

function runAllQueueTests(queueConstructor) {
    console.log("Testing: " + queueConstructor().constructor.name); // ??????
    return testQueueConstructor(queueConstructor) &&
        testQueueIsEmpty(queueConstructor) &&
        testQueueSize(queueConstructor) &&
        testQueueClear(queueConstructor) &&
        testQueueDequeue(queueConstructor) &&
        testQueueFront(queueConstructor) &&
        testQueueTime(queueConstructor) &&
        testQueueWave(queueConstructor);
}

function runAllDequeTests(dequeConstructor) {
    return runAllQueueTests(dequeConstructor) &&
        testDequeConstructor(dequeConstructor) &&
        testDequeIsEmpty(dequeConstructor) &&
        testDequeSize(dequeConstructor) &&
        testDequeDequeueRear(dequeConstructor) &&
        testDequeRear(dequeConstructor) &&
        testDequeTime(dequeConstructor);
}

function testQueueAll() {
    let constructors = [() => new ArrayQueue(),
                        () => new LinkedQueue(),
                        () => new LinkedListQueue(),
                        () => new CircularQueue(),
                        () => new HashQueue(),
                        () => new MapQueue()];
    return constructors.every(constructor => runAllQueueTests(constructor));
}

function testDequeAll() {
    let constructors = [() => new DllDeque(),
                        () => new HashDeque(),
                        () => new MapDeque()];
    return constructors.every(constructor => runAllDequeTests(constructor));
}
