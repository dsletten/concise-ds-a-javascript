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
    let dq = dequeConstructor();

    assert(dq.isEmpty(), "New Deque should be empty.");
    assert(dq.size() === 0, "New Deque size should be 0.");

    let thrown = assertRaises(Error, () => dq.rear(), "Can't call rear() on empty deque.");
    console.log("Got expected error: " + thrown);

    // try {
    //     dq.rear();
    //     throw new Error("Can't call rear() on empty deque.");
    // } catch (e) {
    //     switch (e.message) {
    //         case "Deque is empty.":
    //             console.log("Got expected error: " + e);
    //             break;
    //         default: throw e;
    //     }
    // }

    thrown = assertRaises(Error, () => dq.dequeueRear(), "Can't call dequeueRear() on empty deque.");
    console.log("Got expected error: " + thrown);

    // try {
    //     dq.dequeueRear();
    //     throw new Error("Can't call dequeueRear() on empty deque.");
    // } catch (e) {
    //     switch (e.message) {
    //         case "Deque is empty.":
    //             console.log("Got expected error: " + e);
    //             break;
    //         default: throw e;
    //     }
    // }

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

    deque.enqueueFront(-1);
    assert(!deque.isEmpty(), "Deque with elt should not be empty.");

    deque.dequeueRear();
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

    for (let i = count-1; i >= 0; i--) {
        q.dequeue();
        assertQueueSize(q, i);
    }

    assert(q.isEmpty(), "Empty queue should be empty.");

    return true;
}

function assertQueueSize(q, n) {
    assert(q.size() === n, `Size of queue should be ${n}`);
}

function testDequeSize(dequeConstructor, count = 1000) {
    let dq = dequeConstructor();

    assert(dq.size() === 0, "Size of new deque should be 0.");

    for (let i = 1; i <= count; i++) {
        dq.enqueueFront(i);
        assertQueueSize(dq, i);
    }

    for (let i = count-1; i >= 0; i--) {
        dq.dequeueRear();
        assertQueueSize(dq, i);
    }

    assert(dq.isEmpty(), "Empty deque should be empty.");

    return true;
}

function testQueueClear(queueConstructor, count = 1000) {
    let q = queueConstructor().fill({count: count});

    assert(!q.isEmpty(), `Queue should have ${count} elements.`);

    q.clear();
    assert(q.isEmpty(), "Queue should be empty.");
    assertQueueSize(q, 0);

    q.fill({count: count});
    assert(!q.isEmpty(), "Emptying queue should not break it.");

    return true;
}

function testQueueElements(queueConstructor, count = 1000) {
    let q = queueConstructor().fill({count: count});
    let expected = [...Array(count)].map((_,i) => i + 1);
    let elements = q.elements();

    for (let i = 0; i < count; i++) {
        assert(expected[i] === elements[i], `Element ${i} should be ${expected[i]} not ${elements[i]}.`);
    }

    assert(q.isEmpty(), "Mutable queue should be empty after elements are extracted.");

    return true;
}

function testQueueEnqueue(queueConstructor, count = 1000) {
    let q = queueConstructor();

    for (let i = 1; i <= count; i++) {
        q.enqueue(i);
        let dequeued = q.dequeue();
        
        assert(dequeued === i, `Wrong value enqueued: ${dequeued} should be: ${i}`);
    }

    return true;
}

function testDequeEnqueueFront(dequeConstructor, count = 1000) {
    let dq = dequeConstructor();

    for (let i = 1; i <= count; i++) {
        dq.enqueueFront(i);
        let dequeued = dq.dequeueRear();
        
        assert(dequeued === i, `Wrong value enqueued at front: ${dequeued} should be: ${i}`);
    }

    return true;
}

function testQueueFrontDequeue(queueConstructor, count = 1000) {
    let q = queueConstructor().fill({count: count});

    for (let i = 1; i <= count; i++) {
        let front = q.front();
        let dequeued = q.dequeue();

        assert(front === dequeued, `Wrong value dequeued: ${dequeued} should be: ${front}`);
    }

    assert(q.isEmpty(), "Queue should be empty." + q.size());

    return true;
}

function testDequeRearDequeueRear(dequeConstructor, count = 1000) {
    let dq = dequeConstructor().fill({count: count});

    for (let i = count; i >= 1; i--) {
        let rear = dq.rear();
        let dequeued = dq.dequeueRear();

        assert(rear === dequeued, `Wrong value dequeued from rear: ${dequeued} should be: ${rear}`);
    }

    assert(dq.isEmpty(), "Deque should be empty." + dq.size());

    return true;
}

function testQueueTime(queueConstructor, count = 100000) {
    let q = queueConstructor();
    let start = performance.now();

    for (let i = 0; i < 10; i++) {
        q.fill({count: count});

        while ( !q.isEmpty() ) {
            q.dequeue();
        }
    }

    console.log(`Elapsed time: ${performance.now() - start}\n`);

    return true;
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

    console.log(`Elapsed time: ${performance.now() - start}\n`);

    return true;
}

function emptyQueue(q, count = q.size()) {
    for (let i = 0; i < count; i++) {
        q.dequeue();
    }
}

function testQueueWave(queueConstructor) {
    let q = queueConstructor();
    let start = performance.now();

    q.fill({count: 5000});
    assertQueueSize(q, 5000);

    emptyQueue(q, 3000);
    assertQueueSize(q, 2000);

    q.fill({count: 5000});
    assertQueueSize(q, 7000);

    emptyQueue(q, 3000);
    assertQueueSize(q, 4000);

    q.fill({count: 5000});
    assertQueueSize(q, 9000);

    emptyQueue(q, 3000);
    assertQueueSize(q, 6000);

    q.fill({count: 4000});
    assertQueueSize(q, 10000);

    emptyQueue(q, 10000);
    assert(q.isEmpty(), "Queue should be empty.");

    console.log(`Elapsed time: ${performance.now() - start}\n`);

    return true;
}

function queueTestSuite(queueConstructor) {
    console.log(`Testing ${queueConstructor().constructor.name}`);

    let tests = [testQueueConstructor,
                 testQueueIsEmpty,
                 testQueueSize,
                 testQueueClear,
                 testQueueElements,
                 testQueueEnqueue,
                 testQueueFrontDequeue,
                 testQueueTime,
                 testQueueWave];

    assert(tests.every(test => { console.log(test); return test(queueConstructor); }));

    return true;
}

function dequeTestSuite(dequeConstructor) {
    console.log(`Testing ${dequeConstructor().constructor.name}`);

    let tests = [testDequeConstructor,
                 testDequeIsEmpty,
                 testDequeSize,
                 testDequeEnqueueFront,
                 testDequeRearDequeueRear,
                 testDequeTime];

    assert(tests.every(test => { console.log(test); return test(dequeConstructor); }));

    return true;
}

function testQueueAll() {
    let constructors = [() => new ArrayQueue(),
                        () => new ArrayRingBuffer(),
                        () => new LinkedQueue(),
                        () => new LinkedRingBuffer(),
                        () => new LinkedListQueue(),
                        () => new DllQueue(),
                        () => new CircularQueue(),
                        () => new HashQueue(),
                        () => new MapQueue()];
    return constructors.every(constructor => queueTestSuite(constructor));
}

function testDequeAll() {
    let constructors = [() => new ArrayRingBufferDeque(),
                        () => new ArrayRingBufferDequeX(),
                        () => new DllDeque(),
                        () => new HashDeque(),
                        () => new MapDeque()];
    return constructors.every(constructor =>
        queueTestSuite(constructor)  &&  dequeTestSuite(constructor));
}
