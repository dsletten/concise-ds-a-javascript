/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   containers.js
//
//   Description
//
//   Started:           Tue Jan 11 12:20:51 2022
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

//
//     Container
//     
function Container() {
    throw new Error("Cannot instantiate Container.");
}

Container.prototype.isEmpty = function() {
    throw new Error("Container does not implement isEmpty().");
};

Container.prototype.size = function() {
    throw new Error("Container does not implement size().");
};

Container.prototype.clear = function() {
    throw new Error("Container does not implement clear().");
};

function Dispenser() {
    throw new Error("Cannot instantiate Dispenser.");
}

Dispenser.prototype = Object.create(Container.prototype);
Dispenser.prototype.constructor = Dispenser;
Object.defineProperty(Dispenser.prototype, "constructor", {enumerable: false, configurable: false});

//
//    Node
// 
function Node(head, tail) {
    this.head = head;
    this.tail = tail;
}

Node.prototype.first = function() {
    return this.head;
};

Node.prototype.rest = function() {
    return this.tail;
};

Node.prototype.setFirst = function(head) {
    this.head = head;
};

Node.prototype.setRest = function(tail) {
    this.tail = tail;
};
    
Node.prototype.toString = function() {
    function carPrint(obj) {
        return "(" + obj;
    }

    function cdrPrint(obj) {
        if ( obj === null ) {
            return ")";
        } else if ( !(obj instanceof Node) ) { // I.e., (atom obj)
            return " . " + obj + ")";
        } else {
            return " " + obj.first() + cdrPrint(obj.rest());
        }
    }

    return carPrint(this.first()) + cdrPrint(this.rest());
};

Node.prototype.spliceBefore = function(obj) {
    let copy = new Node(this.first(), this.rest());
    this.setFirst(obj);
    this.setRest(copy);
};

Node.prototype.spliceAfter = function(obj) {
    let tail = new Node(obj, this.rest());
    this.setRest(tail);
};

Node.prototype.exciseNode = function() {
    let doomed = this.first();
    let saved = this.rest();

    if ( saved === null ) {
        throw new Error("Target node must have non-nil next node");
    } else {
        this.setFirst(saved.first());
        this.setRest(saved.rest());
    }

    return doomed;
};

Node.prototype.exciseChild = function() {
    let child = this.rest();

    if ( child === null ) {
        throw new Error("Parent must have child node");
    } else {
        this.setRest(child.rest());
    }

    return child.first();
};

Node.prototype.last = function() {
    let node = this;
    while ( node.rest() != null ) {
        node = node.rest();
    }

    return node;
};

// Node.reverse = function(list) {
//     function reverse(list, rest) {

//         if ( list === null ) {
//             return rest;
//         } else {
//             return reverse(list.rest(), new Node(list.first(), rest));
//         }
//     }

//     return reverse(list, null);
// };

Node.reverse = function(list) {
    let result = null;
    let node = list;

    while ( node !== null ) {
        result = new Node(node.first(), result);
        node = node.rest();
    }

    return result;
};

// Node.contains = function(node, obj, test = (item, elt) => item === elt) {
//     if ( node === null ) {
//         return null;
//     } else if ( test(obj, node.first()) ) {
//         return node.first();
//     } else {
//         return Node.contains(node.rest(), obj, test);
//     }
// };

Node.contains = function(node, obj, test = (item, elt) => item === elt) {
    while ( node !== null ) {
        if ( test(obj, node.first()) ) {
            return node.first();
        }

        node = node.rest();
    }

    return null;
};

// Node.index = function(node, obj, test = (item, elt) => item === elt) {
//     function index(node, i) {
//         if ( node === null ) {
// //            return -1;
//             return null;
//         } else if ( test(obj, node.first()) ) {
//             return i;
//         } else {
//             return index(node.rest(), i+1);
//         }
//     }

//     return index(node, 0);
// };

Node.index = function(node, obj, test = (item, elt) => item === elt) {
    let i = 0;
    while ( node !== null ) {
        if ( test(obj, node.first()) ) {
            return i;
        }

        node = node.rest();
        i++;
    }

    return null;
};

// Node.nthCdr = function(node, i) {
//     if ( node === null ) {
//         return null;
//     } else if ( i === 0 ) {
//         return node;
//     } else {
//         return Node.nthCdr(node.rest(), i-1);
//     }
// };

Node.nthCdr = function(node, i) {
    if ( i < 0 ) {
        throw new Error("Invalid index: " + i);
    }
    
    let j = 0;

    while ( j !== i ) {
        if ( node === null ) {
            return null;
        }

        node = node.rest();
        j++;
    }

    return node;
};

Node.nth = function(node, i) {
    let nth = Node.nthCdr(node, i);

    if ( nth === null ) {
        return null;
    } else {
        return nth.first();
    }
    // if ( node === null ) {
    //     return null;
    // } else if ( i === 0 ) {
    //     return node.first();
    // } else {
    //     return Node.nth(node.rest(), i-1);
    // }
};

Node.setNth = function(node, i, obj) {
    let nth = Node.nthCdr(node, i);

    if ( nth !== null ) {
        nth.setFirst(obj);
    }
    // if ( node !== null ) {
    //     if ( i === 0 ) {
    //         node.setFirst(obj);
    //     } else {
    //         Node.setNth(node.rest(), i-1, obj);
    //     }
    // }
};

Node.subseq = function(node, start, end) {
    let head = Node.nthCdr(node, start);
    let result = []
    for (let i = start; i < end; i++) {
        if ( head === null ) {
            return result;
        } else {
            result.push(head.first());
            head = head.rest();
        }
    }

    return result;
};

Node.sublist = function(node, start, end) {
    function subseq(l, i, result) {
        if ( i === end  ||  l === null ) {
            return Node.reverse(result);
        } else {
            return subseq(l.rest(), i+1, new Node(l.first(), result));
        }
    }

    return subseq(Node.nthCdr(node, start), start, null);
};

Node.append = function(l1, l2) {
    if ( l1 === null ) {
        return l2;
    } else {
        //        return new Node(l1.first(), Node.append(l1.rest(), l2));
        let head = new Node(l1.first(), l1.rest());
        let tail = head

        while ( tail.rest() !== null ) {
            tail.setRest(new Node(tail.rest().first(), tail.rest().rest()));
            tail = tail.rest();
        }

        tail.setRest(l2);

        return head;
    }
};

Node.makeList = function(n) {
    let result = null;

    for (let i = 0; i < n; i++) {
        result = new Node(null, result);
    }

    return result;
};

//
//     Collection
//     
function Collection() {
    throw new Error("Cannot instantiate Collection.");
}

Collection.prototype = Object.create(Container.prototype);
Collection.prototype.constructor = Collection;
Object.defineProperty(Collection.prototype, "constructor", {enumerable: false, configurable: false});

Collection.prototype.iterator = function() {
    throw new Error("Collection does not implement iterator().");
};

//
//     - Check type?
//     - Equality test?
//     
Collection.prototype.contains = function(obj, test = (item, elt) => item === elt) {
    let iterator = this.iterator();

    while ( !iterator.isDone() ) {
        let elt = iterator.current();

        if ( test(obj, elt) ) {
            return elt;
        }

        iterator.next();
    }

    return null;
};

Collection.prototype.equals = function(collection) {
    throw new Error("Collection does not implement equals().");
};

Collection.prototype.each = function(op) {
    throw new Error("Collection does not implement each().");
};

//
//    RemoteControl
//    
// function RemoteControl(iface) {
//     for (let p in iface) {
//         this[p] = iface[p];
//     }
// }

//
//    Cursor
//
function Cursor(done, current, advance) {
    this.done = done;
    this.current = current;
    this.advance = advance;
}

Cursor.makeRandomAccessListCursor = function(list) {
    let index = 0;

    return new Cursor(() => {
        if ( index > list.size() ) {
            throw new Error(`Index is out of bounds: ${index}`);
        } else {
            return index === list.size();
        }
    },
                      () => {return list.get(index);},
                      () => {index++;});
};

Cursor.makeSinglyLinkedListCursor = function(node) {
    return new Cursor(() => {return node === null;},
                      () => {return node.first();},
                      () => {node = node.rest();});
};

Cursor.makeDcursorListCursor = function(dcursor) {
    let sealedForYourProtection = true;

    return new Cursor(() => {return !dcursor.isInitialized() ||
                             (!sealedForYourProtection  &&  dcursor.atStart());},
                      () => {return dcursor.node.getContent();}, // ?????
                      () => {dcursor.advance();
                             sealedForYourProtection = false;});
};

Cursor.makePersistentListCursor = function(list) {
    return new Cursor(() => {return list.isEmpty();},
                      () => {return list.get(0);},
                      () => {return list.delete(0).iterator();});
};

//
//    Iterator
//
function Iterator(cursor) {
    this.cursor = cursor;
}

Iterator.prototype.isDone = function() {
    return this.checkDone();
};

Iterator.prototype.checkDone = function() {
    return this.cursor.done();
};

Iterator.prototype.current = function() {
    if ( this.isDone() ) {
        throw new Error("Iteration already finished");
    } else {
        return this.currentElement();
    }
};

Iterator.prototype.currentElement = function() {
    return this.cursor.current();
};
    
Iterator.prototype.next = function() {
    if ( this.isDone() ) {
        return null;
    } else {
        this.nextElement();

        if ( this.isDone() ) {
            return null;
        } else {
            return this.current();
        }
    }
};

Iterator.prototype.nextElement = function() {
    this.cursor.advance();
};

//
//    MutableCollectionIterator
// 
function MutableCollectionIterator(cursor, modificationCount) {
    Iterator.call(this, cursor);
    this.modificationCount = modificationCount;
    this.expectedModificationCount = this.modificationCount();
}

MutableCollectionIterator.prototype = Object.create(Iterator.prototype);
MutableCollectionIterator.prototype.constructor = MutableCollectionIterator;
Object.defineProperty(MutableCollectionIterator.prototype, "constructor", {enumerable: false, configurable: false});

MutableCollectionIterator.prototype.comodified = function() {
    return this.expectedModificationCount !== this.modificationCount();
};

MutableCollectionIterator.prototype.checkComodification = function() {
    if ( this.comodified() ) {
        throw new Error("Iterator invalid due to structural modification of collection.");
    }
};
    
MutableCollectionIterator.prototype.checkDone = function() {
    this.checkComodification();

    return Iterator.prototype.checkDone.call(this);
};

MutableCollectionIterator.prototype.currentElement = function() {
    this.checkComodification();

    return Iterator.prototype.currentElement.call(this);
};

MutableCollectionIterator.prototype.nextElement = function() {
    this.checkComodification();

    Iterator.prototype.nextElement.call(this);
};

//
//    PersistentCollectionIterator
// 
function PersistentCollectionIterator(cursor) {
    Iterator.call(this, cursor);
}

PersistentCollectionIterator.prototype = Object.create(Iterator.prototype);
PersistentCollectionIterator.prototype.constructor = PersistentCollectionIterator;
Object.defineProperty(PersistentCollectionIterator.prototype, "constructor", {enumerable: false, configurable: false});

PersistentCollectionIterator.prototype.next = function() {
    if ( this.isDone() ) {
        return this;
    } else {
        return this.cursor.advance();
    }
};

//
//     Rhino 6e
//     
function enumeration(enumMap) {
    var enumeration = function() { throw "Can't instantiate enumerations"; };
    enumeration.values = [];
    enumeration.forEach = function(f, c) {
        for (var i = 0; i < this.values.length; i++) {
            f.call(c, this.values[i]);
        }
    };

    enumeration.prototype.toString = function() { return this.name; };
    enumeration.prototype.valueOf = function() { return this.value; };
    enumeration.prototype.toJSON = function() { return this.name; };

    for (var name in enumMap) {
        var e = Object.create(enumeration.prototype);
        Object.defineProperty(e, "name", {value: name, enumerable: true});
        Object.defineProperty(e, "value", {value: enumMap[name], enumerable: true});

        enumeration[name] = e;
        enumeration.values.push(e);
    }

    return enumeration;
}
