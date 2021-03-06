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
            return this.set(j, obj);
        }
    } else if ( i >= this.size() ) {
        return this.extendList(i, obj);
    } else {
        return this.doSet(i, obj);
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

MutableLinkedList.prototype.deleteNode = function(node) {
    if ( this.isEmpty() ) {
        throw new Error("List is empty.");
    } else if ( node === null ) {
        throw new Error("Invalid node.");
    } else {
        let doomed = this.doDeleteNode(node);
        this.countModification();

        return doomed;
    }
};

MutableLinkedList.prototype.doDeleteNode = function(node) {
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

SinglyLinkedList.prototype.doSlice = function(i, n) {
    let sll = new SinglyLinkedList(this.fillElt);
    sll.add(...Node.subseq(this.front, Math.min(i, this.count), Math.min(i+n, this.count)));

    return sll;
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
            return "??? ??? ";
        } else if ( node === node.getPrevious() ) {
            return "??? ";
        } else {
            return node.getPrevious().getContent() + " ??? ";
        }
    }

    function printNext(node) {
        if ( node.getNext() === null ) {
            return " ??? ???";
        } else if ( node === node.getNext() ) {
            return " ???";
        } else {
            return " ??? " + node.getNext().getContent();
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
function Dcursor(head, size) {
    this.head = head;
    this.size = size;
    this.node = this.head();
    this.index = 0;
}

Dcursor.prototype.isInitialized = function() {
    return this.node !== null;
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
            this.node = this.node.getNext();
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
            this.node = this.node.getPrevious();
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
        this.node = this.node.getNext();
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
function DcursorB(head, size) {
    Dcursor.call(this, head, size);
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
            this.node = this.node.getPrevious();
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
            this.node = this.node.getNext();
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
//     DoublyLinkedList
//
function DoublyLinkedList(fillElt) {
    MutableLinkedList.call(this, fillElt);
    this.store = null;
    this.count = 0;
    
    this.cursor = this.setupCursor();
}

DoublyLinkedList.prototype = Object.create(MutableLinkedList.prototype);
DoublyLinkedList.prototype.constructor = DoublyLinkedList;
Object.defineProperty(DoublyLinkedList.prototype, "constructor", {enumerable: false, configurable: false});

DoublyLinkedList.prototype.setupCursor = function() {
    let list = this;
    
    return new Dcursor(() => list.store, () => list.count);
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
    let list = this;
    let dcursor = list.setupCursor();

    return new MutableCollectionIterator(Cursor.makeDoublyLinkedListCursor(dcursor),
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

// DoublyLinkedList.prototype.nthDcons = function(i) {
//     if ( i < 0  ||  i >= this.size() ) {
//         throw new Error(`Invalid index: ${i}`);
//     } else if ( this.isEmpty() ) {
//         throw new Error("List is empty");
//     } else if ( i === 0 ) {
//         return this.store;
//     } else if ( i === this.cursor.index ) {
//         return this.cursor.node;
//     } else if ( i < this.cursor.index / 2 ) {
//         this.cursor.reset();
//         this.cursor.advance(i);
//         return this.cursor.node;
//     } else if ( i < this.cursor.index ) {
//         this.cursor.rewind(this.cursor.index - i);
//         return this.cursor.node;
//     } else if ( i <= (this.count + this.cursor.index) / 2 ) {
//         this.cursor.advance(i - this.cursor.index);
//         return this.cursor.node;
//     } else {
//         this.cursor.reset();
//         this.cursor.rewind(this.count - i);
//         return this.cursor.node;
//     }
// };

DoublyLinkedList.prototype.nthDcons = function(i) {
    function repositionCursor(cursor, i, count) {
        if ( i === 0 ) {
            cursor.reset();
        } else if ( i < cursor.index ) {
            let indexDelta = cursor.index - i;

            if ( i < indexDelta ) {
                cursor.reset();
                cursor.advance(i);
            } else {
                cursor.rewind(indexDelta);
            }
        } else if ( i > cursor.index ) {
            let indexDelta = i - cursor.index;
            let countDelta = count - i;

            if ( indexDelta <= countDelta ) {
                cursor.advance(indexDelta);
            } else {
                cursor.reset();
                cursor.rewind(countDelta);
            }
        }
    }
    
    if ( this.isEmpty() ) {
        throw new Error("List is empty");
    } else if ( i < 0  ||  i >= this.size() ) {
        throw new Error(`Invalid index: ${i}`);
    } else {
        repositionCursor(this.cursor, i, this.count);

        return this.cursor.node;
    }
};

function isBetweenInclusive(i, low, high) {
    return low <= i  &&  i <= high;
}

DoublyLinkedList.prototype.doDoInsert = function(i, obj) {
    this.doDoDoInsert(i, obj);
    
    this.count++;

    if ( !this.cursor.isInitialized()  ||
         isBetweenInclusive(i, 0, this.cursor.index)  ||
         (i < 0  &&  isBetweenInclusive(i+this.count, 0, this.cursor.index)) ) {
        this.cursor.reset();
    }
};

DoublyLinkedList.prototype.doDoDoInsert = function(i, obj) {   // !!!
    this.nthDcons(i).spliceBefore(obj);

    if ( i === 0 ) {
        this.store = this.store.getPrevious();
    }
};

DoublyLinkedList.prototype.doInsertBefore = function(node, obj) {
    doDoInsertBefore(node, obj);
    
    this.count++;
    this.cursor.reset();
};

DoublyLinkedList.prototype.doDoInsertBefore = function(node, obj) {
    node.spliceBefore(obj)

    if ( node === this.store ) {
        this.store = this.store.getPrevious();
    }
};

DoublyLinkedList.prototype.doInsertAfter = function(node, obj) {
    doDoInsertAfter(node, obj);

    this.count++;
    this.cursor.reset();
};

DoublyLinkedList.prototype.doDoInsertAfter = function(node, obj) {
    node.spliceAfter(obj)
};

DoublyLinkedList.prototype.doDoDelete = function(i) {
    let doomed = this.deleteDcons(this.nthDcons(i));

    this.count--;
    this.cursor.reset();

    return doomed;
};

DoublyLinkedList.prototype.doDeleteNode = function(doomed) {
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
DoublyLinkedList.prototype.doDeleteChild = function(parent) {
    let result = this.doDoDeleteChild(parent);

    this.count--;
    this.cursor.reset();

    return result;
};

DoublyLinkedList.prototype.doDoDeleteChild = function(parent) {
    let child = parent.getNext();

    if ( child === this.store ) {
        throw new Error("Parent must have child node");
    } else {
        return parent.exciseChild();
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
        
DoublyLinkedList.prototype.makeEmptyList = function() {
    return new DoublyLinkedList(this.fillElt);
};

DoublyLinkedList.prototype.doSlice = function(i, n) {
    let dll = this.makeEmptyList();
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
//     DoublyLinkedListRatchet
//
function DoublyLinkedListRatchet(fillElt, direction=DoublyLinkedListRatchet.Direction.Forward) {
    this.direction = direction;
    DoublyLinkedList.call(this, fillElt);
}

DoublyLinkedListRatchet.prototype = Object.create(DoublyLinkedList.prototype);
DoublyLinkedListRatchet.prototype.constructor = DoublyLinkedListRatchet;
Object.defineProperty(DoublyLinkedListRatchet.prototype, "constructor", {enumerable: false, configurable: false});

DoublyLinkedListRatchet.Direction = enumeration({Forward: 0, Backward: 1});

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

DoublyLinkedListRatchet.prototype.setupCursor = function() {
    let list = this;
    
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            return new Dcursor(() => list.store, () => list.count);
        case DoublyLinkedListRatchet.Direction.Backward:
            return new DcursorB(() => list.store, () => list.count);
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
            this.setRatchetBackwards(dcons, null);
            dcons = this.ratchetForward(dcons);
        }

        this.setRatchetForward(this.store, null);
        this.store = null;
        this.count = 0;
        this.cursor.reset();
    }
};

DoublyLinkedListRatchet.prototype.doAdd = function(objs) {
    let list = this;
    function addNodeToEnd(previousEnd, newEnd) {
//        this.ratchetDlink(previousEnd, newEnd);
        list.ratchetDlink(previousEnd, newEnd);
    }

    function addNodes(start, objs) {
        let dcons = start;
        for (let i = 1; i < objs.length; i++) {
            addNodeToEnd(dcons, new Dcons(objs[i]));
//            dcons = this.ratchetForward(dcons);
            dcons = list.ratchetForward(dcons);
        }

        list.ratchetDlink(dcons, list.store);
        list.count += objs.length;
        // this.ratchetDlink(dcons, this.store);
        // this.count += objs.length;
    }

    let dcons = new Dcons(objs[0]);
    
    if ( this.isEmpty() ) {
        this.store = dcons;
    } else {
        addNodeToEnd(this.ratchetBackward(this.store), dcons);
    }

    addNodes(dcons, objs);

    if ( !this.cursor.isInitialized() ) {
        this.cursor.reset();
    }
};

DoublyLinkedListRatchet.prototype.doDoDoInsert = function(i, obj) {
    switch ( this.direction ) {
        case DoublyLinkedListRatchet.Direction.Forward:
            this.nthDcons(i).spliceBefore(obj);
            break;
        case DoublyLinkedListRatchet.Direction.Backward:
            this.nthDcons(i).spliceAfter(obj);
            break;
        default:
            throw new Error("Invalid direction!");
    }

    if ( i === 0 ) {
        this.store = this.ratchetBackward(store);
    }
};

DoublyLinkedListRatchet.prototype.doDoInsertBefore = function(node, obj) {
    node.spliceBefore(obj)

    if ( node === this.store ) {
        this.store = this.store.getPrevious();
    }
};

DoublyLinkedListRatchet.prototype.doDoInsertAfter = function(node, obj) {
    node.spliceAfter(obj)
};

//
//    This is not really needed for DoublyLinkedListRatchet.
//    
DoublyLinkedListRatchet.prototype.doDoDeleteChild = function(parent) {
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
        let dcons = this.nthDcons(start);

        for (let i = start; i < end; i++) {
            result.push(dcons.getContent());
            dcons = this.ratchetForward(dcons);
        }
    }

    return result;
};
        
DoublyLinkedListRatchet.prototype.makeEmptyList = function() {
    return new DoublyLinkedListRatchet(this.fillElt, this.direction);
};

DoublyLinkedListRatchet.prototype.reverse = function() {
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

HashTableList.prototype.doAdd = function(objs) {
    for (let obj of objs) {
        this.store[this.count++] = obj;
    }
};

HashTableList.prototype.doDoInsert = function(i, obj) {
    for (let j = this.count; j > i; j--) {
        this.store[j] = this.store[j-1];
    }

    this.store[i] = obj;
    this.count++;
};
    
HashTableList.prototype.doDoDelete = function(i) {
    let doomed = this.get(i);
    for (let j = i; j < this.count; j++) {
        this.store[j] = this.store[j+1];
    }

    delete this.store[--this.count];

    return doomed;
};

HashTableList.prototype.doGet = function(i) {
    return this.store[i];
};

HashTableList.prototype.doSet = function(i, obj) {
    this.store[i] = obj;
};

HashTableList.prototype.index = function(obj, test = (item, elt) => item === elt) {
    for (let i = 0; i < this.count; i++) {
        if ( test(obj, this.get(i)) ) {
            return i;
        }
    }

    return -1;
};

HashTableList.prototype.doSlice = function(i, n) {
    let list = new HashTableList(this.fillElt);
    let subseq = [];
    let start = Math.min(i, this.count);
    let end = Math.min(i+n, this.count);

    for (let j = start; j < end; j++) {
        subseq.push(this.get(j));
    }

    list.add(...subseq);

    return list;
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
//     Consider iterative implementation. ??? doInsert (Avoiding append()!)
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
    this.initialize = this.initialize();
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
