/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-list.js
//
//   Description
//
//   Started:           Sat Jan 22 22:26:47 2022
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


var al = new ArrayList()
var al = new ArrayList()
[Function]
> al.add('a', 'b', 'c')
al.add('a', 'b', 'c')
undefined
> var sll = new SinglyLinkedList()
var sll = new SinglyLinkedList()
undefined
> sll.add('A', 'B', 'C')
sll.add('A', 'B', 'C')
undefined
> al.equals(sll)
al.equals(sll)
false
> sll.equals(al)
sll.equals(al)
false
> al.equals(sll, (x, y) => x.toLowerCase() === y.toLowerCase())
al.equals(sll, (x, y) => x.toLowerCase() === y.toLowerCase())
true
> sll.equals(al, (x, y) => x.toLowerCase() === y.toLowerCase())
sll.equals(al, (x, y) => x.toLowerCase() === y.toLowerCase())
true
    >

var al = new ArrayList()
al.add(1, 2, 3, 4, 5)
al.index(3)
2
al.index(3, (item, elt) => elt % item === 0)
2

var sll = new SinglyLinkedList()
sll.add(1, 2, 3, 4, 5)
sll.index(3)
2
sll.index(3, (item, elt) => elt % item === 0)
2

var dll = new DoublyLinkedList()
dll.add(1, 2, 3, 4, 5)
dll.index(3)
2
dll.index(3, (item, elt) => elt % item === 0)
2

var sll = new SinglyLinkedList()
sll.add(1, 2, 3, 4, 5)
var dll = new DoublyLinkedList()
dll.add(-1, -2, -3, -4, -5)

sll.equals(dll)
false

sll.equals(dll, (x, y) => x + y === 0)
true

var sll = new SinglyLinkedList()
sll.add(1, 2, 3, 4, 5)
sll.contains(3)
3

sll.contains(3, (item, elt) => elt === item + 1)
4

sll.contains(2, (item, elt) => elt > item * 2)
5
