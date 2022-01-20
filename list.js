/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   list.js
//
//   Description
//
//   Started:           Tue Jan 11 12:26:51 2022
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
//
//    :AROUND method -> Template Method design pattern
//    
//////////////////////////////////////////////////////////////////////////////
"use strict";

//
//     List
//     
function List(fillElt) {
    if ( fillElt === undefined ) {
        this.fillElt = null;
    } else {
        this.fillElt = fillElt;
    }
}

List.prototype = Object.create(Collection.prototype);
List.prototype.constructor = List;
Object.defineProperty(List.prototype, "constructor", {enumerable: false, configurable: false});

// (defmethod print-object ((l list) stream)
//   (print-unreadable-object (l stream :type t)
//     (format stream "(")
//     (loop with i = (iterator l)
//           until (done i)
//           do (format stream "~A" (current i))
//              (next i)
//              (unless (done i)
//                (format stream " ")))
//     (format stream ")")))

// (defmethod equals ((l1 list) (l2 list) &key (test #'eql))
//   (if (= (size l1) (size l2))
//       (do ((i1 (iterator l1))
//            (i2 (iterator l2)))
//           ((and (done i1) (done i2)) t)
//         (unless (funcall test (current i1) (current i2))
//           (return nil))
//         (next i1)
//         (next i2))
//       nil))

// (defmethod each ((l list) op)
//   (let ((i (iterator l)))
//     (loop until (done i)
//           do (funcall op (current i))
//              (next i))))

List.prototype.listIterator = function(start) {
    throw new Error("List does not implement listIterator().");
};

List.prototype.add = function(...objs) {
    if ( objs.length !== 0 ) {
        this.doAdd(...objs);
    }
};

List.prototype.doAdd = function(...objs) {
    throw new Error("List does not implement doAdd().");
};

List.prototype.extendList = function(i, obj) {
    let elts = new Array(i - this.size()).fill(this.fillElt);
    elts.push(obj);
    this.add(...elts);
};

List.prototype.insert = function(i, obj) {
    if ( i < 0 ) {
        let j = i + this.size();
        if ( j >= 0 ) {
            this.insert(j, obj);
        }
    } else if ( i >= this.size() ) {
        this.extendList(i, obj);
    } else {
        this.doInsert(i, obj);
    }
};

List.prototype.doInsert = function(i, obj) {
    throw new Error("List does not implement doInsert().");
};

List.prototype.delete = function(i) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( i < 0 ) {
        let j = i + this.size();
        if ( j >= 0 ) {
            return this.delete(j);
        }
    } else if ( i < this.size() ) {
        return this.doDelete(i);
    }
};

List.prototype.doDelete = function(i) {
    throw new Error("List does not implement doDelete().");
};

List.prototype.get = function(i) {
    if ( i < 0 ) {
        let j = i + this.size();
        if ( j < 0 ) {
            return null;
        } else {
            return this.get(j);
        }
    } else if ( i >= this.size() ) {
        return null;
    } else {
        return this.doGet(i);
    }
};

List.prototype.doGet = function(i) {
    throw new Error("List does not implement doGet().");
};

List.prototype.set = function(i, obj) {
    if ( i < 0 ) {
        let j = i + this.size();
        if ( j >= 0 ) {
            this.set(j, obj);
        }
    } else if ( i >= this.size() ) {
        this.extendList(i, obj);
    } else {
        this.doSet(i, obj);
    }
};

List.prototype.doSet = function(i) {
    throw new Error("List does not implement doSet().");
};

//   Type, test?
List.prototype.index = function(obj) {
    throw new Error("List does not implement index().");
};

List.prototype.slice = function(i, n) {
    if ( n < 0 ) {
        throw new Error(`Count \`n\` must be non-negative: ${n}`);
    } else if ( i < 0 ) {
        let j = i + this.size();
        if ( j < 0 ) {
            return this.slice(0, 0);
        } else {
            return this.slice(j, n);
        }
    } else {
        return this.doSlice(i, n);
    }
};

List.prototype.doSlice = function(i, n) {
    throw new Error("List does not implement doSlice().");
};

//
//     MutableList
//     
function MutableList(fillElt) {
    List.call(this, fillElt);
    this.modificationCount = 0;
}

MutableList.prototype = Object.create(List.prototype);
MutableList.prototype.constructor = MutableList;
Object.defineProperty(MutableList.prototype, "constructor", {enumerable: false, configurable: false});

MutableList.prototype.clear = function() {
    this.countModification();
    this.doClear();
};

MutableList.prototype.doClear = function() {
    throw new Error("MutableList does not implement doClear().");
};

MutableList.prototype.countModification = function() {
    this.modificationCount++;
};

MutableList.prototype.doAdd = function(...objs) {
    this.countModification();
    this.doDoAdd(...objs);
};

MutableList.prototype.doDoAdd = function(...objs) {
    throw new Error("MutableList does not implement doDoAdd().");
};

MutableList.prototype.doInsert = function(i, obj) {
    this.countModification();
    this.doDoInsert(i, obj);
};

MutableList.prototype.doDoInsert = function(i, obj) {
    throw new Error("MutableList does not implement doDoInsert().");
};

MutableList.prototype.doDelete = function(i) {
    this.countModification();
    return this.doDoDelete(i);
};

MutableList.prototype.doDoDelete = function(i) {
    throw new Error("MutableList does not implement doDoDelete().");
};

//
//    LinkedList
// 
function LinkedList(fillElt) {
    List.call(this, fillElt);
}

LinkedList.prototype = Object.create(List.prototype);
LinkedList.prototype.constructor = LinkedList;
Object.defineProperty(LinkedList.prototype, "constructor", {enumerable: false, configurable: false});

LinkedList.prototype.insertBefore = function(node, obj) {
    if ( node === null ) {
        throw new Error("Invalid node.");
    } else {
        this.doInsertBefore(node, obj);
    }
};

LinkedList.prototype.doInsertBefore = function(node, obj) {
    throw new Error("LinkedList does not implement doInsertBefore().");
};

LinkedList.prototype.insertAfter = function(node, obj) {
    if ( node === null ) {
        throw new Error("Invalid node.");
    } else {
        this.doInsertAfter(node, obj);
    }
};

LinkedList.prototype.doInsertAfter = function(node, obj) {
    throw new Error("LinkedList does not implement doInsertAfter().");
};

LinkedList.prototype.deleteNode = function(doomed) {
    if ( doomed === null ) {
        throw new Error("Invalid node.");
    } else {
        return this.doDeleteNode(doomed);
    }
};

LinkedList.prototype.doDeleteNode = function(doomed) {
    throw new Error("LinkedList does not implement doDeleteNode().");
};

LinkedList.prototype.deleteChild = function(parent) {
    if ( parent === null ) {
        throw new Error("Invalid node.");
    } else {
        return this.doDeleteChild(parent);
    }
};

LinkedList.prototype.doDeleteChild = function(parent) {
    throw new Error("LinkedList does not implement doDeleteChild().");
};

//
//    MutableLinkedList
//
function MutableLinkedList(fillElt) {
    LinkedList.call(this, fillElt);
    this.modificationCount = 0;
}

MutableLinkedList.prototype = Object.create(LinkedList.prototype);
MutableLinkedList.prototype.constructor = MutableLinkedList;
Object.defineProperty(MutableLinkedList.prototype, "constructor", {enumerable: false, configurable: false});

MutableLinkedList.prototype.countModification = function() {
    this.modificationCount++;
};

MutableLinkedList.prototype.clear = function() {
    this.countModification();
    this.doClear();
};

MutableLinkedList.prototype.doClear = function() {
    throw new Error("MutableLinkedList does not implement doClear().");
};

MutableLinkedList.prototype.doAdd = function(...objs) {
    this.countModification();
    this.doDoAdd(...objs);
};

MutableLinkedList.prototype.doDoAdd = function(...objs) {
    throw new Error("MutableLinkedList does not implement doDoAdd().");
};

MutableLinkedList.prototype.doInsert = function(i, obj) {
    this.countModification();
    this.doDoInsert(i, obj);
};

MutableLinkedList.prototype.doDoInsert = function(i, obj) {
    throw new Error("MutableLinkedList does not implement doDoInsert().");
};

MutableLinkedList.prototype.doDelete = function(i) {
    this.countModification();
    return this.doDoDelete(i);
};

MutableLinkedList.prototype.doDoDelete = function(i) {
    throw new Error("MutableLinkedList does not implement doDoDelete().");
};

MutableLinkedList.prototype.doInsertBefore = function(node, obj) {
    this.countModification();
    this.doDoInsertBefore(node, obj);
};

MutableLinkedList.prototype.doDoInsertBefore = function(node, obj) {
    throw new Error("MutableLinkedList does not implement doDoInsertBefore().");
};

MutableLinkedList.prototype.doInsertAfter = function(node, obj) {
    this.countModification();
    this.doDoInsertAfter(node, obj);
};

MutableLinkedList.prototype.doDoInsertAfter = function(node, obj) {
    throw new Error("MutableLinkedList does not implement doDoInsertAfter().");
};

MutableLinkedList.prototype.doDeleteNode = function(doomed) {
    this.countModification();
    return this.doDoDeleteNode(doomed);
};

MutableLinkedList.prototype.doDoDeleteNode = function(doomed) {
    throw new Error("MutableLinkedList does not implement doDoDeleteNode().");
};

MutableLinkedList.prototype.doDeleteChild = function(parent) {
    this.countModification();
    return this.doDoDeleteChild(parent);
};

MutableLinkedList.prototype.doDoDeleteChild = function(parent) {
    throw new Error("MutableLinkedList does not implement doDoDeleteChild().");
};

//
//    ArrayList
// 
function ArrayList(fillElt) {
    MutableList.call(this, fillElt);
    this.store = [];
}

ArrayList.prototype = Object.create(MutableList.prototype);
ArrayList.prototype.constructor = ArrayList;
Object.defineProperty(ArrayList.prototype, "constructor", {enumerable: false, configurable: false});

ArrayList.prototype.size = function() {
    return this.store.length;
};

ArrayList.prototype.isEmpty = function() {
    return this.store.length === 0;
};

ArrayList.prototype.iterator = function() {
    return new RandomAccessListIterator(this);
};
    
    // def list_iterator(start=0)
    //   RandomAccessListListIterator.new(self, start)
    // end

ArrayList.prototype.doClear = function() {
    this.store = [];
};

ArrayList.prototype.contains = function(obj) {
    if ( this.store.find(x => x === obj) === undefined ) {
        return false;
    } else {
        return obj;
    }
};

ArrayList.prototype.doDoAdd = function(...objs) {
    this.store = this.store.concat(objs);
};

ArrayList.prototype.doDoInsert = function(i, obj) {
    this.store.splice(i, 0, obj);
};

ArrayList.prototype.doDoDelete = function(i) {
    return this.store.splice(i, 1)[0];
};

ArrayList.prototype.doGet = function(i) {
    return this.store[i];
};

ArrayList.prototype.doSet = function(i, obj) {
    this.store[i] = obj;
};

ArrayList.prototype.index = function(obj) {
    return this.store.findIndex(x => x === obj);
};

ArrayList.prototype.doSlice = function(i, n) {
    let list = new ArrayList(this.fillElt);
    list.add(...this.store.slice(i, i + n));

    return list;
};

//
//     RandomAccessListIterator
//
function RandomAccessListIterator(collection) {
    MutableCollectionIterator.call(this, collection);
    this.cursor = 0;
}

RandomAccessListIterator.prototype = Object.create(MutableCollectionIterator.prototype);
RandomAccessListIterator.prototype.constructor = RandomAccessListIterator;
Object.defineProperty(RandomAccessListIterator.prototype, "constructor", {enumerable: false, configurable: false});

RandomAccessListIterator.prototype.doDoCurrent = function() {
    return this.collection.get(this.cursor);
};

RandomAccessListIterator.prototype.doNext = function() {
    if ( this.isDone() ) {
        return null;
    } else {
        this.cursor++;

        if ( this.isDone() ) {
            return null;
        } else {
            return this.current();
        }
    }
};

RandomAccessListIterator.prototype.doIsDone = function() {
    return this.cursor === this.collection.size(); // >=
};

//
//    SinglyLinkedList
// 
function SinglyLinkedList(fillElt) {
    MutableList.call(this, fillElt);
    this.front = null;
    this.rear = null;
    this.count = 0;
}

SinglyLinkedList.prototype = Object.create(MutableLinkedList.prototype);
SinglyLinkedList.prototype.constructor = SinglyLinkedList;
Object.defineProperty(SinglyLinkedList.prototype, "constructor", {enumerable: false, configurable: false});

SinglyLinkedList.prototype.size = function() {
    return this.count;
};

SinglyLinkedList.prototype.isEmpty = function() {
    return this.front === null;
};

SinglyLinkedList.prototype.clear = function() {
    this.front = null;
    this.rear = null;
    this.count = 0;
};    

SinglyLinkedList.prototype.iterator = function() {
    return new SinglyLinkedListIterator(this);
};


// ;;; ??
// (defmethod list-iterator ((l singly-linked-list-x) &optional (start 0))
//   (make-instance 'singly-linked-list-list-iterator :list l :start start))

SinglyLinkedList.prototype.contains = function(obj) {
    return Node.contains(this.front, obj);
};

SinglyLinkedList.prototype.doDoAdd = function(...objs) {
    function addNodes(self, ...objs) { // ????
        for (let i = 0; i < objs.length; i++) {
            let node = new Node(objs[i], null);
            self.rear.setRest(node);
            self.rear = node;
        }

        self.count += objs.length;
    }

    if ( this.isEmpty() ) {
        this.rear = this.front = new Node(objs[0], null);
        this.count = 1;
        addNodes(this, ...objs.slice(1));
    } else {
        addNodes(this, ...objs);
    }
};

SinglyLinkedList.prototype.doDoInsert = function(i, obj) {
    let node = Node.nthCdr(this.front, i);
    node.spliceBefore(obj);

    if ( node === this.rear ) {
        this.rear = this.rear.rest();
    }

    this.count++;
};

SinglyLinkedList.prototype.doDoInsertBefore = function(node, obj) {
    node.spliceBefore(obj);

    if ( node === this.rear ) {
        this.rear = this.rear.rest();
    }

    this.count++;
};

SinglyLinkedList.prototype.doDoInsertAfter = function(node, obj) {
    node.spliceAfter(obj);

    if ( node === this.rear ) {
        this.rear = this.rear.rest();
    }

    this.count++;
};

SinglyLinkedList.prototype.doDoDelete = function(i) {
    if ( i === 0 ) {
        let result = this.front.first();
        this.front = this.front.rest();

        if ( this.front === null ) {
            this.rear = null;
        }

        this.count--;
        return result;
    } else {
        let parent = Node.nthCdr(this.front, i-1);
        let result = parent.exciseChild();

        if ( parent.rest() === null ) {
            this.rear = parent;
        }

        this.count--;
        return result;
    }
};

SinglyLinkedList.prototype.doDoDeleteNode = function(doomed) {
    if ( doomed === this.front ) {
        let result = this.front.first();
        this.front = this.front.rest();

        if ( this.front === null ) {
            this.rear = null;
        }

        this.count--;
        return result;
    } else {
        let result = doomed.exciseNode();

        if ( doomed.rest() === null ) {
            this.rear = doomed;
        }

        this.count--;
        return result;
    }
};

SinglyLinkedList.prototype.doDoDeleteChild = function(parent) {
    let result = parent.exciseChild();

    if ( parent.rest() === null ) {
        this.rear = parent;
    }

    this.count--;
    return result;
};

SinglyLinkedList.prototype.doGet = function(i) {
    return Node.nth(this.front, i);
};

SinglyLinkedList.prototype.doSet = function(i, obj) {
    Node.setNth(this.front, i, obj);
};

SinglyLinkedList.prototype.index = function(obj) {
    function nodeIndex(node, i) {
        if ( node === null ) {
            return null;
        } else if ( node.first() === obj) {
            return i;
        } else {
            return nodeIndex(node.rest(), i+1);
        }
    }

    return nodeIndex(this.front, 0);
};

SinglyLinkedList.prototype.doSlice = function(i, n) {
    let sll = new SinglyLinkedList(this.fillElt);
    sll.add(...Node.subseq(this.front, Math.min(i, this.count), Math.min(i+n, this.count)));
    return sll;
};
    
