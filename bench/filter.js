
(function() {
  'use strict';

  var root = (typeof global == 'object') ? global : this;
  var amd = root.define && define.amd;
  var load = (typeof require == 'function' && !amd) ? require : function () {};

  var Benchmark = load('benchmark') || root.Benchmark;

  var setup = load('./setup.js')  || root.setup,
      assert = setup.assert;

  var PowerArray = load('PowerArray') || root.PowerArray,
    BoostArray = load('../lib/BoostArray') || root.BoostArray,
    fast = load('fast.js') || root.fast,
    underscore = load('underscore') || root._,
    lodash = load('lodash') || root.lodash,
    ramda = load('ramda') || root.R;

  BoostArray(Array.prototype);  // Boost the Array prototype

  var LEN = 1e7;
  var array = setup.randomIntArray(LEN);
  var parray = new PowerArray(array);
  //var iarray = new Uint16Array(array);
  var barray = BoostArray(array.slice(0));

  var filterFn = function (i) {
    return i % 3 === 0 || i % 5 === 0;
  };

  var testLength = array.filter(filterFn).length;

  var suite = new Benchmark.Suite('filter');

  suite

  .add('for loop', function() {

    var r = [];

    for (var i = 0, len = array.length; i < len; i++) {
      if (filterFn(array[i], i)) {
        r.push(array[i]);
      }
    }

    assert(r.length, testLength);

  })

  .add('while', function() {

    var len = array.length,
        r = [],
        i = -1;

    while (++i < len) {
      if (filterFn(array[i], i)) {
        r[r.length] = this[i];
      }
    }

    assert(r.length, testLength);

  })

  .add('array.filter', function() {
    var r = array.filter(filterFn);
    assert(r.length, testLength);
  })

  /* .add('Array.prototype.filter on array', function() {
    var r = Array.prototype.filter.call(array,filterFn);
    assert(r.length, testLength);
  })

  .add('Array.prototype.filter on Uint16Array', function() {
  var r = Array.prototype.filter.call(iarray,filterFn);
  assert(r.length, testLength);
  })*/

  /* .add('Array.prototype.filter on PowerArray', function() {
  var r = Array.prototype.filter.call(parray, filterFn);
  assert(r.length, testLength);
  }) */

  .add('array.$filter', function() {
    var r = array.$filter(filterFn);
    assert(r.length, testLength);
  })

  .add('powerArray.filter', function() {
    var r = parray.filter(filterFn);
    assert(r.length, testLength);
  })

  .add('boostArray.$filter', function() {
    var r = barray.$filter(filterFn);
    assert(r.length, testLength);
  })

  /* .add('PowerArray.prototype.filter on Uint16Array', function() {
  var r = PowerArray.prototype.filter.call(iarray, filterFn);
  assert(r.length, testLength);
  }) */

  .add('fast.filter', function() {
    var r = fast.filter(array,filterFn);
    assert(r.length, testLength);
  })

  /* .add('fast.filter on Uint16Array', function() {  // fast.filter treats non-instanceof Arrays as objects
  var r = fastForEach(iarray,filterFn);
  assert(r.length, testLength);
  }) */

  /* .add('fast.filter on PowerArray', function() {
  var r = fast.filter(parray,filterFn);
  assert(r.length, testLength);
  }) */

  .add('underscore.filter', function() {
    var r = underscore.filter(array,filterFn);
    assert(r.length, testLength);
  })

  /* .add('underscore.filter on Uint16Array', function() {
  var r = _.filter(iarray,filterFn);
  assert(r.length, testLength);
  }) */

  .add('lodash.filter', function() {
    var r = lodash.filter(array,filterFn);
    assert(r.length, testLength);
  })

  .add('ramda.filter', function() {
    var r = ramda.filter(filterFn,array);
    assert(r.length, testLength);
  });

  /* .add('lodash.filter on Uint16Array', function() {
  var r = lodash.filter(iarray,filterFn);
  assert(r.length, testLength);
  }) */

  setup(suite).run();

}).call(this);