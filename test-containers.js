/// -*- Mode: Javascript -*-
//////////////////////////////////////////////////////////////////////////////
//
//   test-containers.js
//
//   Description
//
//   Started:           Tue Jul  5 20:09:15 2022
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

//const { PerformanceObserver, performance } = require('perf_hooks');
var perfHooks = require('perf_hooks');
var performance = perfHooks.performance;

function assert(condition, msg) {
    if ( !condition ) {
        throw new Error(msg);
    }
}

function assertRaises(exception, f, msg) {
    let thrown = catchError(f);

    if ( thrown instanceof exception ) {
        return thrown;
    } else {
        throw new Error(msg);
    }
}

function catchError(f) {
    try {
        f();
    } catch (e) {
        return e;
    }

    return null;
}
