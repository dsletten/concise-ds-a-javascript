/// -*- Mode: JavaScript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-yfi2.js
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

function testMakeYFI2() {
    {
        let thrown = assertRaises(Error, () => YFI2.makeYFI({yards: 1, feet: -2, inches: 3}), "Length components must be non-negative integers.");
        console.log("Got expected error: " + thrown);
    }

    {
        let thrown = assertRaises(Error, () => YFI2.makeYFI({yards: 1.1, feet: 2.0, inches: 3.0}), "Length components must be non-negative integers.");
        console.log("Got expected error: " + thrown);
    }

    return true;
}

function testGetLength2() {
    assert(0 === YFI2.makeYFI().getLength(), "Expected length of 0");
    assert(1 === YFI2.makeYFI({inches: 1}).getLength(), "Expected length of 1");
    assert(12 === YFI2.makeYFI({feet: 1}).getLength(), "Expected length of 12");
    assert(36 === YFI2.makeYFI({yards: 1}).getLength(), "Expected length of 36");
    assert(49 === YFI2.makeYFI({yards: 1, inches: 1, feet: 1}).getLength(), "Expected length of 49");
    assert(100 === YFI2.add(YFI2.makeYFI({inches: 49}),
                            YFI2.makeYFI({inches: 51})).getLength(), "Expected length of 100");
    assert(100 === YFI2.add(YFI2.makeYFI({inches: 49}),
                            51).getLength(), "Expected length of 100");
    assert(100 === YFI2.add(49,
                            YFI2.makeYFI({inches: 51})).getLength(), "Expected length of 100");
    assert(100 === YFI2.add(49, 51).getLength(), "Expected length of 100");

    return true;
}

function testGetInches2() {
    assert(0 === YFI2.makeYFI().getInches(), "Expected 0 inches.");
    assert(1 === YFI2.makeYFI({inches: 1}).getInches(), "Expected 1 inch.");
    assert(0 === YFI2.makeYFI({feet: 1}).getInches(), "Expected 0 inches.");
    assert(0 === YFI2.makeYFI({yards: 1}).getInches(), "Expected 0 inches.");
    assert(1 === YFI2.makeYFI({yards: 1, inches: 1, feet: 1}).getInches(), "Expected 1 inch.");
    assert(0 === YFI2.add(YFI2.makeYFI({inches: 8}),
                          YFI2.makeYFI({inches: 4})).getInches(), "Expected 0 inches.");

    return true;
}

function testGetFeet2() {
    assert(0 === YFI2.makeYFI().getFeet(), "Expected 0 feet.");
    assert(0 === YFI2.makeYFI({inches: 1}).getFeet(), "Expected 0 feet.");
    assert(1 === YFI2.makeYFI({feet: 1}).getFeet(), "Expected 1 foot.");
    assert(0 === YFI2.makeYFI({yards: 1}).getFeet(), "Expected 0 feet.");
    assert(1 === YFI2.makeYFI({yards: 1, inches: 1, feet: 1}).getFeet(), "Expected 1 foot.");
    assert(0 === YFI2.add(YFI2.makeYFI({inches: 16}),
                          YFI2.makeYFI({inches: 20})).getFeet(), "Expected 0 feet.");

    return true;
}

function testGetYards2() {
    assert(0 === YFI2.makeYFI().getYards(), "Expected 0 yards.");
    assert(0 === YFI2.makeYFI({inches: 1}).getYards(), "Expected 0 yards.");
    assert(0 === YFI2.makeYFI({feet: 1}).getYards(), "Expected 0 yards.");
    assert(1 === YFI2.makeYFI({yards: 1}).getYards(), "Expected 1 yard.");
    assert(1 === YFI2.makeYFI({yards: 1, inches: 1, feet: 1}).getYards(), "Expected 1 yard.");
    assert(1 === YFI2.add(YFI2.makeYFI({inches: 12}),
                          YFI2.makeYFI({inches: 12}),
                          YFI2.makeYFI({inches: 12})).getYards(), "Expected 1 yard.");

    return true;
}

function testAdd2() {
    assert(YFI2.add() instanceof YFI2, "Identity element for addition should be returned.");
    assert(YFI2.add(1) instanceof YFI2, "Unit should be returned.");
    assert(YFI2.equals(0, YFI2.add()), "Identity element should equal 0.");
    assert(YFI2.equals(1, YFI2.add(0, 1)), "Sum should have length 1.");
    assert(YFI2.equals(1,
                       YFI2.add(YFI2.makeYFI(), YFI2.makeYFI({inches: 1}))), "Sum should have length 1.");

    {
        let a = 10;
        let b = 20;
        assert(YFI2.equals(YFI2.add(a, b), YFI2.add(b, a)), "Addition should be commutative.");
    }

    {
        let a = 20;
        let b = YFI2.makeYFI({inches: 30});
        assert(YFI2.equals(YFI2.add(a, b), YFI2.add(b, a)), "Addition should be commutative.");
    }

    {
        let a = YFI2.makeYFI({inches: 20});
        let b = YFI2.makeYFI({inches: 30});
        assert(YFI2.equals(YFI2.add(a, b), YFI2.add(b, a)), "Addition should be commutative.");
    }

    {
        let a = YFI2.makeYFI({yards: 1, feet: 2, inches: 3});
        let b = YFI2.makeYFI({yards: 4, feet: 5, inches: 6});
        assert(YFI2.equals(YFI2.add(a, b), YFI2.add(b, a)), "Addition should be commutative.");
    }

    {
        let a = YFI2.makeYFI({inches: 20});
        let b = YFI2.makeYFI({inches: 30});
        let c = YFI2.makeYFI({inches: 40});
        assert(YFI2.equals(YFI2.add(YFI2.add(a, b), c),
                           YFI2.add(a, YFI2.add(b, c)),
                           YFI2.add(a, b, c)), "Addition should be associative.");
    }

    assert(YFI2.equals([...Array(10)].map((_,i) => i + 1).reduce((x, y) => x + y),
                       YFI2.add(...[...Array(10)].map((_,i) => i + 1)),
                       YFI2.add(...[...Array(10)].map((_,i) => new YFI2(i+1)))),
           "Equal sums should be equal.");

    return true;
}

function testEquals2() {
    assert(YFI2.equals(0), "A YFI2 is equal to itself.");
    assert(YFI2.equals(1, 1), "Equal integers are equal.");
    assert(!YFI2.equals(0, 1), "Unequal integers are not equal.");

    {
        let a = 39;
        let b = YFI2.makeYFI({inches: 39});
        let c = YFI2.makeYFI({yards: 1, inches: 3});

        assert(YFI2.equals(a, b, c)  &&
               YFI2.equals(a, c, b)  &&
               YFI2.equals(b, a, c)  &&
               YFI2.equals(b, c, a)  &&
               YFI2.equals(c, a, b)  &&
               YFI2.equals(c, b, a), "Equality is independent of order.");
    }

    assert(YFI2.equals(YFI2.makeYFI({inches: 5}),
                       YFI2.add(2, 3),
                       YFI2.add(YFI2.makeYFI({inches: 2}), YFI2.makeYFI({inches: 3}))),
           "Equal YFI2s are equal.");
               
    assert(YFI2.equals("foo", "foo"), "Bogus");

    return true;
}

function yfi2TestSuite() {
    let tests = [testMakeYFI2,
                 testGetLength2,
                 testGetInches2,
                 testGetFeet2,
                 testGetYards2,
                 testAdd2,
                 testEquals2
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
