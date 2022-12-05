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
//    Check for integer index?! insert()/delete()/get()/set()...
//    DoublyLinkedList (for example) must initialize some fields before calling
//        super constructor?! Dcursor needs to have `store` set first!
//    
//////////////////////////////////////////////////////////////////////////////
"use strict";

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
    if ( list instanceof PersistentList ) {
        return list.equals(this, (x, y) => test(y, x));
    } else if ( this.size() === list.size() ) {
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
        op(i.current());
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
    if ( objs.length === 0 ) {
        return this;
    } else {
        return this.doAdd(objs);
    }
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

List.prototype.index = function(obj, test = (item, elt) => item === elt) {
    let iterator = this.iterator();
    let i = 0;

    while ( !iterator.isDone() ) {
        let elt = iterator.current();

        if ( test(obj, elt) ) {
            return i;
        }

        iterator.next();
        i++;
    }

    return null;
};

List.prototype.slice = function(i, n) {
    if ( i < 0 ) {
        let j = i + this.size();
        if ( j < 0 ) {
            return this.slice(0, 0);
        } else {
            return this.slice(j, n);
        }
    } else if ( n === undefined ) {
        return this.doSlice(i, this.size() - i);
    } else if ( n < 0 ) {
        throw new Error(`Count \`n\` must be non-negative: ${n}`);
    } else {
        return this.doSlice(i, n);
    }
};

List.prototype.doSlice = function(i, n) {
    let slice = this.makeEmptyList();
    let count = this.size();

    return slice.add(...this.subseq(Math.min(i, count), Math.min(i+n, count)));
};

List.prototype.reverse = function() {
    let reversed = [];
    this.each(elt => reversed.unshift(elt));
    return this.makeEmptyList().add(...reversed);
};

List.prototype.makeEmptyList = function() {
    throw new Error("List does not implement makeEmptyList().");
};

List.prototype.subseq = function(start, end) {
    throw new Error("List does not implement subseq().");
};

//
//    For testing...
//    
List.prototype.fill = function({count = 1000, generator = x => x} = {}) {
    return this.add(...[...Array(count)].map((_,i) => generator(i+1)));
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

MutableList.prototype.countModification = function() {
    this.modificationCount++;
};

MutableList.prototype.clear = function() {
    this.countModification();
    this.doClear();
};

MutableList.prototype.doClear = function() {
    throw new Error("MutableList does not implement doClear().");
};

// MutableList.prototype.reverse = function() {
//     this.countModification();
//     this.doReverse();
// };

// MutableList.prototype.doReverse = function() {
//     throw new Error("MutableList does not implement doReverse().");
// };

MutableList.prototype.doAdd = function(objs) {
    this.countModification();
    return this.addElements(objs);
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
//    MutableLinkedList
//
function MutableLinkedList(fillElt) {
    MutableList.call(this, fillElt);
}

MutableLinkedList.prototype = Object.create(MutableList.prototype);
MutableLinkedList.prototype.constructor = MutableLinkedList;
Object.defineProperty(MutableLinkedList.prototype, "constructor", {enumerable: false, configurable: false});

MutableLinkedList.prototype.insertBefore = function(node, obj) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( node === null ) {
        throw new Error("Invalid node.");
    } else {
        this.doInsertBefore(node, obj);
        this.countModification();
    }
};

MutableLinkedList.prototype.doInsertBefore = function(node, obj) {
    throw new Error("MutableLinkedList does not implement doInsertBefore().");
};

MutableLinkedList.prototype.insertAfter = function(node, obj) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( node === null ) {
        throw new Error("Invalid node.");
    } else {
        this.doInsertAfter(node, obj);
        this.countModification();
    }
};

MutableLinkedList.prototype.doInsertAfter = function(node, obj) {
    throw new Error("MutableLinkedList does not implement doInsertAfter().");
};

MutableLinkedList.prototype.deleteNode = function(doomed) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( doomed === null ) {
        throw new Error("Invalid node.");
    } else {
        let result = this.doDeleteNode(doomed);
        this.countModification();

        return result;
    }
};

MutableLinkedList.prototype.doDeleteNode = function(doomed) {
    throw new Error("MutableLinkedList does not implement doDeleteNode().");
};

MutableLinkedList.prototype.deleteChild = function(parent) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( parent === null ) {
        throw new Error("Invalid node.");
    } else {
        let child = this.doDeleteChild(parent);
        this.countModification();

        return child;
    }
};

MutableLinkedList.prototype.doDeleteChild = function(parent) {
    throw new Error("MutableLinkedList does not implement doDeleteChild().");
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

ArrayList.prototype.makeEmptyList = function() {
    return new ArrayList(this.fillElt);
};

ArrayList.prototype.size = function() {
    return this.store.length;
};

ArrayList.prototype.isEmpty = function() {
    return this.store.length === 0;
};

ArrayList.prototype.iterator = function() {
    let list = this;  // Still necessary???
    return new MutableCollectionIterator(Cursor.makeRandomAccessListCursor(list),
                                         () => list.modificationCount);
};
    
ArrayList.prototype.listIterator = function(start = 0) {
    let list = this;

    return new RandomAccessListListIterator(this, () => list.modificationCount, start);
};

ArrayList.prototype.doClear = function() {
    this.store = [];
};

ArrayList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    return this.store.find((elt) => test(obj, elt))  ||  null;
};

ArrayList.prototype.addElements = function(objs) {
    this.store = this.store.concat(objs);
    return this;
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
    let i = this.store.findIndex((elt) => test(obj, elt));
    return i < 0 ? null : i;
};

ArrayList.prototype.subseq = function(start, end) {
    return this.store.slice(start, end);
}

ArrayList.prototype.reverse = function() {
    return this.makeEmptyList().add(...[...this.store].reverse()); // !!!!!
}

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

SinglyLinkedList.prototype.makeEmptyList = function() {
    return new SinglyLinkedList(this.fillElt);
};

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
    let list = this;
    return new MutableCollectionIterator(Cursor.makeSinglyLinkedListCursor(list.front),
                                         () => list.modificationCount);
};

SinglyLinkedList.prototype.listIterator = function(start = 0) {
    let list = this;

    return new SinglyLinkedListListIterator(this, () => list.modificationCount, () => list.front, start);
};

SinglyLinkedList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    return Node.contains(this.front, obj, test);
};

SinglyLinkedList.prototype.addElements = function(objs) {
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

    return this;
};

SinglyLinkedList.prototype.doDoInsert = function(i, obj) {
    let node = Node.nthCdr(this.front, i);
    node.spliceBefore(obj);

    if ( node === this.rear ) {
        this.rear = this.rear.rest();
    }

    this.count++;
};

SinglyLinkedList.prototype.doInsertBefore = function(node, obj) {
    node.spliceBefore(obj);

    if ( node === this.rear ) {
        this.rear = this.rear.rest();
    }

    this.count++;
};

SinglyLinkedList.prototype.doInsertAfter = function(node, obj) {
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

SinglyLinkedList.prototype.doDeleteNode = function(doomed) {
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

SinglyLinkedList.prototype.doDeleteChild = function(parent) {
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
    return Node.index(this.front, obj, test);
};

SinglyLinkedList.prototype.subseq = function(start, end) {
    return Node.subseq(this.front, start, end);
}

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
    this.content = obj;
};

Dcons.prototype.getPrevious = function() {
    return this.previous;
};

Dcons.prototype.setPrevious = function(node) {
    this.previous = node;
};

Dcons.prototype.getNext = function() {
    return this.next;
};

Dcons.prototype.setNext = function(node) {
    this.next = node;
};

Dcons.prototype.link = function(node) {
    this.setNext(node);
    node.setPrevious(this);
};

Dcons.prototype.unlink = function() {
    this.setNext(null);
    this.setPrevious(null);
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
function Dcursor(head, size, previous, next) {
    this.head = head;
    this.size = size;
    this.node = this.head();
    this.index = 0;
    this.previous = previous;
    this.next = next;
}

//
//    Only possible to be undefined if setupCursor() is called before `store` is initialized.
//    See DoublyLinkedList()/DcursorList()!
//    
Dcursor.prototype.isInitialized = function() {
    return this.node !== null;
//    return this.node !== undefined && this.node !== null;
};

Dcursor.prototype.reset = function() {
    this.node = this.head();
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
            this.node = this.next(this.node); // ????????????
        }
//        this.index = this.index % this.list.size();
        this.index = mod(this.index, this.size());
    }
};

Dcursor.prototype.rewind = function(step = 1) {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        for (let i = 0; i < step; i++) {
            this.index--;
            this.node = this.previous(this.node);
        }
//        this.index = this.index % this.list.size(); // Wrong for negative index!!! % is REM not MOD!!
        this.index = mod(this.index, this.size());
    }
};

//
//    These can allow DCURSOR to get out of sync!
//    
Dcursor.prototype.bump = function() {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        this.node = this.next(this.node);
    }
};

Dcursor.prototype.nudge = function() {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        this.index++;
    }
};

//
//     DcursorB
//
function DcursorB(head, size, previous, next) {
    Dcursor.call(this, head, size, previous, next);
}

DcursorB.prototype = Object.create(Dcursor.prototype);
DcursorB.prototype.constructor = DcursorB;
Object.defineProperty(DcursorB.prototype, "constructor", {enumerable: false, configurable: false});

DcursorB.prototype.advance = function(step = 1) {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        for (let i = 0; i < step; i++) {
            this.index++;
            this.node = this.previous(this.node);
        }

        this.index = mod(this.index, this.size());
    }
};

DcursorB.prototype.rewind = function(step = 1) {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        for (let i = 0; i < step; i++) {
            this.index--;
            this.node = this.next(node);
        }

        this.index = mod(this.index, this.size());
    }
};

DcursorB.prototype.bump = function() {
    if ( !this.isInitialized() ) {
        throw new Error("Cursor has not been initialized");
    } else {
        this.node = this.node.getPrevious();
    }
};

//
//     DcursorList
//
function DcursorList(fillElt) {
    MutableLinkedList.call(this, fillElt);
    
    this.cursor = this.setupCursor();
}

DcursorList.prototype = Object.create(MutableLinkedList.prototype);
DcursorList.prototype.constructor = DcursorList;
Object.defineProperty(DcursorList.prototype, "constructor", {enumerable: false, configurable: false});

DcursorList.prototype.setupCursor = function() {
    throw new Error("DcursorList does not implement setupCursor().");
};

DcursorList.prototype.nthDllNode = function(n) {
    function repositionCursor(cursor, i, count) {
        if ( i === 0 ) {
            cursor.reset();
        } else if ( i < cursor.index ) {
            let indexDelta = cursor.index - i;
            let startDelta = i;

            if ( startDelta < indexDelta ) {
                cursor.reset();
                cursor.advance(startDelta);
            } else {
                cursor.rewind(indexDelta);
            }
        } else if ( i > cursor.index ) {
            let indexDelta = i - cursor.index;
            let endDelta = count - i;

            if ( indexDelta <= endDelta ) {
                cursor.advance(indexDelta);
            } else {
                cursor.reset();
                cursor.rewind(endDelta);
            }
        }
    }

    let count = this.size();
    if ( this.isEmpty() ) {
        throw new Error("List is empty");
    } else if ( n < 0  ||  n >= count ) {
        throw new Error(`Invalid index: ${n}`);
    } else {
        repositionCursor(this.cursor, n, count);

        return this.cursor.node;
    }
};

DcursorList.prototype.doGet = function(i) {
    return this.nthDllNode(i).getContent();
};

DcursorList.prototype.doSet = function(i, obj) {
    this.nthDllNode(i).setContent(obj);
};

DcursorList.prototype.addElements = function(objs) {
    this.doAddElements(objs);
    
    if ( !this.cursor.isInitialized() ) {
        this.cursor.reset();
    }

    return this;
};

DcursorList.prototype.doAddElements = function(objs) {
    throw new Error("DcursorList does not implement doAddElements().");
};

DcursorList.prototype.doDoInsert = function(i, obj) {
    this.insertElement(i, obj);
    
    if ( !this.cursor.isInitialized()  ||
         isBetweenInclusive(i, 0, this.cursor.index)  ||
         (i < 0  &&  isBetweenInclusive(i+this.count, 0, this.cursor.index)) ) {
        this.cursor.reset();
    }
};

DcursorList.prototype.insertElement = function(i, obj) {
    throw new Error("DcursorList does not implement insertElement().");
};

DcursorList.prototype.doDoDelete = function(i) {
    let doomed = this.deleteElement(i);

    this.cursor.reset();

    return doomed;
};

DcursorList.prototype.deleteElement = function(i) {
    throw new Error("DcursorList does not implement deleteElement().");
};

DcursorList.prototype.doInsertBefore = function(node, obj) {
    this.insertEltBefore(node, obj);

    this.cursor.reset();
};

DcursorList.prototype.insertEltBefore = function(node, obj) {
    throw new Error("DcursorList does not implement insertEltBefore().");
};

DcursorList.prototype.doInsertAfter = function(node, obj) {
    this.insertEltAfter(node, obj);

    this.cursor.reset();
};

DcursorList.prototype.insertEltAfter = function(node, obj) {
    throw new Error("DcursorList does not implement insertEltAfter().");
};

DcursorList.prototype.doDeleteNode = function(doomed) {
    let result = this.deleteThisNode(doomed);

    this.cursor.reset();

    return result;
};

DcursorList.prototype.deleteThisNode = function(doomed) {
    throw new Error("DcursorList does not implement deleteThisNode().");
};

DcursorList.prototype.doDeleteChild = function(parent) {
    let result = this.deleteChildNode(parent);

    this.cursor.reset();

    return result;
};

DcursorList.prototype.deleteChildNode = function(parent) {
    throw new Error("DcursorList does not implement deleteChildNode().");
};


//
//     DoublyLinkedList
//
function DoublyLinkedList(fillElt) {
    this.store = null; // Must initialize store before calling setupCursor()!
    this.count = 0;
    DcursorList.call(this, fillElt);
}

DoublyLinkedList.prototype = Object.create(DcursorList.prototype);
DoublyLinkedList.prototype.constructor = DoublyLinkedList;
Object.defineProperty(DoublyLinkedList.prototype, "constructor", {enumerable: false, configurable: false});

DoublyLinkedList.prototype.setupCursor = function() {
    let list = this;
    
    return new Dcursor(() => list.store,
                       () => list.count,
//                       Dcons.prototype.getPrevious, // No `this` context?!?!
                       (node) => node.getPrevious(),
                       (node) => node.getNext());
//                       Dcons.prototype.getNext);
};

DoublyLinkedList.prototype.makeEmptyList = function() {
    return new DoublyLinkedList(this.fillElt);
};

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
    if ( !this.isEmpty() ) {
        let dcons = this.store;
        for (let i = 0; i < this.size(); i++) {
            dcons.setPrevious(null);
            dcons = dcons.getNext();
        }
        
        this.store.setNext(null);
        this.store = null;
        this.count = 0;
        this.cursor.reset();
    }
};

DoublyLinkedList.prototype.iterator = function() {
    let list = this;

    return new MutableCollectionIterator(Cursor.makeDcursorListCursor(list.setupCursor()),
                                         () => list.modificationCount);
};

DoublyLinkedList.prototype.listIterator = function(start = 0) {
    let list = this;

    return new DoublyLinkedListListIterator(this, () => list.modificationCount, () => list.setupCursor(), start);
};

// DoublyLinkedList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
//     let count = this.count;
//     function findObject(dcons, i) {
//         if ( i === count ) {
//             return null;
//         } else if ( test(obj, dcons.getContent()) ) {
//             return dcons.getContent();
//         } else {
//             return findObject(dcons.getNext(), i + 1);
//         }
//     }

//     return findObject(this.store, 0);
// };

DoublyLinkedList.prototype.doAddElements = function(objs) {
    let list = this;
    function addNodes(start) {
        let dcons = start;
        for (let i = 1; i < objs.length; i++) {
            dcons.link(new Dcons(objs[i]));
            dcons = dcons.getNext();
        }

        dcons.link(list.store);
        list.count += objs.length;
    }

    let dcons = new Dcons(objs[0]);
    
    if ( this.isEmpty() ) {
        this.store = dcons;
    } else {
        this.store.getPrevious().link(dcons);
    }

    addNodes(dcons);

    return this;
};

function isBetweenInclusive(i, low, high) {
    return low <= i  &&  i <= high;
}

DoublyLinkedList.prototype.insertElement = function(i, obj) {
    this.nthDllNode(i).spliceBefore(obj);

    if ( i === 0 ) {
        this.store = this.store.getPrevious();
    }

    this.count++;
};

DoublyLinkedList.prototype.insertEltBefore = function(node, obj) {
    this.doInsertEltBefore(node, obj);
    
    this.count++;
};

DoublyLinkedList.prototype.doInsertEltBefore = function(node, obj) {
    node.spliceBefore(obj);

    if ( node === this.store ) {
        this.store = this.store.getPrevious();
    }
};

DoublyLinkedList.prototype.insertEltAfter = function(node, obj) {
    this.doInsertEltAfter(node, obj);

    this.count++;
};

DoublyLinkedList.prototype.doInsertEltAfter = function(node, obj) {
    node.spliceAfter(obj);
};

DoublyLinkedList.prototype.deleteElement = function(i) {
    let doomed = this.deleteDcons(this.nthDllNode(i));

    this.count--;

    return doomed;
};

DoublyLinkedList.prototype.deleteThisNode = function(doomed) {
    let result = this.deleteDcons(doomed);

    this.count--;

    return result;
};

DoublyLinkedList.prototype.deleteDcons = function(doomed, resetStore = (node) => { return node.getNext(); }) {
    if ( doomed === doomed.getNext() ) {
        doomed.unlink();
        this.store = null;

        return doomed.getContent();
    } else {
        let result = doomed.exciseNode();
        if ( doomed === this.store ) {
            this.store = resetStore(doomed);
        }

        return result;
    }
};

//
//    This is not really needed for DoublyLinkedList.
//    
DoublyLinkedList.prototype.deleteChildNode = function(parent) {
    let result = this.doDeleteChildNode(parent);

    this.count--;

    return result;
};

DoublyLinkedList.prototype.doDeleteChildNode = function(parent) {
    let child = parent.getNext();

    if ( child === this.store ) {
        throw new Error("Parent must have child node");
    } else {
        return parent.exciseChild();
    }
};

// DoublyLinkedList.prototype.index = function(obj, test = (item, elt) => item === elt) {
//     let dcons = this.store;

//     for (let i = 0; i < this.size(); i++) {
//         if ( test(obj, dcons.getContent()) ) {
//             return i;
//         }

//         dcons = dcons.getNext();
//     }

// //    return -1;
//     return null;
// }

DoublyLinkedList.prototype.subseq = function(start, end) {
    let result = [];

    if ( start < end ) {
        let dcons = this.nthDllNode(start);

        for (let i = start; i < end; i++) {
            result.push(dcons.getContent());
            dcons = dcons.getNext();
        }
    }

    return result;
};
        
//
//     DoublyLinkedListRatchet
//
function DoublyLinkedListRatchet(fillElt, direction = DoublyLinkedListRatchet.Direction.Forward) {
    this.direction = direction;
    DoublyLinkedList.call(this, fillElt);
}

DoublyLinkedListRatchet.prototype = Object.create(DoublyLinkedList.prototype);
DoublyLinkedListRatchet.prototype.constructor = DoublyLinkedListRatchet;
Object.defineProperty(DoublyLinkedListRatchet.prototype, "constructor", {enumerable: false, configurable: false});

DoublyLinkedListRatchet.Direction = enumeration({Forward: 0, Backward: 1});

DoublyLinkedListRatchet.prototype.setupCursor = function() {
    let list = this;
    
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            return new Dcursor(() => list.store,
                               () => list.count,
                               (node) => node.getPrevious(),
                               (node) => node.getNext());
        case DoublyLinkedListRatchet.Direction.Backward:
            return new DcursorB(() => list.store,
                                () => list.count,
                                (node) => node.getPrevious(),
                                (node) => node.getNext());
        default:
            throw new Error("Invalid direction!");
    }
};

DoublyLinkedListRatchet.prototype.makeEmptyList = function() {
    return new DoublyLinkedListRatchet(this.fillElt, this.direction);
};

DoublyLinkedListRatchet.prototype.ratchetForward = function(node) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            return node.getNext();
        case DoublyLinkedListRatchet.Direction.Backward:
            return node.getPrevious();
        default:
            throw new Error("Invalid direction!");
    }
};

DoublyLinkedListRatchet.prototype.setRatchetForward = function(node, obj) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            node.setNext(obj);
            break;
        case DoublyLinkedListRatchet.Direction.Backward:
            node.setPrevious(obj);
            break;
        default:
            throw new Error("Invalid direction!");
    }
};

DoublyLinkedListRatchet.prototype.ratchetBackward = function(node) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            return node.getPrevious();
        case DoublyLinkedListRatchet.Direction.Backward:
            return node.getNext();
        default:
            throw new Error("Invalid direction!");
    }
};

DoublyLinkedListRatchet.prototype.setRatchetBackward = function(node, obj) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            node.setPrevious(obj);
            break;
        case DoublyLinkedListRatchet.Direction.Backward:
            node.setNext(obj);
            break;
        default:
            throw new Error("Invalid direction!");
    }
};

DoublyLinkedListRatchet.prototype.ratchetDlink = function(node1, node2) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            return node1.link(node2);
        case DoublyLinkedListRatchet.Direction.Backward:
            return node2.link(node1);
        default:
            throw new Error("Invalid direction!");
    }
};

//
//     Break all of the links to prevent memory leak!
//     
DoublyLinkedListRatchet.prototype.doClear = function() {
    if ( !this.isEmpty() ) {
        let dcons = this.store;
        for (let i = 0; i < this.size(); i++) {
            this.setRatchetBackward(dcons, null);
            dcons = this.ratchetForward(dcons);
        }

        this.setRatchetForward(this.store, null);
        this.store = null;
        this.count = 0;
        this.cursor.reset();
    }
};

DoublyLinkedListRatchet.prototype.doAddElements = function(objs) {
    let list = this;
    function addNodeToEnd(previousEnd, newEnd) {
        list.ratchetDlink(previousEnd, newEnd);
    }

    function addNodes(start) {
        let dcons = start;
        for (let i = 1; i < objs.length; i++) {
            addNodeToEnd(dcons, new Dcons(objs[i]));
            dcons = list.ratchetForward(dcons);
        }

        list.ratchetDlink(dcons, list.store);
        list.count += objs.length;
    }

    let dcons = new Dcons(objs[0]);
    
    if ( this.isEmpty() ) {
        this.store = dcons;
    } else {
        addNodeToEnd(this.ratchetBackward(this.store), dcons);
    }

    addNodes(dcons);

    return this;
};

DoublyLinkedListRatchet.prototype.insertElement = function(i, obj) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            this.nthDllNode(i).spliceBefore(obj);
            break;
        case DoublyLinkedListRatchet.Direction.Backward:
            this.nthDllNode(i).spliceAfter(obj);
            break;
        default:
            throw new Error("Invalid direction!");
    }

    if ( i === 0 ) {
        this.store = this.ratchetBackward(this.store);
    }

    this.count++;
};

DoublyLinkedListRatchet.prototype.doInsertEltBefore = function(node, obj) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            node.spliceBefore(obj);
            break;
        case DoublyLinkedListRatchet.Direction.Backward:
            node.spliceAfter(obj);
            break;
        default:
            throw new Error("Invalid direction!");
    }

    if ( node === this.store ) {
        this.store = this.ratchetBackward(this.store);
    }
};

DoublyLinkedListRatchet.prototype.doInsertEltAfter = function(node, obj) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            node.spliceAfter(obj);
            break;
        case DoublyLinkedListRatchet.Direction.Backward:
            node.spliceBefore(obj);
            break;
        default:
            throw new Error("Invalid direction!");
    }
};

DoublyLinkedListRatchet.prototype.deleteElement = function(i) {
    let doomed = this.deleteRatchetNode(this.nthDllNode(i));

    this.count--;

    return doomed;
};

DoublyLinkedListRatchet.prototype.deleteThisNode = function(doomed) {
    let result = this.deleteRatchetNode(doomed);

    this.count--;

    return result;
};

DoublyLinkedListRatchet.prototype.deleteRatchetNode = function(doomed) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            return this.deleteDcons(doomed, (node) => { return node.getNext(); });
        case DoublyLinkedListRatchet.Direction.Backward:
            return this.deleteDcons(doomed, (node) => { return node.getPrevious(); });
        default:
            throw new Error("Invalid direction!");
    }
};

//
//    This is not really needed for DoublyLinkedListRatchet.
//    
DoublyLinkedListRatchet.prototype.doDeleteChildNode = function(parent) {
    let child = this.ratchetForward(parent);

    if ( child === this.store ) {
        throw new Error("Parent must have child node");
    } else {
        let result = child.getContent();

        this.ratchetDlink(parent, this.ratchetForward(child));
        
        return result;
    }
};

DoublyLinkedListRatchet.prototype.subseq = function(start, end) {
    let result = [];

    if ( start < end ) {
        let dcons = this.nthDllNode(start);

        for (let i = start; i < end; i++) {
            result.push(dcons.getContent());
            dcons = this.ratchetForward(dcons);
        }
    }

    return result;
};
        
DoublyLinkedListRatchet.prototype.reverse = function() {
    this.countModification();
    return this.doReverse();
};

DoublyLinkedListRatchet.prototype.doReverse = function() {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            this.direction = DoublyLinkedListRatchet.Direction.Backward;
            break;
        case DoublyLinkedListRatchet.Direction.Backward:
            this.direction = DoublyLinkedListRatchet.Direction.Forward;
            break;
        default:
            throw new Error("Invalid direction!");
    }

    if ( !this.isEmpty() ) {
        this.store = this.ratchetForward(this.store);
    }

    this.cursor = this.setupCursor();

    return this;
};

//
//     Dnode
//
function Dnode(content) {
    this.content = content;
}

Dnode.prototype.getContent = function() {
    return this.content;
};

Dnode.prototype.setContent = function(obj) {
    this.content = obj;
};

//
//     DoublyLinkedListMap
//
function DoublyLinkedListMap(fillElt) {
    this.head = null
    this.forward = new Map();
    this.backward = new Map();
    DcursorList.call(this, fillElt);
}

DoublyLinkedListMap.prototype = Object.create(DcursorList.prototype);
DoublyLinkedListMap.prototype.constructor = DoublyLinkedListMap;
Object.defineProperty(DoublyLinkedListMap.prototype, "constructor", {enumerable: false, configurable: false});

DoublyLinkedListMap.prototype.setupCursor = function() {
    let list = this;
    
    return new Dcursor(() => list.head,
                       () => list.size(),
                       (node) => list.previousDnode(node),
                       (node) => list.nextDnode(node));
};

DoublyLinkedListMap.prototype.makeEmptyList = function() {
    return new DoublyLinkedListMap(this.fillElt);
};

DoublyLinkedListMap.prototype.nextDnode = function(node) {
    return this.forward.get(node)  ||  null;
};

DoublyLinkedListMap.prototype.setNextDnode = function(node, obj) {
    this.forward.set(node, obj);
};

DoublyLinkedListMap.prototype.previousDnode = function(node) {
    return this.backward.get(node)  ||  null;
};

DoublyLinkedListMap.prototype.setPreviousDnode = function(node, obj) {
    this.backward.set(node, obj);
};

DoublyLinkedListMap.prototype.linkDnodes = function(previous, next) {
    this.setNextDnode(previous, next);
    this.setPreviousDnode(next, previous);
};

DoublyLinkedListMap.prototype.spliceDnodeBefore = function(node, obj) {
    let newDnode = new Dnode(obj);
    this.linkDnodes(this.previousDnode(node), newDnode);
    this.linkDnodes(newDnode, node);
};

DoublyLinkedListMap.prototype.spliceDnodeAfter = function(node, obj) {
    let newDnode = new Dnode(obj);
    this.linkDnodes(newDnode, this.nextDnode(node));
    this.linkDnodes(node, newDnode);
};

DoublyLinkedListMap.prototype.exciseDnode = function(doomed) {
    if ( doomed === this.nextDnode(doomed) ) {
        throw new Error("Cannot delete sole node.");
    } else {
        this.linkDnodes(this.previousDnode(doomed), this.nextDnode(doomed));

        return doomed.getContent();
    }
};
        
DoublyLinkedListMap.prototype.exciseChildDnode = function(parent) {
    let child = this.nextDnode(parent);
    if ( child === this.head ) {
        throw new Error("Parent must have child node");
    } else {
        this.linkDnodes(parent, this.nextDnode(child));

        return child.getContent();
    }
};
        
DoublyLinkedListMap.prototype.size = function() {
    return this.forward.size;
};

DoublyLinkedListMap.prototype.isEmpty = function() {
    return this.head === null;
};

DoublyLinkedListMap.prototype.doClear = function() {
    if ( !this.isEmpty() ) {
        this.head = null;
        this.forward.clear();
        this.backward.clear();
        this.cursor.reset();
    }
};

DoublyLinkedListMap.prototype.iterator = function() {
    let list = this;

    return new MutableCollectionIterator(Cursor.makeDcursorListCursor(list.setupCursor()),
                                         () => list.modificationCount);
};

DoublyLinkedListMap.prototype.listIterator = function(start = 0) {
    let list = this;

    return new DoublyLinkedListListIterator(this, () => list.modificationCount, () => list.setupCursor(), start);
};

DoublyLinkedListMap.prototype.doAddElements = function(objs) {
    let list = this;
    function addNodes(start) {
        let dnode = start;
        for (let i = 1; i < objs.length; i++) {
            list.linkDnodes(dnode, new Dnode(objs[i]));
            dnode = list.nextDnode(dnode);
        }

        list.linkDnodes(dnode, list.head);
    }

    let dnode = new Dnode(objs[0]);
    
    if ( this.isEmpty() ) {
        this.head = dnode;
    } else {
        this.linkDnodes(this.previousDnode(this.head), dnode);
    }

    addNodes(dnode);

    return this;
};

DoublyLinkedListMap.prototype.insertElement = function(i, obj) {
    this.spliceDnodeBefore(this.nthDllNode(i), obj);

    if ( i === 0 ) {
        this.head = this.previousDnode(this.head);
    }
};

DoublyLinkedListMap.prototype.insertEltBefore = function(node, obj) {
    this.spliceDnodeBefore(node, obj);

    if ( node === this.head ) {
        this.head = this.previousDnode(this.head);
    }
};

DoublyLinkedListMap.prototype.insertEltAfter = function(node, obj) {
    this.spliceDnodeAfter(node, obj);
};

DoublyLinkedListMap.prototype.deleteElement = function(i) {
    return this.deleteDnode(this.nthDllNode(i));
};

DoublyLinkedListMap.prototype.deleteThisNode = function(doomed) {
    return this.deleteDnode(doomed);
};

DoublyLinkedListMap.prototype.deleteDnode = function(doomed) {
    if ( doomed === this.nextDnode(doomed) ) {
        this.setNextDnode(doomed, null);
        this.head = null;
    } else {
        this.exciseDnode(doomed);
        if ( doomed === this.head ) {
            this.head = this.nextDnode(doomed);
        }
    }
    
    this.forward.delete(doomed);
    this.backward.delete(doomed);
    return doomed.getContent();
};

DoublyLinkedListMap.prototype.deleteChildNode = function(parent) {
    let child = this.nextDnode(parent);

    if ( child === this.head ) {
        throw new Error("Parent must have child node");
    } else {
        this.exciseChildDnode(parent);

        this.forward.delete(child);
        this.backward.delete(child);
        
        return child.getContent();
    }
};


DoublyLinkedListMap.prototype.subseq = function(start, end) {
    let result = [];

    if ( start < end ) {
        let dnode = this.nthDllNode(start);

        for (let i = start; i < end; i++) {
            result.push(dnode.getContent());
            dnode = this.nextDnode(dnode);
        }
    }

    return result;
};

DoublyLinkedListMap.prototype.reverse = function() {
    this.countModification();
    return this.doReverse();
};

DoublyLinkedListMap.prototype.doReverse = function() {
    this.head = this.previousDnode(this.head);
    [this.forward, this.backward] = [this.backward, this.forward];
    this.cursor.reset();

    return this;
};

//
//     HashTableList
//     
function HashTableList(fillElt) {
    MutableList.call(this, fillElt);
    this.store = {};
    this.count = 0;
}

HashTableList.prototype = Object.create(MutableList.prototype);
HashTableList.prototype.constructor = HashTableList;
Object.defineProperty(HashTableList.prototype, "constructor", {enumerable: false, configurable: false});

HashTableList.prototype.makeEmptyList = function() {
    return new HashTableList(this.fillElt);
};

HashTableList.prototype.size = function() {
    return this.count;
};

HashTableList.prototype.isEmpty = function() {
    return this.count === 0;
};

HashTableList.prototype.iterator = function() {
    let list = this;  // Still necessary???
    return new MutableCollectionIterator(Cursor.makeRandomAccessListCursor(list),
                                         () => list.modificationCount)
};

HashTableList.prototype.listIterator = function(start = 0) {
    let list = this;

    return new RandomAccessListListIterator(this, () => list.modificationCount, start);
};

HashTableList.prototype.doClear = function() {
    this.store = {};
    this.count = 0;
};

HashTableList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    for (let i = 0; i < this.count; i++) {
        let elt = this.get(i);
        if ( test(obj, elt) ) {
            return elt;
        }
    }

    return null;
};

HashTableList.prototype.addElements = function(objs) {
    for (let obj of objs) {
        this.store[this.count++] = obj;
    }

    return this;
};

HashTableList.prototype.shiftUp = function(low, high) {
    for (let i = high-1; i >= low; i--) {
        this.store[i+1] = this.store[i];
    }
};

HashTableList.prototype.shiftDown = function(low, high) {
    for (let i = low; i < high; i++) {
        this.store[i-1] = this.store[i];
    }
};

HashTableList.prototype.doDoInsert = function(i, obj) {
    this.shiftUp(i, this.count);
    this.set(i, obj);
    this.count++;
};
    
HashTableList.prototype.doDoDelete = function(i) {
    let doomed = this.get(i);
    this.shiftDown(i+1, this.count);
    delete this.store[this.count-1];

    this.count--;
    return doomed;
};

HashTableList.prototype.doGet = function(i) {
    return this.store[i];
};

HashTableList.prototype.doSet = function(i, obj) {
    this.store[i] = obj;
};

// HashTableList.prototype.index = function(obj, test = (item, elt) => item === elt) {
//     for (let i = 0; i < this.count; i++) {
//         if ( test(obj, this.get(i)) ) {
//             return i;
//         }
//     }

// //    return -1;
//     return null;
// };

HashTableList.prototype.subseq = function(start, end) {
    return [...Array(end-start)].map((_, i)  => this.get(i+start));
};
        
//
//     HashTableListX
//     
function HashTableListX(fillElt) {
    HashTableList.call(this, fillElt);
    this.offset = 0;
}

HashTableListX.prototype = Object.create(HashTableList.prototype);
HashTableListX.prototype.constructor = HashTableListX;
Object.defineProperty(HashTableListX.prototype, "constructor", {enumerable: false, configurable: false});

HashTableListX.prototype.makeEmptyList = function() {
    return new HashTableListX(this.fillElt);
};

HashTableListX.prototype.doClear = function() {
    this.store = {};
    this.count = 0;
    this.offset = 0;
};

HashTableListX.prototype.addElements = function(objs) {
    let i = this.count + this.offset;
    for (let obj of objs) {
        this.store[i++] = obj;
        this.count++;
    }

    return this;
};

HashTableListX.prototype.shiftUp = function(low, high) {
    HashTableList.prototype.shiftUp.call(this, low + this.offset, high + this.offset);
};

HashTableListX.prototype.shiftDown = function(low, high) {
    HashTableList.prototype.shiftDown.call(this, low + this.offset, high + this.offset);
};

HashTableListX.prototype.doDoInsert = function(i, obj) {
    if ( i > Math.floor(this.count / 2) ) {
        this.shiftUp(i, this.count);
    } else {
        if ( i !== 0 ) {
            this.shiftDown(0, i);
        }

        this.offset--;
    }

    this.set(i, obj);
    this.count++;
};
    
HashTableListX.prototype.doDoDelete = function(i) {
    let doomed = this.get(i);

    if ( i > Math.floor(this.count / 2) ) {
        this.shiftDown(i + 1, this.count);

        delete this.store[this.count - 1 + this.offset];
    } else {
        if ( i !== 0 ) {
            this.shiftUp(0, i);
        }

        delete this.store[this.offset++];
    }

    this.count--;
    return doomed;
};

HashTableListX.prototype.doGet = function(i) {
    return this.store[i + this.offset];
};

HashTableListX.prototype.doSet = function(i, obj) {
    this.store[i + this.offset] = obj;
};
        
//
//     MapList
//     
function MapList(fillElt) {
    MutableList.call(this, fillElt);
    this.store = new Map();
}

MapList.prototype = Object.create(MutableList.prototype);
MapList.prototype.constructor = MapList;
Object.defineProperty(MapList.prototype, "constructor", {enumerable: false, configurable: false});

MapList.prototype.makeEmptyList = function() {
    return new MapList(this.fillElt);
};

MapList.prototype.size = function() {
    return this.store.size;
};

MapList.prototype.isEmpty = function() {
    return this.size() === 0;
};

MapList.prototype.iterator = function() {
    let list = this;  // Still necessary???
    return new MutableCollectionIterator(Cursor.makeRandomAccessListCursor(list),
                                         () => list.modificationCount)
};

MapList.prototype.listIterator = function(start = 0) {
    let list = this;

    return new RandomAccessListListIterator(this, () => list.modificationCount, start);
};

MapList.prototype.doClear = function() {
    this.store.clear();
};

MapList.prototype.addElements = function(objs) {
    for (let obj of objs) {
        this.store.set(this.size(), obj);
    }

    return this;
};

MapList.prototype.shiftUp = function(low, high) {
    for (let i = high-1; i >= low; i--) {
        this.store.set(i+1, this.store.get(i));
    }
};

MapList.prototype.shiftDown = function(low, high) {
    for (let i = low; i < high; i++) {
        this.store.set(i-1, this.store.get(i));
    }
};

MapList.prototype.doDoInsert = function(i, obj) {
    this.shiftUp(i, this.size());
    this.set(i, obj);
};
    
MapList.prototype.doDoDelete = function(i) {
    let doomed = this.get(i);
    this.shiftDown(i+1, this.size());
    this.store.delete(this.size() - 1);

    return doomed;
};

MapList.prototype.doGet = function(i) {
    return this.store.get(i);
};

MapList.prototype.doSet = function(i, obj) {
    this.store.set(i, obj);
};

MapList.prototype.subseq = function(start, end) {
    return [...Array(end-start)].map((_, i)  => this.get(i+start));
};
        
//
//     MapListX
//     
function MapListX(fillElt) {
    MapList.call(this, fillElt);
    this.offset = 0;
}

MapListX.prototype = Object.create(MapList.prototype);
MapListX.prototype.constructor = MapListX;
Object.defineProperty(MapListX.prototype, "constructor", {enumerable: false, configurable: false});

MapListX.prototype.makeEmptyList = function() {
    return new MapListX(this.fillElt);
};

MapListX.prototype.doClear = function() {
//    MapList.prototype.clear.call(this);
    MapList.prototype.doClear.call(this);
    this.offset = 0;
};

MapListX.prototype.addElements = function(objs) {
    for (let obj of objs) {
        this.store.set(this.size() + this.offset, obj);
    }

    return this;
};

MapListX.prototype.shiftUp = function(low, high) {
    MapList.prototype.shiftUp.call(this, low + this.offset, high + this.offset);
};

MapListX.prototype.shiftDown = function(low, high) {
    MapList.prototype.shiftDown.call(this, low + this.offset, high + this.offset);
};

MapListX.prototype.doDoInsert = function(i, obj) {
    if ( i > Math.floor(this.size() / 2) ) {
        this.shiftUp(i, this.size());
    } else {
        if ( i !== 0 ) {
            this.shiftDown(0, i);
        }

        this.offset--;
    }

    this.set(i, obj);
};
    
MapListX.prototype.doDoDelete = function(i) {
    let doomed = this.get(i);

    if ( i > Math.floor(this.size() / 2) ) {
        this.shiftDown(i + 1, this.size());

        this.store.delete(this.size() - 1 + this.offset);
    } else {
        if ( i !== 0 ) {
            this.shiftUp(0, i);
        }

        this.store.delete(this.offset++);
    }

    return doomed;
};

MapListX.prototype.doGet = function(i) {
    return this.store.get(i + this.offset);
};

MapListX.prototype.doSet = function(i, obj) {
    this.store.set(i + this.offset, obj);
};

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

PersistentList.prototype.makeEmptyList = function() {
    return new PersistentList(this.fillElt);
};

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

PersistentList.prototype.equals = function(list, test = (x, y) => x === y) {
    function pequals(self) {
        if ( self.size() === list.size() ) {
            let i1 = self.iterator();
            let i2 = list.iterator();

            while ( !(i1.isDone()  &&  i2.isDone()) ) {
                if ( !test(i1.current(), i2.current()) ) {
                    return false;
                }
                i1 = i1.next();
                i2 = i2.next();
            }

            return true;
        } else {
            return false;
        }
    }

    function lequals(self) {
        if ( self.size() === list.size() ) {
            let i1 = self.iterator();
            let i2 = list.iterator();

            while ( !(i1.isDone()  &&  i2.isDone()) ) {
                if ( !test(i1.current(), i2.current()) ) {
                    return false;
                }
                i1 = i1.next();
                i2.next();
            }

            return true;
        } else {
            return false;
        }
    }

    if ( list instanceof PersistentList ) {
        return pequals(this);
    } else {
        return lequals(this);
    }
};

PersistentList.prototype.each = function(op) {
    let i = this.iterator();

    while ( !i.isDone() ) {
        op(i.current());
        i = i.next();
    }
};

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
    let list = this;

    return new PersistentCollectionIterator(Cursor.makePersistentListCursor(list));
};

PersistentList.prototype.listIterator = function(start = 0) {
    let list = this;

    function headNode() {
        return list.store;
    }
    
    return new PersistentListListIterator(this, new RemoteControl({headNode: headNode}), start);
};

PersistentList.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    return Node.contains(this.store, obj, test);
};

//
//     Consider iterative implementation. 见 doInsert (Avoiding append()!)
//     
PersistentList.prototype.doAdd = function(objs) {
    let node = null;

    for (let i = objs.length-1; i >= 0; i--) {
        node = new Node(objs[i], node);
    }
    
    return PersistentList.initializeList(this.fillElt, Node.append(this.store, node), this.count + objs.length);
}

PersistentList.adjustNode = function(store, i, adjustment) {
    let front = null;
    let rear = null;
    let node = store;

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

    let tail = adjustment(node);

    if ( front === null ) {
        front = tail;
    } else {
        rear.setRest(tail);
    }

    return front;
};

//
//     "Around" method ensures that we do not go past end of list.
//     
PersistentList.prototype.doInsert = function(i, obj) {
    return PersistentList.initializeList(this.fillElt,
                                         PersistentList.adjustNode(this.store,
                                                                   i,
                                                                   (node) => new Node(obj, node)),
                                         this.count + 1);

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
    // let front = null;
    // let rear = null;
    // let node = this.store;

    // for (let j = 0; j < i; j++) {
    //     let newNode = new Node(node.first(), null);

    //     if ( front === null ) {
    //         rear = front = newNode;
    //     } else {
    //         rear.setRest(newNode);
    //         rear = rear.rest();
    //     }

    //     node = node.rest();
    // }

    // let tail = node.rest();

    // if ( front === null ) {
    //     front = tail;
    // } else {
    //     rear.setRest(tail);
    // }

    return PersistentList.initializeList(this.fillElt,
                                         PersistentList.adjustNode(this.store,
                                                                   i,
                                                                   (node) => node.rest()),
                                         this.count - 1);
};    

PersistentList.prototype.doGet = function(i) {
    return Node.nth(this.store, i);
};

PersistentList.prototype.doSet = function(i, obj) {
    // let front = null;
    // let rear = null;
    // let node = this.store;

    // for (let j = 0; j < i; j++) {
    //     let newNode = new Node(node.first(), null);

    //     if ( front === null ) {
    //         rear = front = newNode;
    //     } else {
    //         rear.setRest(newNode);
    //         rear = rear.rest();
    //     }

    //     node = node.rest();
    // }

    // let tail = new Node(obj, node.rest());

    // if ( front === null ) {
    //     front = tail;
    // } else {
    //     rear.setRest(tail);
    // }

    
    return PersistentList.initializeList(this.fillElt,
                                         PersistentList.adjustNode(this.store,
                                                                   i,
                                                                   (node) => new Node(obj, node.rest())),
                                         this.count);
};
    
PersistentList.prototype.index = function(obj, test = (item, elt) => item === elt) {
    return Node.index(this.store, obj, test);
};

//
//    Deviates from other doSlice() implementations.
// 
PersistentList.prototype.doSlice = function(i, n) {
    let start = Math.min(i, this.count);
    let end = Math.min(i+n, this.count);
    return PersistentList.initializeList(this.fillElt, Node.sublist(this.store, start, end), end - start);
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
        return this.collection.delete(0).iterator();
    }
};

//
//    ListIterator
//
function ListIterator(list) {
    this.list = list;
}

// ListIterator.prototype.type = function() {
//     throw new Error("ListIterator does not implement type()");
// };

ListIterator.prototype.isEmpty = function() {
    return this.list.isEmpty();
};

ListIterator.prototype.current = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        return this.doCurrent();
    }
};

ListIterator.prototype.doCurrent = function() {
    throw new Error("ListIterator does not implement doCurrent()");
};

ListIterator.prototype.currentIndex = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        return this.doCurrentIndex();
    }
};

ListIterator.prototype.doCurrentIndex = function() {
    throw new Error("ListIterator does not implement doCurrentIndex()");
};

ListIterator.prototype.setCurrent = function(obj) { // Type?
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        return this.doSetCurrent(obj);
    }
};

ListIterator.prototype.doSetCurrent = function(obj) {
    throw new Error("ListIterator does not implement doSetCurrent()");
};

ListIterator.prototype.hasNext = function() {
    throw new Error("ListIterator does not implement hasNext()");
};

ListIterator.prototype.hasPrevious = function() {
    throw new Error("ListIterator does not implement hasPrevious()");
};

ListIterator.prototype.next = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        return this.doNext();
    }
};

ListIterator.prototype.doNext = function() {
    throw new Error("ListIterator does not implement doNext()");
};

ListIterator.prototype.previous = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        return this.doPrevious();
    }
};

ListIterator.prototype.doPrevious = function() {
    throw new Error("ListIterator does not implement doPrevious()");
};

ListIterator.prototype.remove = function() {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else {
        return this.doRemove();
    }
};

ListIterator.prototype.doRemove = function() {
    throw new Error("ListIterator does not implement doRemove()");
};

ListIterator.prototype.addBefore = function() {
    throw new Error("ListIterator does not implement addBefore()");
};

ListIterator.prototype.addAfter = function() {
    throw new Error("ListIterator does not implement addAfter()");
};

//
//    MutableListListIterator
//
function MutableListListIterator(list, modificationCount) {
    ListIterator.call(this, list);
    this.modificationCount = modificationCount;
    this.expectedModificationCount = this.modificationCount();
}

MutableListListIterator.prototype = Object.create(ListIterator.prototype);
MutableListListIterator.prototype.constructor = MutableListListIterator;
Object.defineProperty(MutableListListIterator.prototype, "constructor", {enumerable: false, configurable: false});

MutableListListIterator.prototype.countModification = function() {
    this.expectedModificationCount++;
};

MutableListListIterator.prototype.comodified = function() {
    return this.expectedModificationCount !== this.modificationCount();
};

MutableListListIterator.prototype.checkComodification = function() {
    if ( this.comodified() ) {
        throw new Error("List iterator invalid due to structural modification of list.");
    }
};
    
MutableListListIterator.prototype.doCurrent = function() {
    this.checkComodification();

    return this.doDoCurrent();
};

MutableListListIterator.prototype.doDoCurrent = function() {
    throw new Error("MutableListListIterator does not implement doDoCurrent()");
};

MutableListListIterator.prototype.doCurrentIndex = function() {
    this.checkComodification();

    return this.doDoCurrentIndex();
};

MutableListListIterator.prototype.doDoCurrentIndex = function() {
    throw new Error("MutableListListIterator does not implement doDoCurrentIndex()");
};

MutableListListIterator.prototype.doSetCurrent = function(obj) {
    this.checkComodification();

    return this.doDoSetCurrent(obj);
};

MutableListListIterator.prototype.doDoSetCurrent = function(obj) {
    throw new Error("MutableListListIterator does not implement doDoSetCurrent()");
};

MutableListListIterator.prototype.hasNext = function() {
    this.checkComodification();

    return this.doHasNext();
};

MutableListListIterator.prototype.doHasNext = function() {
    throw new Error("MutableListListIterator does not implement doHasNext()");
};

MutableListListIterator.prototype.hasPrevious = function() {
    this.checkComodification();

    return this.doHasPrevious();
};

MutableListListIterator.prototype.doHasPrevious = function() {
    throw new Error("MutableListListIterator does not implement doHasPrevious()");
};

MutableListListIterator.prototype.doNext = function() {
    this.checkComodification();

    return this.doDoNext();
};

MutableListListIterator.prototype.doDoNext = function() {
    throw new Error("MutableListListIterator does not implement doDoNext()");
};

MutableListListIterator.prototype.doPrevious = function() {
    this.checkComodification();

    return this.doDoPrevious();
};

MutableListListIterator.prototype.doDoPrevious = function() {
    throw new Error("MutableListListIterator does not implement doDoPrevious()");
};

MutableListListIterator.prototype.doRemove = function() {
    this.checkComodification();

    let doomed = this.doDoRemove();
    this.countModification();
    return doomed;
};

MutableListListIterator.prototype.doDoRemove = function() {
    throw new Error("MutableListListIterator does not implement doDoRemove()");
};

MutableListListIterator.prototype.addBefore = function(obj) {
    this.checkComodification();

    this.doAddBefore(obj);
    this.countModification();
};

MutableListListIterator.prototype.doAddBefore = function(obj) {
    throw new Error("MutableListListIterator does not implement doAddBefore()");
};

MutableListListIterator.prototype.addAfter = function(obj) {
    this.checkComodification();

    this.doAddAfter(obj);
    this.countModification();
};

MutableListListIterator.prototype.doAddAfter = function(obj) {
    throw new Error("MutableListListIterator does not implement doAddAfter()");
};

//
//    RandomAccessListListIterator
//
function RandomAccessListListIterator(list, modificationCount, start = 0) {
    MutableListListIterator.call(this, list, modificationCount);

    if ( start < 0 ) {
        throw new Error(`Invalid cursor index: ${start}`);
    } else if ( list.isEmpty() ) { // ???
        this.cursor = 0;
    } else {
        this.cursor = Math.min(start, list.size() - 1);
    }
}

RandomAccessListListIterator.prototype = Object.create(MutableListListIterator.prototype);
RandomAccessListListIterator.prototype.constructor = RandomAccessListListIterator;
Object.defineProperty(RandomAccessListListIterator.prototype, "constructor", {enumerable: false, configurable: false});

RandomAccessListListIterator.prototype.doDoCurrent = function() {
    return this.list.get(this.cursor);
};

RandomAccessListListIterator.prototype.doDoCurrentIndex = function() {
    return this.cursor;
};

RandomAccessListListIterator.prototype.doDoSetCurrent = function(obj) {
    this.list.set(this.cursor, obj);
};

RandomAccessListListIterator.prototype.doHasNext = function() {
    return this.cursor < this.list.size() - 1;
};

RandomAccessListListIterator.prototype.doHasPrevious = function() {
    return this.cursor > 0;
};

RandomAccessListListIterator.prototype.doDoNext = function() {
    if ( this.hasNext() ) {
        this.cursor++;
        return this.current();
    } else {
        return null;
    }
};

RandomAccessListListIterator.prototype.doDoPrevious = function() {
    if ( this.hasPrevious() ) {
        this.cursor--;
        return this.current();
    } else {
        return null;
    }
};

RandomAccessListListIterator.prototype.doDoRemove = function() {
    let index = this.cursor;
    if ( this.hasPrevious()  &&  !this.hasNext() ) {
        this.cursor--;
    }

    return this.list.delete(index);
};

RandomAccessListListIterator.prototype.doAddBefore = function(obj) {
    if ( this.isEmpty() ) {
        this.list.add(obj);
    } else {
        this.list.insert(this.cursor, obj);
        this.cursor++;
    }
};

RandomAccessListListIterator.prototype.doAddAfter = function(obj) {
    if ( this.isEmpty() ) {
        this.list.add(obj);
    } else {
        this.list.insert(this.cursor + 1, obj);
    }
};

//
//    SinglyLinkedListListIterator
//
function SinglyLinkedListListIterator(list, modificationCount, head, start = 0) {
    MutableListListIterator.call(this, list, modificationCount);
    this.head = head;
    this.index = 0;
    this.initializeCursor();
    this.history = new LinkedStack();
    
    if ( start < 0 ) {
        throw new Error(`Invalid cursor index: ${start}`);
    }

    for (let i = 0; i < Math.min(start, list.size() - 1); i++) {
        this.next();
    }
}

SinglyLinkedListListIterator.prototype = Object.create(MutableListListIterator.prototype);
SinglyLinkedListListIterator.prototype.constructor = SinglyLinkedListListIterator;
Object.defineProperty(SinglyLinkedListListIterator.prototype, "constructor", {enumerable: false, configurable: false});

SinglyLinkedListListIterator.prototype.initializeCursor = function() {
    this.cursor = this.head();
};

SinglyLinkedListListIterator.prototype.doDoCurrent = function() {
    return this.cursor.first();
};

SinglyLinkedListListIterator.prototype.doDoCurrentIndex = function() {
    return this.index;
};

SinglyLinkedListListIterator.prototype.doDoSetCurrent = function(obj) {
    this.cursor.setFirst(obj);
};

SinglyLinkedListListIterator.prototype.doHasNext = function() {
    return !(this.cursor === null  ||  this.cursor.rest() === null);
};

SinglyLinkedListListIterator.prototype.doHasPrevious = function() {
    return !(this.cursor === null  ||  this.cursor === this.head());
};

SinglyLinkedListListIterator.prototype.doDoNext = function() {
    if ( this.hasNext() ) {
        this.history.push(this.cursor);
        this.cursor = this.cursor.rest();
        this.index++;
        
        return this.current();
    } else {
        return null;
    }
};

SinglyLinkedListListIterator.prototype.doDoPrevious = function() {
    if ( this.hasPrevious() ) {
        this.cursor = this.history.pop();
        this.index--;

        return this.current();
    } else {
        return null;
    }
};

SinglyLinkedListListIterator.prototype.doDoRemove = function() {
    if ( this.index === 0 ) {
        let doomed = this.list.deleteNode(this.cursor);
        this.initializeCursor();

        return doomed;
    } else {
        let parent = this.history.peek();

        if ( this.hasNext() ) {
            this.cursor = this.cursor.rest();
        } else {
            this.cursor = this.history.pop();
            this.index--;
        }

        return this.list.deleteChild(parent);
    }
};

SinglyLinkedListListIterator.prototype.doAddBefore = function(obj) {
    if ( this.isEmpty() ) {
        this.list.add(obj);
        this.initializeCursor();
    } else {
        this.list.insertBefore(this.cursor, obj);
        this.history.push(this.cursor);
        this.cursor = this.cursor.rest();
        this.index++;
    }
};

SinglyLinkedListListIterator.prototype.doAddAfter = function(obj) {
    if ( this.isEmpty() ) {
        this.list.add(obj);
        this.initializeCursor();
    } else {
        this.list.insertAfter(this.cursor, obj);
    }
};
    
//
//    DoublyLinkedListListIterator
//
function DoublyLinkedListListIterator(list, modificationCount, initialize, start = 0) {
    MutableListListIterator.call(this, list, modificationCount);
    this.initialize = initialize;
    this.cursor = this.initialize();
    
    if ( start < 0 ) {
        throw new Error(`Invalid cursor index: ${start}`);
    } else if ( start > 0 ) {
        this.cursor.advance(start);
    }
}

DoublyLinkedListListIterator.prototype = Object.create(MutableListListIterator.prototype);
DoublyLinkedListListIterator.prototype.constructor = DoublyLinkedListListIterator;
Object.defineProperty(DoublyLinkedListListIterator.prototype, "constructor", {enumerable: false, configurable: false});

DoublyLinkedListListIterator.prototype.doDoCurrent = function() {
    return this.cursor.node.getContent();
};

DoublyLinkedListListIterator.prototype.doDoCurrentIndex = function() {
    return this.cursor.index;
};

DoublyLinkedListListIterator.prototype.doDoSetCurrent = function(obj) {
    this.cursor.node.setContent(obj);
};

DoublyLinkedListListIterator.prototype.doHasNext = function() {
    return !this.cursor.atEnd();
};

DoublyLinkedListListIterator.prototype.doHasPrevious = function() {
    return !this.cursor.atStart();
};

DoublyLinkedListListIterator.prototype.doDoNext = function() {
    if ( this.hasNext() ) {
        this.cursor.advance();
        
        return this.current();
    } else {
        return null;
    }
};

DoublyLinkedListListIterator.prototype.doDoPrevious = function() {
    if ( this.hasPrevious() ) {
        this.cursor.rewind();

        return this.current();
    } else {
        return null;
    }
};

DoublyLinkedListListIterator.prototype.doDoRemove = function() {
    if ( this.cursor.index === 0 ) {
        let doomed = this.list.deleteNode(this.cursor.node);
        this.cursor.reset();

        return doomed;
    } else {
        let currentNode = this.cursor.node;

        if ( this.hasNext() ) {
            this.cursor.bump();
        } else {
            this.cursor.rewind();
        }

        return this.list.deleteNode(currentNode);
    }
};

DoublyLinkedListListIterator.prototype.doAddBefore = function(obj) {
    if ( this.isEmpty() ) {
        this.list.add(obj);
        this.cursor.reset();
    } else {
        this.list.insertBefore(this.cursor.node, obj);
        this.cursor.nudge();
    }
};

DoublyLinkedListListIterator.prototype.doAddAfter = function(obj) {
    if ( this.isEmpty() ) {
        this.list.add(obj);
        this.cursor.reset();
    } else {
        this.list.insertAfter(this.cursor.node, obj);
    }
};

//
//    PersistentListListIterator
//
function PersistentListListIterator(list, remoteControl, start = 0) {
    ListIterator.call(this, list, remoteControl);
    this.cursor = this.remoteControl.headNode();
    this.index = 0;
    this.history = new PersistentStack();

    if ( start < 0 ) {
        throw new Error(`Invalid cursor index: ${start}`);
    }

    for (let i = 0; i < Math.min(start, list.size() - 1); i++) {
        this.history = this.history.push(this.cursor);
        this.cursor = this.cursor.rest();
        this.index++;
    }
}

PersistentListListIterator.prototype = Object.create(ListIterator.prototype);
PersistentListListIterator.prototype.constructor = PersistentListListIterator;
Object.defineProperty(PersistentListListIterator.prototype, "constructor", {enumerable: false, configurable: false});

// PersistentListListIterator.prototype.type = 
//     def type
//       @list.type
//     end

PersistentListListIterator.initializeIterator = function(iterator, index, cursor, history) {
    let newIterator = new PersistentListListIterator(iterator.list, iterator.remoteControl);
    newIterator.cursor = cursor;
    newIterator.index = index;
    newIterator.history = history;

    return newIterator;
}

PersistentListListIterator.prototype.doCurrent = function() {
    return this.cursor.first();
};

PersistentListListIterator.prototype.doCurrentIndex = function() {
    return this.index;
};

PersistentListListIterator.prototype.doSetCurrent = function(obj) {
    return this.list.set(this.index, obj).listIterator(this.index);
};

PersistentListListIterator.prototype.hasNext = function() {
    return this.cursor.rest() !== null;
};

PersistentListListIterator.prototype.hasPrevious = function() {
    return !this.history.isEmpty();
};

PersistentListListIterator.prototype.doNext = function() {
    if ( this.hasNext() ) {
        return PersistentListListIterator.initializeIterator(this, this.index+1, this.cursor.rest(), this.history.push(this.cursor));
    } else {
        return null;
    }
};

PersistentListListIterator.prototype.doPrevious = function() {
    if ( this.hasNext() ) {
        return PersistentListListIterator.initializeIterator(this, this.index-1, this.history.peek(), this.history.pop());
    } else {
        return null;
    }
};

PersistentListListIterator.prototype.doRemove = function() {
    let list = this.list.delete(this.index);
    return list.listIterator(Math.min(this.index, list.size()-1));
};

PersistentListListIterator.prototype.addBefore = function(obj) {
    if ( this.isEmpty() ) {
        return this.list.add(obj).listIterator();
    } else {
        return this.list.insert(this.index, obj).listIterator(this.index + 1);
    }
};

PersistentListListIterator.prototype.addAfter = function(obj) {
    if ( this.isEmpty() ) {
        return this.list.add(obj).listIterator();
    } else {
        return this.list.insert(this.index + 1, obj).listIterator(this.index);
    }
};
