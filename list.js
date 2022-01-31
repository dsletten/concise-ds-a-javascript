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

function mod(number, divisor) {
    let rem = number % divisor;

    if ( rem !== 0  && (divisor < 0 ? number > 0 : number < 0) ) {
        return rem + divisor;
    } else {
        return rem;
    }
}


//
//     List
//     
function List(fillElt = null) {
    this.fillElt = fillElt;
}

List.prototype = Object.create(Collection.prototype);
List.prototype.constructor = List;
Object.defineProperty(List.prototype, "constructor", {enumerable: false, configurable: false});

List.prototype.toString = function() {
    let result = "(";
    let i = this.iterator();

    while ( !i.isDone() ) {
        result += i.current();
        i.next();
        if ( !i.isDone() ) {
            result += " ";
        }
    }

    result += ")";

    return result;
};

List.prototype.equals = function(list, test = (x, y) => x === y) {
    if ( this.size() === list.size() ) {
        let i1 = this.iterator();
        let i2 = list.iterator();

        while ( !(i1.isDone()  &&  i2.isDone()) ) {
            if ( !test(i1.current(), i2.current()) ) {
                return false;
            }
            i1.next();
            i2.next();
        }

        return true;
    } else {
        return false;
    }
};

List.prototype.each = function(op) {
    let i = this.iterator();

    while ( !i.isDone() ) {
        op.call(null, i.current());
        i.next();
    }
};

List.prototype.listIterator = function(start) {
    throw new Error("List does not implement listIterator().");
};

// List.prototype.add = function(...objs) {
//     if ( objs.length !== 0 ) {
//         this.doAdd(objs);
//     }
// };

List.prototype.add = function(...objs) {
    throw new Error("List does not implement add().");
};

List.prototype.extendList = function(i, obj) {
    let elts = new Array(i - this.size()).fill(this.fillElt);
    elts.push(obj);
    return this.add(...elts);
};

List.prototype.insert = function(i, obj) {
    if ( i < 0 ) {
        let j = i + this.size();
        if ( j >= 0 ) {
            return this.insert(j, obj);
        }
    } else if ( i >= this.size() ) {
        return this.extendList(i, obj);
    } else {
        return this.doInsert(i, obj);
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

List.prototype.index = function(obj, test) {
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

MutableList.prototype.add = function(...objs) {
    if ( objs.length !== 0 ) {
        this.countModification();
        this.doAdd(objs);
    }
};

MutableList.prototype.doAdd = function(objs) {
    throw new Error("MutableList does not implement doAdd().");
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
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( node === null ) {
        throw new Error("Invalid node.");
    } else {
        this.doInsertBefore(node, obj);
    }
};

LinkedList.prototype.doInsertBefore = function(node, obj) {
    throw new Error("LinkedList does not implement doInsertBefore().");
};

LinkedList.prototype.insertAfter = function(node, obj) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( node === null ) {
        throw new Error("Invalid node.");
    } else {
        this.doInsertAfter(node, obj);
    }
};

LinkedList.prototype.doInsertAfter = function(node, obj) {
    throw new Error("LinkedList does not implement doInsertAfter().");
};

LinkedList.prototype.deleteNode = function(doomed) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( doomed === null ) {
        throw new Error("Invalid node.");
    } else {
        return this.doDeleteNode(doomed);
    }
};

LinkedList.prototype.doDeleteNode = function(doomed) {
    throw new Error("LinkedList does not implement doDeleteNode().");
};

LinkedList.prototype.deleteChild = function(parent) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( parent === null ) {
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

MutableLinkedList.prototype.add = function(...objs) {
    if ( objs.length !== 0 ) {
        this.countModification();
        this.doAdd(objs);
    }
};

MutableLinkedList.prototype.doAdd = function(objs) {
    throw new Error("MutableLinkedList does not implement doAdd().");
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

ArrayList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    return this.store.find((elt) => test(obj, elt))  ||  null;
};

ArrayList.prototype.doAdd = function(objs) {
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

ArrayList.prototype.index = function(obj, test = (item, elt) => item === elt) {
    return this.store.findIndex((elt) => test(obj, elt));
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
    MutableLinkedList.call(this, fillElt);
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

SinglyLinkedList.prototype.doClear = function() {
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

SinglyLinkedList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    return Node.contains(this.front, obj, test);
};

SinglyLinkedList.prototype.doAdd = function(objs) {
    function addNodes(self, objs) { // ????
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
        addNodes(this, objs.slice(1));
    } else {
        addNodes(this, objs);
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

SinglyLinkedList.prototype.index = function(obj, test = (item, elt) => item === elt) {
    function nodeIndex(node, i) {
        if ( node === null ) {
            return null;
//        } else if ( node.first() === obj) {
        } else if ( test(obj, node.first()) ) {
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
    
//
//     SinglyLinkedListIterator
//
function SinglyLinkedListIterator(collection) {
    MutableCollectionIterator.call(this, collection);
    this.cursor = collection.front;
};

SinglyLinkedListIterator.prototype = Object.create(MutableCollectionIterator.prototype);
SinglyLinkedListIterator.prototype.constructor = SinglyLinkedListIterator;
Object.defineProperty(SinglyLinkedListIterator.prototype, "constructor", {enumerable: false, configurable: false});

SinglyLinkedListIterator.prototype.doDoCurrent = function() {
    return this.cursor.first();
};

SinglyLinkedListIterator.prototype.doIsDone = function() {
    return this.cursor === null;
};

SinglyLinkedListIterator.prototype.doNext = function() {
    if ( this.isDone() ) {
        return null;
    } else {
        this.cursor = this.cursor.rest();
        
        if ( this.isDone() ) {
            return null;
        } else {
            return this.current();
        }
    }
};

//
//     Dcons
//
function Dcons(content) {
    this.content = content;
    this.previous = null;
    this.next = null;
}

Dcons.prototype.getContent = function() {
    return this.content;
};

Dcons.prototype.setContent = function(obj) {
    return this.content = obj;
};

Dcons.prototype.getPrevious = function() {
    return this.previous;
};

Dcons.prototype.setPrevious = function(node) {
    return this.previous = node;
};

Dcons.prototype.getNext = function() {
    return this.next;
};

Dcons.prototype.setNext = function(node) {
    return this.next = node;
};

Dcons.prototype.link = function(node) {
    this.setNext(node);
    node.setPrevious(this);
};

Dcons.prototype.toString = function() {
    function printPrevious(node) {
        if ( node.getPrevious() === null ) {
            return "∅ ← ";
        } else if ( node === node.getPrevious() ) {
            return "↻ ";
        } else {
            return node.getPrevious().getContent() + " ← ";
        }
    }

    function printNext(node) {
        if ( node.getNext() === null ) {
            return " → ∅";
        } else if ( node === node.getNext() ) {
            return " ↺";
        } else {
            return " → " + node.getNext().getContent();
        }
    }

    return printPrevious(this) + this.getContent() + printNext(this);
};

Dcons.prototype.spliceBefore = function(obj) {
    let newDcons = new Dcons(obj);
    this.getPrevious().link(newDcons);
    newDcons.link(this);
};

Dcons.prototype.spliceAfter = function(obj) {
    let newDcons = new Dcons(obj);
    newDcons.link(this.getNext());
    this.link(newDcons);
};

Dcons.prototype.exciseNode = function() {
    if ( this === this.getNext() ) {
        throw new Error("Cannot delete sole node.");
    } else {
        this.getPrevious().link(this.getNext());
    }

    return this.getContent();
};

Dcons.prototype.exciseChild = function() {
    let child = this.getNext();

    if ( this === child ) {
        throw new Error("Parent must have child node");
    } else {
        this.link(child.getNext());
    }

    return child.getContent();
};

//
//     Dcursor
//
function Dcursor(list) {
    this.list = list;
    this.node = this.list.store; // ??
    this.index = 0;
}

Dcursor.prototype.isInitialized = function() {
    return this.node !== null;
};

Dcursor.prototype.reset = function() {
    this.node = this.list.store;
    this.index = 0;
};

Dcursor.prototype.atStart = function() {
    return !this.isInitialized() || this.index === 0;
};

Dcursor.prototype.atEnd = function() {
    return !this.isInitialized() || this.index === this.size() - 1;
};

Dcursor.prototype.advance = function(step = 1) {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        for (let i = 0; i < step; i++) {
            this.index++;
            this.node = this.node.getNext();
        }
//        this.index = this.index % this.list.size();
        this.index = mod(this.index, this.list.size());
    }
};

Dcursor.prototype.rewind = function(step = 1) {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        for (let i = 0; i < step; i++) {
            this.index--;
            this.node = this.node.getPrevious();
        }
//        this.index = this.index % this.list.size(); // Wrong for negative index!!! % is REM not MOD!!
        this.index = mod(this.index, this.list.size());
    }
};

//
//    This can allow DCURSOR to get out of sync!
//    
Dcursor.prototype.bump = function() {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        this.node = this.node.getNext();
    }
};

//
//     DoublyLinkedList
//
function DoublyLinkedList(fillElt) {
    MutableLinkedList.call(this, fillElt);
    this.store = null;
    this.count = 0;
    this.cursor = new Dcursor(this);
}

DoublyLinkedList.prototype = Object.create(MutableLinkedList.prototype);
DoublyLinkedList.prototype.constructor = DoublyLinkedList;
Object.defineProperty(DoublyLinkedList.prototype, "constructor", {enumerable: false, configurable: false});

DoublyLinkedList.prototype.size = function() {
    return this.count;
};

DoublyLinkedList.prototype.isEmpty = function() {
    return this.store === null;
};

//
//     Break all of the links to prevent memory leak!
//     
DoublyLinkedList.prototype.doClear = function() {
    let dcons = this.store;
    for (let i = 0; i < this.size(); i++) {
        dcons.setPrevious(null);
        dcons = dcons.getNext();
    }

    this.store.setNext(null);
    this.store = null;
    this.count = 0;
    this.cursor.reset();
};

DoublyLinkedList.prototype.iterator = function() {
    return new DoublyLinkedListIterator(this);
};

// (defmethod list-iterator ((l doubly-linked-list) &optional (start 0))
//   (make-instance 'doubly-linked-list-list-iterator :list l :start start))

DoublyLinkedList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    let count = this.count;
    function findObject(dcons, i) {
        if ( i === count ) {
            return null;
        } else if ( test(obj, dcons.getContent()) ) {
            return dcons.getContent();
        } else {
            return findObject(dcons.getNext(), i + 1);
        }
    }

    return findObject(this.store, 0);
};

DoublyLinkedList.prototype.doAdd = function(objs) {
    function addNodes(head, start, objs) {
        let dcons = start;
        for (let i = 0; i < objs.length; i++) {
            dcons.link(new Dcons(objs[i]));
            dcons = dcons.getNext();
        }

        dcons.link(head);
    }

    let dcons = new Dcons(objs[0]);
    
    if ( this.isEmpty() ) {
        this.store = dcons;
    } else {
        let tail = this.store.getPrevious();
        tail.link(dcons);
    }

    addNodes(this.store, dcons, objs.slice(1));
    this.count += objs.length;

    if ( !this.cursor.isInitialized() ) {
        this.cursor.reset();
    }
};

DoublyLinkedList.prototype.nthDcons = function(i) {
    if ( i < 0  ||  i >= this.size() ) {
        throw new Error(`Invalid index: ${i}`);
    } else if ( this.isEmpty() ) {
        throw new Error("List is empty");
    } else if ( i === 0 ) {
        return this.store;
    } else if ( i === this.cursor.index ) {
        return this.cursor.node;
    } else if ( i < this.cursor.index / 2 ) {
        this.cursor.reset();
        this.cursor.advance(i);
        return this.cursor.node;
    } else if ( i < this.cursor.index ) {
        this.cursor.rewind(this.cursor.index - i);
        return this.cursor.node;
    } else if ( i <= (this.count + this.cursor.index) / 2 ) {
        this.cursor.advance(i - this.cursor.index);
        return this.cursor.node;
    } else {
        this.cursor.reset();
        this.cursor.rewind(this.count - i);
        return this.cursor.node;
    }
};

function isBetweenInclusive(i, low, high) {
    return low <= i  &&  i <= high;
}

DoublyLinkedList.prototype.doDoInsert = function(i, obj) {
    this.nthDcons(i).spliceBefore(obj);

    if ( i === 0 ) {
        this.store = this.store.getPrevious();
    }

    this.count++;

    if ( !this.cursor.isInitialized()  ||
         isBetweenInclusive(i, 0, this.cursor.index)  ||
         (i < 0  &&  isBetweenInclusive(i+this.count, 0, this.cursor.index)) ) {
        this.cursor.reset();
    }
};

DoublyLinkedList.prototype.doDoInsertBefore = function(node, obj) {
    node.spliceBefore(obj)

    if ( node === this.store ) {
        this.store = this.store.getPrevious();
    }

    this.count++;
    this.cursor.index++;
};

DoublyLinkedList.prototype.doDoInsertAfter = function(node, obj) {
    node.spliceAfter(obj)

    this.count++;
};

DoublyLinkedList.prototype.doDoDelete = function(i) {
    let doomed = this.deleteDcons(this.nthDcons(i));

    this.count--;
    this.cursor.reset();

    return doomed;
};

DoublyLinkedList.prototype.doDoDeleteNode = function(doomed) {
    let result = this.deleteDcons(doomed);

    this.count--;
    this.cursor.reset();

    return result;
};

DoublyLinkedList.prototype.deleteDcons = function(doomed) {
    if ( doomed === doomed.getNext() ) {
        doomed.setNext(null);
        this.store = null;

        return doomed.getContent();
    } else {
        let result = doomed.exciseNode();
        if ( doomed === this.store ) {
            this.store = doomed.getNext();
        }

        return result;
    }
};

//
//    This is not really needed for DoublyLinkedList.
//    
DoublyLinkedList.prototype.doDoDeleteChild = function(parent) {
    let child = parent.getNext();

    if ( child === this.store ) {
        throw new Error("Parent must have child node");
    } else {
        let result = parent.exciseChild();

        this.count--;
        this.cursor.reset();

        return result;
    }
};

DoublyLinkedList.prototype.index = function(obj, test = (item, elt) => item === elt) {
    let dcons = this.store;

    for (let i = 0; i < this.size(); i++) {
        if ( test(obj, dcons.getContent()) ) {
            return i;
        }

        dcons = dcons.getNext();
    }

    return -1;
}

DoublyLinkedList.prototype.subseq = function(start, end) {
    let result = [];

    if ( start < end ) {
        let dcons = this.nthDcons(start);

        for (let i = start; i < end; i++) {
            result.push(dcons.getContent());
            dcons = dcons.getNext();
        }
    }

    return result;
};
        
DoublyLinkedList.prototype.doSlice = function(i, n) {
    let dll = new DoublyLinkedList(this.fillElt);
    dll.add(...this.subseq(Math.min(i, this.count), Math.min(i+n, this.count)));
    return dll;
};

DoublyLinkedList.prototype.doGet = function(i) {
    return this.nthDcons(i).getContent();
};

DoublyLinkedList.prototype.doSet = function(i, obj) {
    this.nthDcons(i).setContent(obj);
};






//
//     DoublyLinkedListIterator
//
function DoublyLinkedListIterator(collection) {
    MutableCollectionIterator.call(this, collection);
    this.cursor = new Dcursor(collection);
    this.sealedForYourProtection = true;
};

DoublyLinkedListIterator.prototype = Object.create(MutableCollectionIterator.prototype);
DoublyLinkedListIterator.prototype.constructor = DoublyLinkedListIterator;
Object.defineProperty(DoublyLinkedListIterator.prototype, "constructor", {enumerable: false, configurable: false});

DoublyLinkedListIterator.prototype.doDoCurrent = function() {
    return this.cursor.node.getContent();
};

DoublyLinkedListIterator.prototype.doIsDone = function() {
    return !this.cursor.isInitialized()  ||
        (!this.sealedForYourProtection  &&  this.cursor.atStart());
};

DoublyLinkedListIterator.prototype.doNext = function() {
    if ( this.isDone() ) {
        return null;
    } else {
        this.cursor.advance();
        this.sealedForYourProtection = false;

        if ( this.isDone() ) {
            return null;
        } else {
            return this.current();
        }
    }
};

//
//     HashTableList
//     


//
//     PersistentList
//
function PersistentList(fillElt) {
    List.call(this, fillElt);
    this.store = null;
    this.count = 0;
}

PersistentList.prototype = Object.create(List.prototype);
PersistentList.prototype.constructor = PersistentList;
Object.defineProperty(PersistentList.prototype, "constructor", {enumerable: false, configurable: false});

PersistentList.initializeList = function(fillElt, store, count) {
    let pl = new PersistentList(fillElt);
    pl.store = store;
    pl.count = count;

    return pl;
};

PersistentList.prototype.toString = function() {
    let result = "(";
    if ( !this.isEmpty() ) {
        let i = this.iterator();
        result += i.current();
        i = i.next();    
        while ( !i.isDone() ) {
            result += ` ${i.current()}`;
            i = i.next();
        }
    }
    
    result += ")";

    return result;
};
    

// (defun make-persistent-list (&key (type t) (fill-elt nil))
//   (make-instance 'persistent-list :type type :fill-elt fill-elt))

// (defmethod equals ((l1 list) (l2 persistent-list) &key (test #'eql))
//   (equals l2 l1 :test #'(lambda (x y) (funcall test y x))))
// (defmethod equals ((l1 persistent-list) (l2 list) &key (test #'eql))
//   (if (= (size l1) (size l2))
//       (let ((i2 (iterator l2)))
//         (loop for i1 = (iterator l1) then (next i1)
//               do (cond ((done i1) (return (done i2)))
//                        ((done i2) (return nil))
//                        ((funcall test (current i1) (current i2)) (next i2))
//                        (t (return nil)))) )
//       nil))
// (defmethod equals ((l1 persistent-list) (l2 persistent-list) &key (test #'eql))
//   (if (= (size l1) (size l2))
//       (loop for i1 = (iterator l1) then (next i1)
//             for i2 = (iterator l2) then (next i2)
//             do (cond ((done i1) (return (done i2)))
//                      ((done i2) (return nil))
//                      ((not (funcall test (current i1) (current i2))) (return nil))))
//       nil))

// (defmethod each ((l persistent-list) op)
//   (loop for i = (iterator l) then (next i)
//         until (done i)
//         do (funcall op (current i))))

PersistentList.prototype.size = function() {
    return this.count;
};

PersistentList.prototype.isEmpty = function() {
    return this.store === null;
};

PersistentList.prototype.clear = function() {
    return new PersistentList(this.fillElt);
};

PersistentList.prototype.iterator = function() {
    return new PersistentListIterator(this);
};

// (defmethod list-iterator ((l persistent-list) &optional (start 0))
//   (make-instance 'persistent-list-list-iterator :list l :cursor (slot-value l 'store) :start start))

PersistentList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    return Node.contains(this.store, obj, test);
};

//
//     Consider iterative implementation. 见 doInsert
//     
PersistentList.prototype.add = function(...objs) {
    if ( objs.length === 0 ) {
        return this;
    } else {
        let node = null;

        for (let i = objs.length-1; i >= 0; i--) {
            node = new Node(objs[i], node);
        }
      
        return PersistentList.initializeList(this.fillElt, Node.append(this.store, node), this.count + objs.length);
    }
}

//
//     "Around" method ensures that we do not go past end of list.
//     
PersistentList.prototype.doInsert = function(i, obj) {
    let front = null;
    let rear = null;
    let node = this.store;

    for (let j = 0; j < i; j++) {
        let newNode = new Node(node.first(), null);

        if ( front === null ) {
            rear = front = newNode;
        } else {
            rear.setRest(newNode);
            rear = rear.rest();
        }

        node = node.rest();
    }

    let tail = new Node(obj, node);

    if ( front === null ) {
        front = tail;
    } else {
        rear.setRest(tail);
    }

    return PersistentList.initializeList(this.fillElt, front, this.count + 1);

    // return PersistentList.initializeList(this.fillElt,
    //                                      Node.append(Node.sublist(this.store, 0, i),
    //                                                  new Node(obj, Node.nthCdr(this.store, i))),
    //                                      this.count + 1);
};
        
PersistentList.prototype.delete = function(i) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty"); // ??
    } else if ( i >= this.size() ) {
        return this;
    } else if ( i < -this.size() ) {
        return this;
    } else {
        return List.prototype.delete.call(this, i);
    }
};

PersistentList.prototype.doDelete = function(i) {
    let front = null;
    let rear = null;
    let node = this.store;

    for (let j = 0; j < i; j++) {
        let newNode = new Node(node.first(), null);

        if ( front === null ) {
            rear = front = newNode;
        } else {
            rear.setRest(newNode);
            rear = rear.rest();
        }

        node = node.rest();
    }

    let tail = node.rest();

    if ( front === null ) {
        front = tail;
    } else {
        rear.setRest(tail);
    }

    return PersistentList.initializeList(this.fillElt, front, this.count - 1);
};    

  //         ((>= i (size l)) l)
  //         ((< i (- (size l))) l)
  //         (t (call-next-method))))
  // (defmethod delete ((l persistent-list) (i integer))
  //   (with-slots (type fill-elt store count) l
  //     (multiple-value-bind (new-store doomed)
  //         (loop for elt in store
  //               for tail on store
  //               repeat i ; This must be here.
  //               collect elt into elts
  //               finally (return (values (nconc elts (rest tail)) elt)))
  //       (values (initialize-list type fill-elt new-store (1- count)) doomed))))

PersistentList.prototype.doGet = function(i) {
    return Node.nth(this.store, i);
};

//
//     PersistentListIterator
//     
function PersistentListIterator(collection) {
    this.collection = collection;
}

PersistentListIterator.prototype = Object.create(Iterator.prototype);
PersistentListIterator.prototype.constructor = PersistentListIterator;
Object.defineProperty(PersistentListIterator.prototype, "constructor", {enumerable: false, configurable: false});

PersistentListIterator.prototype.isDone = function() {
    return this.collection.isEmpty();
};

PersistentListIterator.prototype.doCurrent = function() {
    return this.collection.get(0);
};

PersistentListIterator.prototype.next = function() {
    if ( this.isDone() ) {
        return this;
    } else {
        return new PersistentListIterator(this.collection.delete(0));
    }
};
