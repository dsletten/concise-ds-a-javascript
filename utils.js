/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   utils.js
//
//   Description
//
//   Started:           Sun Dec  4 13:01:03 2022
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
//   Notes: Utility functions for Containers library
//
//////////////////////////////////////////////////////////////////////////////
"use strict";

//
//     Fix JavaScript's % operator.
//     From SBCL
//     
function mod(number, divisor) {
    let rem = number % divisor;

    if ( rem !== 0  &&  (divisor < 0 ? number > 0 : number < 0) ) {
        return rem + divisor;
    } else {
        return rem;
    }
}

