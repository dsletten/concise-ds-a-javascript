/// -*- Mode: JavaScript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-yfi.js
//
//   Description
//
//   Started:           Sat Apr 20 18:00:37 2024
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

function testMakeYFI() {
    {
        let thrown = assertRaises(Error, () => YFI.makeYFI({yards: 1, feet: -2, inches: 3}), "Length components must be non-negative integers.");
        console.log("Got expected error: " + thrown);
    }

    {
        let thrown = assertRaises(Error, () => YFI.makeYFI({yards: 1.1, feet: 2.0, inches: 3.0}), "Length components must be non-negative integers.");
        console.log("Got expected error: " + thrown);
    }

    return true;
}

function testLength() {
    assert(0 === YFI.makeYFI().length(), "Expected length of 0");
    assert(1 === YFI.makeYFI({inches: 1}).length(), "Expected length of 1");
    assert(12 === YFI.makeYFI({feet: 1}).length(), "Expected length of 12");
    assert(36 === YFI.makeYFI({yards: 1}).length(), "Expected length of 36");
    assert(49 === YFI.makeYFI({yards: 1, inches: 1, feet: 1}).length(), "Expected length of 49");
    assert(100 === YFI.add(YFI.makeYFI({inches: 49}),
                           YFI.makeYFI({inches: 51})).length(), "Expected length of 100");
    assert(100 === YFI.add(YFI.makeYFI({inches: 49}),
                           51).length(), "Expected length of 100");
    assert(100 === YFI.add(49,
                           YFI.makeYFI({inches: 51})).length(), "Expected length of 100");
    assert(100 === YFI.add(49, 51).length(), "Expected length of 100");

    return true;
}

function testInches() {
    assert(0 === YFI.makeYFI().inches(), "Expected 0 inches.");
    assert(1 === YFI.makeYFI({inches: 1}).inches(), "Expected 1 inch.");
    assert(0 === YFI.makeYFI({feet: 1}).inches(), "Expected 0 inches.");
    assert(0 === YFI.makeYFI({yards: 1}).inches(), "Expected 0 inches.");
    assert(1 === YFI.makeYFI({yards: 1, inches: 1, feet: 1}).inches(), "Expected 1 inch.");
    assert(0 === YFI.add(YFI.makeYFI({inches: 8}),
                         YFI.makeYFI({inches: 4})).inches(), "Expected 0 inches.");

    return true;
}

function testFeet() {
    assert(0 === YFI.makeYFI().feet(), "Expected 0 feet.");
    assert(0 === YFI.makeYFI({inches: 1}).feet(), "Expected 0 feet.");
    assert(1 === YFI.makeYFI({feet: 1}).feet(), "Expected 1 foot.");
    assert(0 === YFI.makeYFI({yards: 1}).feet(), "Expected 0 feet.");
    assert(1 === YFI.makeYFI({yards: 1, inches: 1, feet: 1}).feet(), "Expected 1 foot.");
    assert(0 === YFI.add(YFI.makeYFI({inches: 16}),
                         YFI.makeYFI({inches: 20})).feet(), "Expected 0 feet.");

    return true;
}

function testYards() {
    assert(0 === YFI.makeYFI().yards(), "Expected 0 yards.");
    assert(0 === YFI.makeYFI({inches: 1}).yards(), "Expected 0 yards.");
    assert(0 === YFI.makeYFI({feet: 1}).yards(), "Expected 0 yards.");
    assert(1 === YFI.makeYFI({yards: 1}).yards(), "Expected 1 yard.");
    assert(1 === YFI.makeYFI({yards: 1, inches: 1, feet: 1}).yards(), "Expected 1 yard.");
    assert(1 === YFI.add(YFI.makeYFI({inches: 12}),
                         YFI.makeYFI({inches: 12}),
                         YFI.makeYFI({inches: 12})).yards(), "Expected 1 yard.");

    return true;
}

function testAdd() {
    assert(YFI.add() instanceof YFI, "Identity element for addition should be returned.");
    assert(YFI.add(1) instanceof YFI, "Unit should be returned.");
    assert(YFI.equals(0, YFI.add()), "Identity element should equal 0.");
    assert(YFI.equals(1, YFI.add(0, 1)), "Sum should have length 1.");
    assert(YFI.equals(1,
                      YFI.add(YFI.makeYFI(), YFI.makeYFI({inches: 1}))), "Sum should have length 1.");

    {
        let a = 10;
        let b = 20;
        assert(YFI.equals(YFI.add(a, b), YFI.add(b, a)), "Addition should be commutative.");
    }

    {
        let a = 20;
        let b = YFI.makeYFI({inches: 30});
        assert(YFI.equals(YFI.add(a, b), YFI.add(b, a)), "Addition should be commutative.");
    }

    {
        let a = YFI.makeYFI({inches: 20});
        let b = YFI.makeYFI({inches: 30});
        assert(YFI.equals(YFI.add(a, b), YFI.add(b, a)), "Addition should be commutative.");
    }

    {
        let a = YFI.makeYFI({yards: 1, feet: 2, inches: 3});
        let b = YFI.makeYFI({yards: 4, feet: 5, inches: 6});
        assert(YFI.equals(YFI.add(a, b), YFI.add(b, a)), "Addition should be commutative.");
    }

    {
        let a = YFI.makeYFI({inches: 20});
        let b = YFI.makeYFI({inches: 30});
        let c = YFI.makeYFI({inches: 40});
        assert(YFI.equals(YFI.add(YFI.add(a, b), c),
                          YFI.add(a, YFI.add(b, c)),
                          YFI.add(a, b, c)), "Addition should be associative.");
    }

    assert(YFI.equals([...Array(10)].map((_,i) => i + 1).reduce((x, y) => x + y),
                      YFI.add(...[...Array(10)].map((_,i) => i + 1)),
                      YFI.add(...[...Array(10)].map((_,i) => new YFI(i+1)))),
           "Equal sums should be equal.");

    return true;
}

function testEquals() {
    assert(YFI.equals(0), "A YFI is equal to itself.");
    assert(YFI.equals(1, 1), "Equal integers are equal.");
    assert(!YFI.equals(0, 1), "Unequal integers are not equal.");

    {
        let a = 39;
        let b = YFI.makeYFI({inches: 39});
        let c = YFI.makeYFI({yards: 1, inches: 3});

        assert(YFI.equals(a, b, c)  &&
               YFI.equals(a, c, b)  &&
               YFI.equals(b, a, c)  &&
               YFI.equals(b, c, a)  &&
               YFI.equals(c, a, b)  &&
               YFI.equals(c, b, a), "Equality is independent of order.");
    }

    assert(YFI.equals(YFI.makeYFI({inches: 5}),
                      YFI.add(2, 3),
                      YFI.add(YFI.makeYFI({inches: 2}), YFI.makeYFI({inches: 3}))),
           "Equal YFIs are equal.");
               
    assert(YFI.equals("foo", "foo"), "Bogus");

    return true;
}

function yfiTestSuite() {
    let tests = [testMakeYFI,
                 testLength,
                 testInches,
                 testFeet,
                 testYards,
                 testAdd,
                 testEquals
                ];

    return tests.every(test => {
        console.log(test);
        let success = test();
        if ( success ) {
            console.log("...success");
        } else {
            console.log("...failure");
        }
        return success;
    });
}
