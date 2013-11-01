// Underscore.js 1.4.4
// ===================

// > http://underscorejs.org
// > (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
// > Underscore may be freely distributed under the MIT license.

// Baseline setup
// --------------
(function() {

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

//     Backbone.js 1.0.0

//     (c) 2010-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.0.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return this;
      var deleteListener = !name && !callback;
      if (typeof name === 'object') callback = this;
      if (obj) (listeners = {})[obj._listenerId] = obj;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
        if (deleteListener) delete this._listeners[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      if (typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    _.extend(this, _.pick(options, modelOptions));
    if (options.parse) attrs = this.parse(attrs, options) || {};
    if (defaults = _.result(this, 'defaults')) {
      attrs = _.defaults({}, attrs, defaults);
    }
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // A list of options to be attached directly to the model, if provided.
  var modelOptions = ['url', 'urlRoot', 'collection'];

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

      options = _.extend({validate: true}, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) return false;

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options || {}, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.url) this.url = options.url;
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, merge: false, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.defaults(options || {}, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults(options || {}, setOptions);
      if (options.parse) models = this.parse(models, options);
      if (!_.isArray(models)) models = models ? [models] : [];
      var i, l, model, attrs, existing, sort;
      var at = options.at;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        if (!(model = this._prepareModel(models[i], options))) continue;

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(model)) {
          if (options.remove) modelMap[existing.cid] = true;
          if (options.merge) {
            existing.set(model.attributes, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }

        // This is a new model, push it to the `toAdd` list.
        } else if (options.add) {
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
      }

      // Remove nonexistent models if appropriate.
      if (options.remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          splice.apply(this.models, [at, 0].concat(toAdd));
        } else {
          push.apply(this.models, toAdd);
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      if (options.silent) return this;

      // Trigger `add` events.
      for (i = 0, l = toAdd.length; i < l; i++) {
        (model = toAdd[i]).trigger('add', model, this, options);
      }

      // Trigger `sort` if the collection was sorted.
      if (sort) this.trigger('sort', this, options);
      return this;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: this.length}, options));
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function(begin, end) {
      return this.models.slice(begin, end);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id != null ? obj.id : obj.cid || obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Figure out the smallest index at which a model should be inserted so as
    // to maintain order.
    sortedIndex: function(model, value, context) {
      value || (value = this.comparator);
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _.sortedIndex(this.models, model, iterator, context);
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
    'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(e.g. model, collection, id, className)* are
    // attached directly to the view.  See `viewOptions` for an exhaustive
    // list.
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && window.ActiveXObject &&
          !(window.external && window.external.msActiveXFilteringEnabled)) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      fragment = this.getFragment(fragment || '');
      if (this.fragment === fragment) return;
      this.fragment = fragment;
      var url = this.root + fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function (model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);

// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v1.0.3
//
// Copyright (c)2013 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com



/*!
 * Includes BabySitter
 * https://github.com/marionettejs/backbone.babysitter/
 *
 * Includes Wreqr
 * https://github.com/marionettejs/backbone.wreqr/
 */

// Backbone.BabySitter
// -------------------
// v0.0.5
//
// Copyright (c)2013 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://github.com/babysitterjs/backbone.babysitter

// Backbone.ChildViewContainer
// ---------------------------
//
// Provide a container to store, retrieve and
// shut down child views.

Backbone.ChildViewContainer = (function(Backbone, _){

  // Container Constructor
  // ---------------------

  var Container = function(initialViews){
    this._views = {};
    this._indexByModel = {};
    this._indexByCollection = {};
    this._indexByCustom = {};
    this._updateLength();

    this._addInitialViews(initialViews);
  };

  // Container Methods
  // -----------------

  _.extend(Container.prototype, {

    // Add a view to this container. Stores the view
    // by `cid` and makes it searchable by the model
    // and/or collection of the view. Optionally specify
    // a custom key to store an retrieve the view.
    add: function(view, customIndex){
      var viewCid = view.cid;

      // store the view
      this._views[viewCid] = view;

      // index it by model
      if (view.model){
        this._indexByModel[view.model.cid] = viewCid;
      }

      // index it by collection
      if (view.collection){
        this._indexByCollection[view.collection.cid] = viewCid;
      }

      // index by custom
      if (customIndex){
        this._indexByCustom[customIndex] = viewCid;
      }

      this._updateLength();
    },

    // Find a view by the model that was attached to
    // it. Uses the model's `cid` to find it, and
    // retrieves the view by it's `cid` from the result
    findByModel: function(model){
      var viewCid = this._indexByModel[model.cid];
      return this.findByCid(viewCid);
    },

    // Find a view by the collection that was attached to
    // it. Uses the collection's `cid` to find it, and
    // retrieves the view by it's `cid` from the result
    findByCollection: function(col){
      var viewCid = this._indexByCollection[col.cid];
      return this.findByCid(viewCid);
    },

    // Find a view by a custom indexer.
    findByCustom: function(index){
      var viewCid = this._indexByCustom[index];
      return this.findByCid(viewCid);
    },

    // Find by index. This is not guaranteed to be a
    // stable index.
    findByIndex: function(index){
      return _.values(this._views)[index];
    },

    // retrieve a view by it's `cid` directly
    findByCid: function(cid){
      return this._views[cid];
    },

    // Remove a view
    remove: function(view){
      var viewCid = view.cid;

      // delete model index
      if (view.model){
        delete this._indexByModel[view.model.cid];
      }

      // delete collection index
      if (view.collection){
        delete this._indexByCollection[view.collection.cid];
      }

      // delete custom index
      var cust;

      for (var key in this._indexByCustom){
        if (this._indexByCustom.hasOwnProperty(key)){
          if (this._indexByCustom[key] === viewCid){
            cust = key;
            break;
          }
        }
      }

      if (cust){
        delete this._indexByCustom[cust];
      }

      // remove the view from the container
      delete this._views[viewCid];

      // update the length
      this._updateLength();
    },

    // Call a method on every view in the container,
    // passing parameters to the call method one at a
    // time, like `function.call`.
    call: function(method, args){
      args = Array.prototype.slice.call(arguments, 1);
      this.apply(method, args);
    },

    // Apply a method on every view in the container,
    // passing parameters to the call method one at a
    // time, like `function.apply`.
    apply: function(method, args){
      var view;

      // fix for IE < 9
      args = args || [];

      _.each(this._views, function(view, key){
        if (_.isFunction(view[method])){
          view[method].apply(view, args);
        }
      });

    },

    // Update the `.length` attribute on this container
    _updateLength: function(){
      this.length = _.size(this._views);
    },

    // set up an initial list of views
    _addInitialViews: function(views){
      if (!views){ return; }

      var view, i,
          length = views.length;

      for (i=0; i<length; i++){
        view = views[i];
        this.add(view);
      }
    }
  });

  // Borrowing this code from Backbone.Collection:
  // http://backbonejs.org/docs/backbone.html#section-106
  //
  // Mix in methods from Underscore, for iteration, and other
  // collection related features.
  var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
    'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
    'last', 'without', 'isEmpty', 'pluck'];

  _.each(methods, function(method) {
    Container.prototype[method] = function() {
      var views = _.values(this._views);
      var args = [views].concat(_.toArray(arguments));
      return _[method].apply(_, args);
    };
  });

  // return the public API
  return Container;
})(Backbone, _);

// Backbone.Wreqr (Backbone.Marionette)
// ----------------------------------
// v0.2.0
//
// Copyright (c)2013 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://github.com/marionettejs/backbone.wreqr


Backbone.Wreqr = (function(Backbone, Marionette, _){
  "use strict";
  var Wreqr = {};

  // Handlers
// --------
// A registry of functions to call, given a name

Wreqr.Handlers = (function(Backbone, _){
  "use strict";

  // Constructor
  // -----------

  var Handlers = function(options){
    this.options = options;
    this._wreqrHandlers = {};

    if (_.isFunction(this.initialize)){
      this.initialize(options);
    }
  };

  Handlers.extend = Backbone.Model.extend;

  // Instance Members
  // ----------------

  _.extend(Handlers.prototype, Backbone.Events, {

    // Add multiple handlers using an object literal configuration
    setHandlers: function(handlers){
      _.each(handlers, function(handler, name){
        var context = null;

        if (_.isObject(handler) && !_.isFunction(handler)){
          context = handler.context;
          handler = handler.callback;
        }

        this.setHandler(name, handler, context);
      }, this);
    },

    // Add a handler for the given name, with an
    // optional context to run the handler within
    setHandler: function(name, handler, context){
      var config = {
        callback: handler,
        context: context
      };

      this._wreqrHandlers[name] = config;

      this.trigger("handler:add", name, handler, context);
    },

    // Determine whether or not a handler is registered
    hasHandler: function(name){
      return !! this._wreqrHandlers[name];
    },

    // Get the currently registered handler for
    // the specified name. Throws an exception if
    // no handler is found.
    getHandler: function(name){
      var config = this._wreqrHandlers[name];

      if (!config){
        throw new Error("Handler not found for '" + name + "'");
      }

      return function(){
        var args = Array.prototype.slice.apply(arguments);
        return config.callback.apply(config.context, args);
      };
    },

    // Remove a handler for the specified name
    removeHandler: function(name){
      delete this._wreqrHandlers[name];
    },

    // Remove all handlers from this registry
    removeAllHandlers: function(){
      this._wreqrHandlers = {};
    }
  });

  return Handlers;
})(Backbone, _);

  // Wreqr.CommandStorage
// --------------------
//
// Store and retrieve commands for execution.
Wreqr.CommandStorage = (function(){
  "use strict";

  // Constructor function
  var CommandStorage = function(options){
    this.options = options;
    this._commands = {};

    if (_.isFunction(this.initialize)){
      this.initialize(options);
    }
  };

  // Instance methods
  _.extend(CommandStorage.prototype, Backbone.Events, {

    // Get an object literal by command name, that contains
    // the `commandName` and the `instances` of all commands
    // represented as an array of arguments to process
    getCommands: function(commandName){
      var commands = this._commands[commandName];

      // we don't have it, so add it
      if (!commands){

        // build the configuration
        commands = {
          command: commandName,
          instances: []
        };

        // store it
        this._commands[commandName] = commands;
      }

      return commands;
    },

    // Add a command by name, to the storage and store the
    // args for the command
    addCommand: function(commandName, args){
      var command = this.getCommands(commandName);
      command.instances.push(args);
    },

    // Clear all commands for the given `commandName`
    clearCommands: function(commandName){
      var command = this.getCommands(commandName);
      command.instances = [];
    }
  });

  return CommandStorage;
})();

  // Wreqr.Commands
// --------------
//
// A simple command pattern implementation. Register a command
// handler and execute it.
Wreqr.Commands = (function(Wreqr){
  "use strict";

  return Wreqr.Handlers.extend({
    // default storage type
    storageType: Wreqr.CommandStorage,

    constructor: function(options){
      this.options = options || {};

      this._initializeStorage(this.options);
      this.on("handler:add", this._executeCommands, this);

      var args = Array.prototype.slice.call(arguments);
      Wreqr.Handlers.prototype.constructor.apply(this, args);
    },

    // Execute a named command with the supplied args
    execute: function(name, args){
      name = arguments[0];
      args = Array.prototype.slice.call(arguments, 1);

      if (this.hasHandler(name)){
        this.getHandler(name).apply(this, args);
      } else {
        this.storage.addCommand(name, args);
      }

    },

    // Internal method to handle bulk execution of stored commands
    _executeCommands: function(name, handler, context){
      var command = this.storage.getCommands(name);

      // loop through and execute all the stored command instances
      _.each(command.instances, function(args){
        handler.apply(context, args);
      });

      this.storage.clearCommands(name);
    },

    // Internal method to initialize storage either from the type's
    // `storageType` or the instance `options.storageType`.
    _initializeStorage: function(options){
      var storage;

      var StorageType = options.storageType || this.storageType;
      if (_.isFunction(StorageType)){
        storage = new StorageType();
      } else {
        storage = StorageType;
      }

      this.storage = storage;
    }
  });

})(Wreqr);

  // Wreqr.RequestResponse
// ---------------------
//
// A simple request/response implementation. Register a
// request handler, and return a response from it
Wreqr.RequestResponse = (function(Wreqr){
  "use strict";

  return Wreqr.Handlers.extend({
    request: function(){
      var name = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);

      return this.getHandler(name).apply(this, args);
    }
  });

})(Wreqr);

  // Event Aggregator
// ----------------
// A pub-sub object that can be used to decouple various parts
// of an application through event-driven architecture.

Wreqr.EventAggregator = (function(Backbone, _){
  "use strict";
  var EA = function(){};

  // Copy the `extend` function used by Backbone's classes
  EA.extend = Backbone.Model.extend;

  // Copy the basic Backbone.Events on to the event aggregator
  _.extend(EA.prototype, Backbone.Events);

  return EA;
})(Backbone, _);


  return Wreqr;
})(Backbone, Backbone.Marionette, _);

var Marionette = (function(global, Backbone, _){
  "use strict";

  // Define and export the Marionette namespace
  var Marionette = {};
  Backbone.Marionette = Marionette;

  // Get the DOM manipulator for later use
  Marionette.$ = Backbone.$;

// Helpers
// -------

// For slicing `arguments` in functions
var protoSlice = Array.prototype.slice;
function slice(args) {
  return protoSlice.call(args);
}

function throwError(message, name) {
  var error = new Error(message);
  error.name = name || 'Error';
  throw error;
}

// Marionette.extend
// -----------------

// Borrow the Backbone `extend` method so we can use it as needed
Marionette.extend = Backbone.Model.extend;

// Marionette.getOption
// --------------------

// Retrieve an object, function or other value from a target
// object or its `options`, with `options` taking precedence.
Marionette.getOption = function(target, optionName){
  if (!target || !optionName){ return; }
  var value;

  if (target.options && (optionName in target.options) && (target.options[optionName] !== undefined)){
    value = target.options[optionName];
  } else {
    value = target[optionName];
  }

  return value;
};

// Trigger an event and a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar") will trigger the "foo:bar" event and
// call the "onFooBar" method.
Marionette.triggerMethod = (function(){

  // split the event name on the :
  var splitter = /(^|:)(\w)/gi;

  // take the event section ("section1:section2:section3")
  // and turn it in to uppercase name
  function getEventName(match, prefix, eventName) {
    return eventName.toUpperCase();
  }

  // actual triggerMethod name
  var triggerMethod = function(event) {
    // get the method name from the event name
    var methodName = 'on' + event.replace(splitter, getEventName);
    var method = this[methodName];

    // trigger the event
    this.trigger.apply(this, arguments);

    // call the onMethodName if it exists
    if (_.isFunction(method)) {
      // pass all arguments, except the event name
      return method.apply(this, _.tail(arguments));
    }
  };

  return triggerMethod;
})();

// DOMRefresh
// ----------
//
// Monitor a view's state, and after it has been rendered and shown
// in the DOM, trigger a "dom:refresh" event every time it is
// re-rendered.

Marionette.MonitorDOMRefresh = (function(){
  // track when the view has been rendered
  function handleShow(view){
    view._isShown = true;
    triggerDOMRefresh(view);
  }

  // track when the view has been shown in the DOM,
  // using a Marionette.Region (or by other means of triggering "show")
  function handleRender(view){
    view._isRendered = true;
    triggerDOMRefresh(view);
  }

  // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
  function triggerDOMRefresh(view){
    if (view._isShown && view._isRendered){
      if (_.isFunction(view.triggerMethod)){
        view.triggerMethod("dom:refresh");
      }
    }
  }

  // Export public API
  return function(view){
    view.listenTo(view, "show", function(){
      handleShow(view);
    });

    view.listenTo(view, "render", function(){
      handleRender(view);
    });
  };
})();


// Marionette.bindEntityEvents & unbindEntityEvents
// ---------------------------
//
// These methods are used to bind/unbind a backbone "entity" (collection/model)
// to methods on a target object.
//
// The first parameter, `target`, must have a `listenTo` method from the
// EventBinder object.
//
// The second parameter is the entity (Backbone.Model or Backbone.Collection)
// to bind the events from.
//
// The third parameter is a hash of { "event:name": "eventHandler" }
// configuration. Multiple handlers can be separated by a space. A
// function can be supplied instead of a string handler name.

(function(Marionette){
  "use strict";

  // Bind the event to handlers specified as a string of
  // handler names on the target object
  function bindFromStrings(target, entity, evt, methods){
    var methodNames = methods.split(/\s+/);

    _.each(methodNames,function(methodName) {

      var method = target[methodName];
      if(!method) {
        throwError("Method '"+ methodName +"' was configured as an event handler, but does not exist.");
      }

      target.listenTo(entity, evt, method, target);
    });
  }

  // Bind the event to a supplied callback function
  function bindToFunction(target, entity, evt, method){
      target.listenTo(entity, evt, method, target);
  }

  // Bind the event to handlers specified as a string of
  // handler names on the target object
  function unbindFromStrings(target, entity, evt, methods){
    var methodNames = methods.split(/\s+/);

    _.each(methodNames,function(methodName) {
      var method = target[methodName];
      target.stopListening(entity, evt, method, target);
    });
  }

  // Bind the event to a supplied callback function
  function unbindToFunction(target, entity, evt, method){
      target.stopListening(entity, evt, method, target);
  }


  // generic looping function
  function iterateEvents(target, entity, bindings, functionCallback, stringCallback){
    if (!entity || !bindings) { return; }

    // allow the bindings to be a function
    if (_.isFunction(bindings)){
      bindings = bindings.call(target);
    }

    // iterate the bindings and bind them
    _.each(bindings, function(methods, evt){

      // allow for a function as the handler,
      // or a list of event names as a string
      if (_.isFunction(methods)){
        functionCallback(target, entity, evt, methods);
      } else {
        stringCallback(target, entity, evt, methods);
      }

    });
  }

  // Export Public API
  Marionette.bindEntityEvents = function(target, entity, bindings){
    iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
  };

  Marionette.unbindEntityEvents = function(target, entity, bindings){
    iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
  };

})(Marionette);


// Callbacks
// ---------

// A simple way of managing a collection of callbacks
// and executing them at a later point in time, using jQuery's
// `Deferred` object.
Marionette.Callbacks = function(){
  this._deferred = Marionette.$.Deferred();
  this._callbacks = [];
};

_.extend(Marionette.Callbacks.prototype, {

  // Add a callback to be executed. Callbacks added here are
  // guaranteed to execute, even if they are added after the
  // `run` method is called.
  add: function(callback, contextOverride){
    this._callbacks.push({cb: callback, ctx: contextOverride});

    this._deferred.done(function(context, options){
      if (contextOverride){ context = contextOverride; }
      callback.call(context, options);
    });
  },

  // Run all registered callbacks with the context specified.
  // Additional callbacks can be added after this has been run
  // and they will still be executed.
  run: function(options, context){
    this._deferred.resolve(context, options);
  },

  // Resets the list of callbacks to be run, allowing the same list
  // to be run multiple times - whenever the `run` method is called.
  reset: function(){
    var callbacks = this._callbacks;
    this._deferred = Marionette.$.Deferred();
    this._callbacks = [];

    _.each(callbacks, function(cb){
      this.add(cb.cb, cb.ctx);
    }, this);
  }
});


// Marionette Controller
// ---------------------
//
// A multi-purpose object to use as a controller for
// modules and routers, and as a mediator for workflow
// and coordination of other objects, views, and more.
Marionette.Controller = function(options){
  this.triggerMethod = Marionette.triggerMethod;
  this.options = options || {};

  if (_.isFunction(this.initialize)){
    this.initialize(this.options);
  }
};

Marionette.Controller.extend = Marionette.extend;

// Controller Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(Marionette.Controller.prototype, Backbone.Events, {
  close: function(){
    this.stopListening();
    this.triggerMethod("close");
    this.unbind();
  }
});

// Region
// ------
//
// Manage the visual regions of your composite application. See
// http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/

Marionette.Region = function(options){
  this.options = options || {};

  this.el = Marionette.getOption(this, "el");

  if (!this.el){
    var err = new Error("An 'el' must be specified for a region.");
    err.name = "NoElError";
    throw err;
  }

  if (this.initialize){
    var args = Array.prototype.slice.apply(arguments);
    this.initialize.apply(this, args);
  }
};


// Region Type methods
// -------------------

_.extend(Marionette.Region, {

  // Build an instance of a region by passing in a configuration object
  // and a default region type to use if none is specified in the config.
  //
  // The config object should either be a string as a jQuery DOM selector,
  // a Region type directly, or an object literal that specifies both
  // a selector and regionType:
  //
  // ```js
  // {
  //   selector: "#foo",
  //   regionType: MyCustomRegion
  // }
  // ```
  //
  buildRegion: function(regionConfig, defaultRegionType){
    var regionIsString = (typeof regionConfig === "string");
    var regionSelectorIsString = (typeof regionConfig.selector === "string");
    var regionTypeIsUndefined = (typeof regionConfig.regionType === "undefined");
    var regionIsType = (typeof regionConfig === "function");

    if (!regionIsType && !regionIsString && !regionSelectorIsString) {
      throw new Error("Region must be specified as a Region type, a selector string or an object with selector property");
    }

    var selector, RegionType;

    // get the selector for the region

    if (regionIsString) {
      selector = regionConfig;
    }

    if (regionConfig.selector) {
      selector = regionConfig.selector;
    }

    // get the type for the region

    if (regionIsType){
      RegionType = regionConfig;
    }

    if (!regionIsType && regionTypeIsUndefined) {
      RegionType = defaultRegionType;
    }

    if (regionConfig.regionType) {
      RegionType = regionConfig.regionType;
    }

    // build the region instance
    var region = new RegionType({
      el: selector
    });

    // override the `getEl` function if we have a parentEl
    // this must be overridden to ensure the selector is found
    // on the first use of the region. if we try to assign the
    // region's `el` to `parentEl.find(selector)` in the object
    // literal to build the region, the element will not be
    // guaranteed to be in the DOM already, and will cause problems
    if (regionConfig.parentEl){

      region.getEl = function(selector) {
        var parentEl = regionConfig.parentEl;
        if (_.isFunction(parentEl)){
          parentEl = parentEl();
        }
        return parentEl.find(selector);
      };
    }

    return region;
  }

});

// Region Instance Methods
// -----------------------

_.extend(Marionette.Region.prototype, Backbone.Events, {

  // Displays a backbone view instance inside of the region.
  // Handles calling the `render` method for you. Reads content
  // directly from the `el` attribute. Also calls an optional
  // `onShow` and `close` method on your view, just after showing
  // or just before closing the view, respectively.
  show: function(view){

    this.ensureEl();

    var isViewClosed = view.isClosed || _.isUndefined(view.$el);

    var isDifferentView = view !== this.currentView;

    if (isDifferentView) {
      this.close();
    }

    view.render();

    if (isDifferentView || isViewClosed) {
      this.open(view);
    }

    this.currentView = view;

    Marionette.triggerMethod.call(this, "show", view);
    Marionette.triggerMethod.call(view, "show");
  },

  ensureEl: function(){
    if (!this.$el || this.$el.length === 0){
      this.$el = this.getEl(this.el);
    }
  },

  // Override this method to change how the region finds the
  // DOM element that it manages. Return a jQuery selector object.
  getEl: function(selector){
    return Marionette.$(selector);
  },

  // Override this method to change how the new view is
  // appended to the `$el` that the region is managing
  open: function(view){
    this.$el.empty().append(view.el);
  },

  // Close the current view, if there is one. If there is no
  // current view, it does nothing and returns immediately.
  close: function(){
    var view = this.currentView;
    if (!view || view.isClosed){ return; }

    // call 'close' or 'remove', depending on which is found
    if (view.close) { view.close(); }
    else if (view.remove) { view.remove(); }

    Marionette.triggerMethod.call(this, "close");

    delete this.currentView;
  },

  // Attach an existing view to the region. This
  // will not call `render` or `onShow` for the new view,
  // and will not replace the current HTML for the `el`
  // of the region.
  attachView: function(view){
    this.currentView = view;
  },

  // Reset the region by closing any existing view and
  // clearing out the cached `$el`. The next time a view
  // is shown via this region, the region will re-query the
  // DOM for the region's `el`.
  reset: function(){
    this.close();
    delete this.$el;
  }
});

// Copy the `extend` function used by Backbone's classes
Marionette.Region.extend = Marionette.extend;

// Marionette.RegionManager
// ------------------------
//
// Manage one or more related `Marionette.Region` objects.
Marionette.RegionManager = (function(Marionette){

  var RegionManager = Marionette.Controller.extend({
    constructor: function(options){
      this._regions = {};
      Marionette.Controller.prototype.constructor.call(this, options);
    },

    // Add multiple regions using an object literal, where
    // each key becomes the region name, and each value is
    // the region definition.
    addRegions: function(regionDefinitions, defaults){
      var regions = {};

      _.each(regionDefinitions, function(definition, name){
        if (typeof definition === "string"){
          definition = { selector: definition };
        }

        if (definition.selector){
          definition = _.defaults({}, definition, defaults);
        }

        var region = this.addRegion(name, definition);
        regions[name] = region;
      }, this);

      return regions;
    },

    // Add an individual region to the region manager,
    // and return the region instance
    addRegion: function(name, definition){
      var region;

      var isObject = _.isObject(definition);
      var isString = _.isString(definition);
      var hasSelector = !!definition.selector;

      if (isString || (isObject && hasSelector)){
        region = Marionette.Region.buildRegion(definition, Marionette.Region);
      } else if (_.isFunction(definition)){
        region = Marionette.Region.buildRegion(definition, Marionette.Region);
      } else {
        region = definition;
      }

      this._store(name, region);
      this.triggerMethod("region:add", name, region);
      return region;
    },

    // Get a region by name
    get: function(name){
      return this._regions[name];
    },

    // Remove a region by name
    removeRegion: function(name){
      var region = this._regions[name];
      this._remove(name, region);
    },

    // Close all regions in the region manager, and
    // remove them
    removeRegions: function(){
      _.each(this._regions, function(region, name){
        this._remove(name, region);
      }, this);
    },

    // Close all regions in the region manager, but
    // leave them attached
    closeRegions: function(){
      _.each(this._regions, function(region, name){
        region.close();
      }, this);
    },

    // Close all regions and shut down the region
    // manager entirely
    close: function(){
      this.removeRegions();
      var args = Array.prototype.slice.call(arguments);
      Marionette.Controller.prototype.close.apply(this, args);
    },

    // internal method to store regions
    _store: function(name, region){
      this._regions[name] = region;
      this._setLength();
    },

    // internal method to remove a region
    _remove: function(name, region){
      region.close();
      delete this._regions[name];
      this._setLength();
      this.triggerMethod("region:remove", name, region);
    },

    // set the number of regions current held
    _setLength: function(){
      this.length = _.size(this._regions);
    }

  });

  // Borrowing this code from Backbone.Collection:
  // http://backbonejs.org/docs/backbone.html#section-106
  //
  // Mix in methods from Underscore, for iteration, and other
  // collection related features.
  var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
    'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
    'last', 'without', 'isEmpty', 'pluck'];

  _.each(methods, function(method) {
    RegionManager.prototype[method] = function() {
      var regions = _.values(this._regions);
      var args = [regions].concat(_.toArray(arguments));
      return _[method].apply(_, args);
    };
  });

  return RegionManager;
})(Marionette);


// Template Cache
// --------------

// Manage templates stored in `<script>` blocks,
// caching them for faster access.
Marionette.TemplateCache = function(templateId){
  this.templateId = templateId;
};

// TemplateCache object-level methods. Manage the template
// caches from these method calls instead of creating
// your own TemplateCache instances
_.extend(Marionette.TemplateCache, {
  templateCaches: {},

  // Get the specified template by id. Either
  // retrieves the cached version, or loads it
  // from the DOM.
  get: function(templateId){
    var cachedTemplate = this.templateCaches[templateId];

    if (!cachedTemplate){
      cachedTemplate = new Marionette.TemplateCache(templateId);
      this.templateCaches[templateId] = cachedTemplate;
    }

    return cachedTemplate.load();
  },

  // Clear templates from the cache. If no arguments
  // are specified, clears all templates:
  // `clear()`
  //
  // If arguments are specified, clears each of the
  // specified templates from the cache:
  // `clear("#t1", "#t2", "...")`
  clear: function(){
    var i;
    var args = slice(arguments);
    var length = args.length;

    if (length > 0){
      for(i=0; i<length; i++){
        delete this.templateCaches[args[i]];
      }
    } else {
      this.templateCaches = {};
    }
  }
});

// TemplateCache instance methods, allowing each
// template cache object to manage its own state
// and know whether or not it has been loaded
_.extend(Marionette.TemplateCache.prototype, {

  // Internal method to load the template
  load: function(){
    // Guard clause to prevent loading this template more than once
    if (this.compiledTemplate){
      return this.compiledTemplate;
    }

    // Load the template and compile it
    var template = this.loadTemplate(this.templateId);
    this.compiledTemplate = this.compileTemplate(template);

    return this.compiledTemplate;
  },

  // Load a template from the DOM, by default. Override
  // this method to provide your own template retrieval
  // For asynchronous loading with AMD/RequireJS, consider
  // using a template-loader plugin as described here:
  // https://github.com/marionettejs/backbone.marionette/wiki/Using-marionette-with-requirejs
  loadTemplate: function(templateId){
    var template = Marionette.$(templateId).html();

    if (!template || template.length === 0){
      throwError("Could not find template: '" + templateId + "'", "NoTemplateError");
    }

    return template;
  },

  // Pre-compile the template before caching it. Override
  // this method if you do not need to pre-compile a template
  // (JST / RequireJS for example) or if you want to change
  // the template engine used (Handebars, etc).
  compileTemplate: function(rawTemplate){
    return _.template(rawTemplate);
  }
});


// Renderer
// --------

// Render a template with data by passing in the template
// selector and the data to render.
Marionette.Renderer = {

  // Render a template with data. The `template` parameter is
  // passed to the `TemplateCache` object to retrieve the
  // template function. Override this method to provide your own
  // custom rendering and template handling for all of Marionette.
  render: function(template, data){

    if (!template) {
      var error = new Error("Cannot render the template since it's false, null or undefined.");
      error.name = "TemplateNotFoundError";
      throw error;
    }

    var templateFunc;
    if (typeof template === "function"){
      templateFunc = template;
    } else {
      templateFunc = Marionette.TemplateCache.get(template);
    }

    return templateFunc(data);
  }
};



// Marionette.View
// ---------------

// The core view type that other Marionette views extend from.
Marionette.View = Backbone.View.extend({

  constructor: function(){
    _.bindAll(this, "render");

    var args = Array.prototype.slice.apply(arguments);
    Backbone.View.prototype.constructor.apply(this, args);

    Marionette.MonitorDOMRefresh(this);
    this.listenTo(this, "show", this.onShowCalled, this);
  },

  // import the "triggerMethod" to trigger events with corresponding
  // methods if the method exists
  triggerMethod: Marionette.triggerMethod,

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options.
  getTemplate: function(){
    return Marionette.getOption(this, "template");
  },

  // Mix in template helper methods. Looks for a
  // `templateHelpers` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateHelpers: function(target){
    target = target || {};
    var templateHelpers = this.templateHelpers;
    if (_.isFunction(templateHelpers)){
      templateHelpers = templateHelpers.call(this);
    }
    return _.extend(target, templateHelpers);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  configureTriggers: function(){
    if (!this.triggers) { return; }

    var triggerEvents = {};

    // Allow `triggers` to be configured as a function
    var triggers = _.result(this, "triggers");

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    _.each(triggers, function(value, key){

      // build the event handler function for the DOM event
      triggerEvents[key] = function(e){

        // stop the event in its tracks
        if (e && e.preventDefault){ e.preventDefault(); }
        if (e && e.stopPropagation){ e.stopPropagation(); }

        // build the args for the event
        var args = {
          view: this,
          model: this.model,
          collection: this.collection
        };

        // trigger the event
        this.triggerMethod(value, args);
      };

    }, this);

    return triggerEvents;
  },

  // Overriding Backbone.View's delegateEvents to handle
  // the `triggers`, `modelEvents`, and `collectionEvents` configuration
  delegateEvents: function(events){
    this._delegateDOMEvents(events);
    Marionette.bindEntityEvents(this, this.model, Marionette.getOption(this, "modelEvents"));
    Marionette.bindEntityEvents(this, this.collection, Marionette.getOption(this, "collectionEvents"));
  },

  // internal method to delegate DOM events and triggers
  _delegateDOMEvents: function(events){
    events = events || this.events;
    if (_.isFunction(events)){ events = events.call(this); }

    var combinedEvents = {};
    var triggers = this.configureTriggers();
    _.extend(combinedEvents, events, triggers);

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
  },

  // Overriding Backbone.View's undelegateEvents to handle unbinding
  // the `triggers`, `modelEvents`, and `collectionEvents` config
  undelegateEvents: function(){
    var args = Array.prototype.slice.call(arguments);
    Backbone.View.prototype.undelegateEvents.apply(this, args);

    Marionette.unbindEntityEvents(this, this.model, Marionette.getOption(this, "modelEvents"));
    Marionette.unbindEntityEvents(this, this.collection, Marionette.getOption(this, "collectionEvents"));
  },

  // Internal method, handles the `show` event.
  onShowCalled: function(){},

  // Default `close` implementation, for removing a view from the
  // DOM and unbinding it. Regions will call this method
  // for you. You can specify an `onClose` method in your view to
  // add custom code that is called after the view is closed.
  close: function(){
    if (this.isClosed) { return; }

    // allow the close to be stopped by returning `false`
    // from the `onBeforeClose` method
    var shouldClose = this.triggerMethod("before:close");
    if (shouldClose === false){
      return;
    }

    // mark as closed before doing the actual close, to
    // prevent infinite loops within "close" event handlers
    // that are trying to close other views
    this.isClosed = true;
    this.triggerMethod("close");

    // unbind UI elements
    this.unbindUIElements();

    // remove the view from the DOM
    this.remove();
  },

  // This method binds the elements specified in the "ui" hash inside the view's code with
  // the associated jQuery selectors.
  bindUIElements: function(){
    if (!this.ui) { return; }

    // store the ui hash in _uiBindings so they can be reset later
    // and so re-rendering the view will be able to find the bindings
    if (!this._uiBindings){
      this._uiBindings = this.ui;
    }

    // get the bindings result, as a function or otherwise
    var bindings = _.result(this, "_uiBindings");

    // empty the ui so we don't have anything to start with
    this.ui = {};

    // bind each of the selectors
    _.each(_.keys(bindings), function(key) {
      var selector = bindings[key];
      this.ui[key] = this.$(selector);
    }, this);
  },

  // This method unbinds the elements specified in the "ui" hash
  unbindUIElements: function(){
    if (!this.ui){ return; }

    // delete all of the existing ui bindings
    _.each(this.ui, function($el, name){
      delete this.ui[name];
    }, this);

    // reset the ui element to the original bindings configuration
    this.ui = this._uiBindings;
    delete this._uiBindings;
  }
});

// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView =  Marionette.View.extend({

  // Serialize the model or collection for the view. If a model is
  // found, `.toJSON()` is called. If a collection is found, `.toJSON()`
  // is also called, but is used to populate an `items` array in the
  // resulting data. If both are found, defaults to the model.
  // You can override the `serializeData` method in your own view
  // definition, to provide custom serialization for your view's data.
  serializeData: function(){
    var data = {};

    if (this.model) {
      data = this.model.toJSON();
    }
    else if (this.collection) {
      data = { items: this.collection.toJSON() };
    }

    return data;
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  render: function(){
    this.isClosed = false;

    this.triggerMethod("before:render", this);
    this.triggerMethod("item:before:render", this);

    var data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

    var template = this.getTemplate();
    var html = Marionette.Renderer.render(template, data);

    this.$el.html(html);
    this.bindUIElements();

    this.triggerMethod("render", this);
    this.triggerMethod("item:rendered", this);

    return this;
  },

  // Override the default close event to add a few
  // more events that are triggered.
  close: function(){
    if (this.isClosed){ return; }

    this.triggerMethod('item:before:close');

    Marionette.View.prototype.close.apply(this, slice(arguments));

    this.triggerMethod('item:closed');
  }
});

// Collection View
// ---------------

// A view that iterates over a Backbone.Collection
// and renders an individual ItemView for each model.
Marionette.CollectionView = Marionette.View.extend({
  // used as the prefix for item view events
  // that are forwarded through the collectionview
  itemViewEventPrefix: "itemview",

  // constructor
  constructor: function(options){
    this._initChildViewStorage();

    Marionette.View.prototype.constructor.apply(this, slice(arguments));

    this._initialEvents();
  },

  // Configured the initial events that the collection view
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  _initialEvents: function(){
    if (this.collection){
      this.listenTo(this.collection, "add", this.addChildView, this);
      this.listenTo(this.collection, "remove", this.removeItemView, this);
      this.listenTo(this.collection, "reset", this.render, this);
    }
  },

  // Handle a child item added to the collection
  addChildView: function(item, collection, options){
    this.closeEmptyView();
    var ItemView = this.getItemView(item);
    var index = this.collection.indexOf(item);
    this.addItemView(item, ItemView, index);
  },

  // Override from `Marionette.View` to guarantee the `onShow` method
  // of child views is called.
  onShowCalled: function(){
    this.children.each(function(child){
      Marionette.triggerMethod.call(child, "show");
    });
  },

  // Internal method to trigger the before render callbacks
  // and events
  triggerBeforeRender: function(){
    this.triggerMethod("before:render", this);
    this.triggerMethod("collection:before:render", this);
  },

  // Internal method to trigger the rendered callbacks and
  // events
  triggerRendered: function(){
    this.triggerMethod("render", this);
    this.triggerMethod("collection:rendered", this);
  },

  // Render the collection of items. Override this method to
  // provide your own implementation of a render function for
  // the collection view.
  render: function(){
    this.isClosed = false;
    this.triggerBeforeRender();
    this._renderChildren();
    this.triggerRendered();
    return this;
  },

  // Internal method. Separated so that CompositeView can have
  // more control over events being triggered, around the rendering
  // process
  _renderChildren: function(){
    this.closeEmptyView();
    this.closeChildren();

    if (this.collection && this.collection.length > 0) {
      this.showCollection();
    } else {
      this.showEmptyView();
    }
  },

  // Internal method to loop through each item in the
  // collection view and show it
  showCollection: function(){
    var ItemView;
    this.collection.each(function(item, index){
      ItemView = this.getItemView(item);
      this.addItemView(item, ItemView, index);
    }, this);
  },

  // Internal method to show an empty view in place of
  // a collection of item views, when the collection is
  // empty
  showEmptyView: function(){
    var EmptyView = Marionette.getOption(this, "emptyView");

    if (EmptyView && !this._showingEmptyView){
      this._showingEmptyView = true;
      var model = new Backbone.Model();
      this.addItemView(model, EmptyView, 0);
    }
  },

  // Internal method to close an existing emptyView instance
  // if one exists. Called when a collection view has been
  // rendered empty, and then an item is added to the collection.
  closeEmptyView: function(){
    if (this._showingEmptyView){
      this.closeChildren();
      delete this._showingEmptyView;
    }
  },

  // Retrieve the itemView type, either from `this.options.itemView`
  // or from the `itemView` in the object definition. The "options"
  // takes precedence.
  getItemView: function(item){
    var itemView = Marionette.getOption(this, "itemView");

    if (!itemView){
      throwError("An `itemView` must be specified", "NoItemViewError");
    }

    return itemView;
  },

  // Render the child item's view and add it to the
  // HTML for the collection view.
  addItemView: function(item, ItemView, index){
    // get the itemViewOptions if any were specified
    var itemViewOptions = Marionette.getOption(this, "itemViewOptions");
    if (_.isFunction(itemViewOptions)){
      itemViewOptions = itemViewOptions.call(this, item, index);
    }

    // build the view
    var view = this.buildItemView(item, ItemView, itemViewOptions);

    // set up the child view event forwarding
    this.addChildViewEventForwarding(view);

    // this view is about to be added
    this.triggerMethod("before:item:added", view);

    // Store the child view itself so we can properly
    // remove and/or close it later
    this.children.add(view);

    // Render it and show it
    this.renderItemView(view, index);

    // call the "show" method if the collection view
    // has already been shown
    if (this._isShown){
      Marionette.triggerMethod.call(view, "show");
    }

    // this view was added
    this.triggerMethod("after:item:added", view);
  },

  // Set up the child view event forwarding. Uses an "itemview:"
  // prefix in front of all forwarded events.
  addChildViewEventForwarding: function(view){
    var prefix = Marionette.getOption(this, "itemViewEventPrefix");

    // Forward all child item view events through the parent,
    // prepending "itemview:" to the event name
    this.listenTo(view, "all", function(){
      var args = slice(arguments);
      args[0] = prefix + ":" + args[0];
      args.splice(1, 0, view);

      Marionette.triggerMethod.apply(this, args);
    }, this);
  },

  // render the item view
  renderItemView: function(view, index) {
    view.render();
    this.appendHtml(this, view, index);
  },

  // Build an `itemView` for every model in the collection.
  buildItemView: function(item, ItemViewType, itemViewOptions){
    var options = _.extend({model: item}, itemViewOptions);
    return new ItemViewType(options);
  },

  // get the child view by item it holds, and remove it
  removeItemView: function(item){
    var view = this.children.findByModel(item);
    this.removeChildView(view);
    this.checkEmpty();
  },

  // Remove the child view and close it
  removeChildView: function(view){

    // shut down the child view properly,
    // including events that the collection has from it
    if (view){
      this.stopListening(view);

      // call 'close' or 'remove', depending on which is found
      if (view.close) { view.close(); }
      else if (view.remove) { view.remove(); }

      this.children.remove(view);
    }

    this.triggerMethod("item:removed", view);
  },

  // helper to show the empty view if the collection is empty
  checkEmpty: function() {
    // check if we're empty now, and if we are, show the
    // empty view
    if (!this.collection || this.collection.length === 0){
      this.showEmptyView();
    }
  },

  // Append the HTML to the collection's `el`.
  // Override this method to do something other
  // then `.append`.
  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.append(itemView.el);
  },

  // Internal method to set up the `children` object for
  // storing all of the child views
  _initChildViewStorage: function(){
    this.children = new Backbone.ChildViewContainer();
  },

  // Handle cleanup and other closing needs for
  // the collection of views.
  close: function(){
    if (this.isClosed){ return; }

    this.triggerMethod("collection:before:close");
    this.closeChildren();
    this.triggerMethod("collection:closed");

    Marionette.View.prototype.close.apply(this, slice(arguments));
  },

  // Close the child views that this collection view
  // is holding on to, if any
  closeChildren: function(){
    this.children.each(function(child){
      this.removeChildView(child);
    }, this);
    this.checkEmpty();
  }
});


// Composite View
// --------------

// Used for rendering a branch-leaf, hierarchical structure.
// Extends directly from CollectionView and also renders an
// an item view as `modelView`, for the top leaf
Marionette.CompositeView = Marionette.CollectionView.extend({

  // Configured the initial events that the composite view
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  _initialEvents: function(){
    if (this.collection){
      this.listenTo(this.collection, "add", this.addChildView, this);
      this.listenTo(this.collection, "remove", this.removeItemView, this);
      this.listenTo(this.collection, "reset", this._renderChildren, this);
    }
  },

  // Retrieve the `itemView` to be used when rendering each of
  // the items in the collection. The default is to return
  // `this.itemView` or Marionette.CompositeView if no `itemView`
  // has been defined
  getItemView: function(item){
    var itemView = Marionette.getOption(this, "itemView") || this.constructor;

    if (!itemView){
      throwError("An `itemView` must be specified", "NoItemViewError");
    }

    return itemView;
  },

  // Serialize the collection for the view.
  // You can override the `serializeData` method in your own view
  // definition, to provide custom serialization for your view's data.
  serializeData: function(){
    var data = {};

    if (this.model){
      data = this.model.toJSON();
    }

    return data;
  },

  // Renders the model once, and the collection once. Calling
  // this again will tell the model's view to re-render itself
  // but the collection will not re-render.
  render: function(){
    this.isRendered = true;
    this.isClosed = false;
    this.resetItemViewContainer();

    this.triggerBeforeRender();
    var html = this.renderModel();
    this.$el.html(html);
    // the ui bindings is done here and not at the end of render since they
    // will not be available until after the model is rendered, but should be
    // available before the collection is rendered.
    this.bindUIElements();
    this.triggerMethod("composite:model:rendered");

    this._renderChildren();

    this.triggerMethod("composite:rendered");
    this.triggerRendered();
    return this;
  },

  _renderChildren: function(){
    if (this.isRendered){
      Marionette.CollectionView.prototype._renderChildren.call(this);
      this.triggerMethod("composite:collection:rendered");
    }
  },

  // Render an individual model, if we have one, as
  // part of a composite view (branch / leaf). For example:
  // a treeview.
  renderModel: function(){
    var data = {};
    data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

    var template = this.getTemplate();
    return Marionette.Renderer.render(template, data);
  },

  // Appends the `el` of itemView instances to the specified
  // `itemViewContainer` (a jQuery selector). Override this method to
  // provide custom logic of how the child item view instances have their
  // HTML appended to the composite view instance.
  appendHtml: function(cv, iv, index){
    var $container = this.getItemViewContainer(cv);
    $container.append(iv.el);
  },

  // Internal method to ensure an `$itemViewContainer` exists, for the
  // `appendHtml` method to use.
  getItemViewContainer: function(containerView){
    if ("$itemViewContainer" in containerView){
      return containerView.$itemViewContainer;
    }

    var container;
    if (containerView.itemViewContainer){

      var selector = _.result(containerView, "itemViewContainer");
      container = containerView.$(selector);
      if (container.length <= 0) {
        throwError("The specified `itemViewContainer` was not found: " + containerView.itemViewContainer, "ItemViewContainerMissingError");
      }

    } else {
      container = containerView.$el;
    }

    containerView.$itemViewContainer = container;
    return container;
  },

  // Internal method to reset the `$itemViewContainer` on render
  resetItemViewContainer: function(){
    if (this.$itemViewContainer){
      delete this.$itemViewContainer;
    }
  }
});


// Layout
// ------

// Used for managing application layouts, nested layouts and
// multiple regions within an application or sub-application.
//
// A specialized view type that renders an area of HTML and then
// attaches `Region` instances to the specified `regions`.
// Used for composite view management and sub-application areas.
Marionette.Layout = Marionette.ItemView.extend({
  regionType: Marionette.Region,

  // Ensure the regions are available when the `initialize` method
  // is called.
  constructor: function (options) {
    options = options || {};

    this._firstRender = true;
    this._initializeRegions(options);

    Marionette.ItemView.call(this, options);
  },

  // Layout's render will use the existing region objects the
  // first time it is called. Subsequent calls will close the
  // views that the regions are showing and then reset the `el`
  // for the regions to the newly rendered DOM elements.
  render: function(){

    if (this._firstRender){
      // if this is the first render, don't do anything to
      // reset the regions
      this._firstRender = false;
    } else if (this.isClosed){
      // a previously closed layout means we need to
      // completely re-initialize the regions
      this._initializeRegions();
    } else {
      // If this is not the first render call, then we need to
      // re-initializing the `el` for each region
      this._reInitializeRegions();
    }

    var args = Array.prototype.slice.apply(arguments);
    var result = Marionette.ItemView.prototype.render.apply(this, args);

    return result;
  },

  // Handle closing regions, and then close the view itself.
  close: function () {
    if (this.isClosed){ return; }
    this.regionManager.close();
    var args = Array.prototype.slice.apply(arguments);
    Marionette.ItemView.prototype.close.apply(this, args);
  },

  // Add a single region, by name, to the layout
  addRegion: function(name, definition){
    var regions = {};
    regions[name] = definition;
    return this.addRegions(regions)[name];
  },

  // Add multiple regions as a {name: definition, name2: def2} object literal
  addRegions: function(regions){
    this.regions = _.extend(this.regions || {}, regions);
    return this._buildRegions(regions);
  },

  // Remove a single region from the Layout, by name
  removeRegion: function(name){
    return this.regionManager.removeRegion(name);
  },

  // internal method to build regions
  _buildRegions: function(regions){
    var that = this;

    var defaults = {
      parentEl: function(){ return that.$el; }
    };

    return this.regionManager.addRegions(regions, defaults);
  },

  // Internal method to initialize the regions that have been defined in a
  // `regions` attribute on this layout.
  _initializeRegions: function (options) {
    var regions;
    this._initRegionManager();

    if (_.isFunction(this.regions)) {
      regions = this.regions(options);
    } else {
      regions = this.regions || {};
    }

    this.addRegions(regions);
  },

  // Internal method to re-initialize all of the regions by updating the `el` that
  // they point to
  _reInitializeRegions: function(){
    this.regionManager.closeRegions();
    this.regionManager.each(function(region){
      region.reset();
    });
  },

  // Internal method to initialize the region manager
  // and all regions in it
  _initRegionManager: function(){
    this.regionManager = new Marionette.RegionManager();

    this.listenTo(this.regionManager, "region:add", function(name, region){
      this[name] = region;
      this.trigger("region:add", name, region);
    });

    this.listenTo(this.regionManager, "region:remove", function(name, region){
      delete this[name];
      this.trigger("region:remove", name, region);
    });
  }
});


// AppRouter
// ---------

// Reduce the boilerplate code of handling route events
// and then calling a single method on another object.
// Have your routers configured to call the method on
// your object, directly.
//
// Configure an AppRouter with `appRoutes`.
//
// App routers can only take one `controller` object.
// It is recommended that you divide your controller
// objects in to smaller pieces of related functionality
// and have multiple routers / controllers, instead of
// just one giant router and controller.
//
// You can also add standard routes to an AppRouter.

Marionette.AppRouter = Backbone.Router.extend({

  constructor: function(options){
    Backbone.Router.prototype.constructor.apply(this, slice(arguments));

    this.options = options;

    if (this.appRoutes){
      var controller = Marionette.getOption(this, "controller");
      this.processAppRoutes(controller, this.appRoutes);
    }
  },

  // Internal method to process the `appRoutes` for the
  // router, and turn them in to routes that trigger the
  // specified method on the specified `controller`.
  processAppRoutes: function(controller, appRoutes) {
    var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

    _.each(routeNames, function(route) {
      var methodName = appRoutes[route];
      var method = controller[methodName];

      if (!method) {
        throw new Error("Method '" + methodName + "' was not found on the controller");
      }

      this.route(route, methodName, _.bind(method, controller));
    }, this);
  }
});


// Application
// -----------

// Contain and manage the composite application as a whole.
// Stores and starts up `Region` objects, includes an
// event aggregator as `app.vent`
Marionette.Application = function(options){
  this._initRegionManager();
  this._initCallbacks = new Marionette.Callbacks();
  this.vent = new Backbone.Wreqr.EventAggregator();
  this.commands = new Backbone.Wreqr.Commands();
  this.reqres = new Backbone.Wreqr.RequestResponse();
  this.submodules = {};

  _.extend(this, options);

  this.triggerMethod = Marionette.triggerMethod;
};

_.extend(Marionette.Application.prototype, Backbone.Events, {
  // Command execution, facilitated by Backbone.Wreqr.Commands
  execute: function(){
    var args = Array.prototype.slice.apply(arguments);
    this.commands.execute.apply(this.commands, args);
  },

  // Request/response, facilitated by Backbone.Wreqr.RequestResponse
  request: function(){
    var args = Array.prototype.slice.apply(arguments);
    return this.reqres.request.apply(this.reqres, args);
  },

  // Add an initializer that is either run at when the `start`
  // method is called, or run immediately if added after `start`
  // has already been called.
  addInitializer: function(initializer){
    this._initCallbacks.add(initializer);
  },

  // kick off all of the application's processes.
  // initializes all of the regions that have been added
  // to the app, and runs all of the initializer functions
  start: function(options){
    this.triggerMethod("initialize:before", options);
    this._initCallbacks.run(options, this);
    this.triggerMethod("initialize:after", options);

    this.triggerMethod("start", options);
  },

  // Add regions to your app.
  // Accepts a hash of named strings or Region objects
  // addRegions({something: "#someRegion"})
  // addRegions({something: Region.extend({el: "#someRegion"}) });
  addRegions: function(regions){
    return this._regionManager.addRegions(regions);
  },

  // Removes a region from your app.
  // Accepts the regions name
  // removeRegion('myRegion')
  removeRegion: function(region) {
    this._regionManager.removeRegion(region);
  },

  // Create a module, attached to the application
  module: function(moduleNames, moduleDefinition){
    // slice the args, and add this application object as the
    // first argument of the array
    var args = slice(arguments);
    args.unshift(this);

    // see the Marionette.Module object for more information
    return Marionette.Module.create.apply(Marionette.Module, args);
  },

  // Internal method to set up the region manager
  _initRegionManager: function(){
    this._regionManager = new Marionette.RegionManager();

    this.listenTo(this._regionManager, "region:add", function(name, region){
      this[name] = region;
    });

    this.listenTo(this._regionManager, "region:remove", function(name, region){
      delete this[name];
    });
  }
});

// Copy the `extend` function used by Backbone's classes
Marionette.Application.extend = Marionette.extend;

// Module
// ------

// A simple module system, used to create privacy and encapsulation in
// Marionette applications
Marionette.Module = function(moduleName, app){
  this.moduleName = moduleName;

  // store sub-modules
  this.submodules = {};

  this._setupInitializersAndFinalizers();

  // store the configuration for this module
  this.app = app;
  this.startWithParent = true;

  this.triggerMethod = Marionette.triggerMethod;
};

// Extend the Module prototype with events / listenTo, so that the module
// can be used as an event aggregator or pub/sub.
_.extend(Marionette.Module.prototype, Backbone.Events, {

  // Initializer for a specific module. Initializers are run when the
  // module's `start` method is called.
  addInitializer: function(callback){
    this._initializerCallbacks.add(callback);
  },

  // Finalizers are run when a module is stopped. They are used to teardown
  // and finalize any variables, references, events and other code that the
  // module had set up.
  addFinalizer: function(callback){
    this._finalizerCallbacks.add(callback);
  },

  // Start the module, and run all of its initializers
  start: function(options){
    // Prevent re-starting a module that is already started
    if (this._isInitialized){ return; }

    // start the sub-modules (depth-first hierarchy)
    _.each(this.submodules, function(mod){
      // check to see if we should start the sub-module with this parent
      if (mod.startWithParent){
        mod.start(options);
      }
    });

    // run the callbacks to "start" the current module
    this.triggerMethod("before:start", options);

    this._initializerCallbacks.run(options, this);
    this._isInitialized = true;

    this.triggerMethod("start", options);
  },

  // Stop this module by running its finalizers and then stop all of
  // the sub-modules for this module
  stop: function(){
    // if we are not initialized, don't bother finalizing
    if (!this._isInitialized){ return; }
    this._isInitialized = false;

    Marionette.triggerMethod.call(this, "before:stop");

    // stop the sub-modules; depth-first, to make sure the
    // sub-modules are stopped / finalized before parents
    _.each(this.submodules, function(mod){ mod.stop(); });

    // run the finalizers
    this._finalizerCallbacks.run(undefined,this);

    // reset the initializers and finalizers
    this._initializerCallbacks.reset();
    this._finalizerCallbacks.reset();

    Marionette.triggerMethod.call(this, "stop");
  },

  // Configure the module with a definition function and any custom args
  // that are to be passed in to the definition function
  addDefinition: function(moduleDefinition, customArgs){
    this._runModuleDefinition(moduleDefinition, customArgs);
  },

  // Internal method: run the module definition function with the correct
  // arguments
  _runModuleDefinition: function(definition, customArgs){
    if (!definition){ return; }

    // build the correct list of arguments for the module definition
    var args = _.flatten([
      this,
      this.app,
      Backbone,
      Marionette,
      Marionette.$, _,
      customArgs
    ]);

    definition.apply(this, args);
  },

  // Internal method: set up new copies of initializers and finalizers.
  // Calling this method will wipe out all existing initializers and
  // finalizers.
  _setupInitializersAndFinalizers: function(){
    this._initializerCallbacks = new Marionette.Callbacks();
    this._finalizerCallbacks = new Marionette.Callbacks();
  }
});

// Type methods to create modules
_.extend(Marionette.Module, {

  // Create a module, hanging off the app parameter as the parent object.
  create: function(app, moduleNames, moduleDefinition){
    var module = app;

    // get the custom args passed in after the module definition and
    // get rid of the module name and definition function
    var customArgs = slice(arguments);
    customArgs.splice(0, 3);

    // split the module names and get the length
    moduleNames = moduleNames.split(".");
    var length = moduleNames.length;

    // store the module definition for the last module in the chain
    var moduleDefinitions = [];
    moduleDefinitions[length-1] = moduleDefinition;

    // Loop through all the parts of the module definition
    _.each(moduleNames, function(moduleName, i){
      var parentModule = module;
      module = this._getModule(parentModule, moduleName, app);
      this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
    }, this);

    // Return the last module in the definition chain
    return module;
  },

  _getModule: function(parentModule, moduleName, app, def, args){
    // Get an existing module of this name if we have one
    var module = parentModule[moduleName];

    if (!module){
      // Create a new module if we don't have one
      module = new Marionette.Module(moduleName, app);
      parentModule[moduleName] = module;
      // store the module on the parent
      parentModule.submodules[moduleName] = module;
    }

    return module;
  },

  _addModuleDefinition: function(parentModule, module, def, args){
    var fn;
    var startWithParent;

    if (_.isFunction(def)){
      // if a function is supplied for the module definition
      fn = def;
      startWithParent = true;

    } else if (_.isObject(def)){
      // if an object is supplied
      fn = def.define;
      startWithParent = def.startWithParent;

    } else {
      // if nothing is supplied
      startWithParent = true;
    }

    // add module definition if needed
    if (fn){
      module.addDefinition(fn, args);
    }

    // `and` the two together, ensuring a single `false` will prevent it
    // from starting with the parent
    module.startWithParent = module.startWithParent && startWithParent;

    // setup auto-start if needed
    if (module.startWithParent && !module.startWithParentIsConfigured){

      // only configure this once
      module.startWithParentIsConfigured = true;

      // add the module initializer config
      parentModule.addInitializer(function(options){
        if (module.startWithParent){
          module.start(options);
        }
      });

    }

  }
});



  return Marionette;
})(this, Backbone, _);


/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/

// lib/handlebars/browser-prefix.js
(function(undefined) {
  var Handlebars = {};
;
// lib/handlebars/base.js

Handlebars.VERSION = "1.0.0";
Handlebars.COMPILER_REVISION = 4;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

var toString = Object.prototype.toString,
    functionType = '[object Function]',
    objectType = '[object Object]';

Handlebars.registerHelper = function(name, fn, inverse) {
  if (toString.call(name) === objectType) {
    if (inverse || fn) { throw new Handlebars.Exception('Arg not supported with multiple helpers'); }
    Handlebars.Utils.extend(this.helpers, name);
  } else {
    if (inverse) { fn.not = inverse; }
    this.helpers[name] = fn;
  }
};

Handlebars.registerPartial = function(name, str) {
  if (toString.call(name) === objectType) {
    Handlebars.Utils.extend(this.partials,  name);
  } else {
    this.partials[name] = str;
  }
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Missing helper: '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;

  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(conditional, options) {
  var type = toString.call(conditional);
  if(type === functionType) { conditional = conditional.call(this); }

  if(!conditional || Handlebars.Utils.isEmpty(conditional)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(conditional, options) {
  return Handlebars.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn});
});

Handlebars.registerHelper('with', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"simpleInverse":6,"statements":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"CLOSE_UNESCAPED":24,"OPEN_PARTIAL":25,"partialName":26,"params":27,"hash":28,"dataName":29,"param":30,"STRING":31,"INTEGER":32,"BOOLEAN":33,"hashSegments":34,"hashSegment":35,"ID":36,"EQUALS":37,"DATA":38,"pathSegments":39,"SEP":40,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"CLOSE_UNESCAPED",25:"OPEN_PARTIAL",31:"STRING",32:"INTEGER",33:"BOOLEAN",36:"ID",37:"EQUALS",38:"DATA",40:"SEP"},
productions_: [0,[3,2],[4,2],[4,3],[4,2],[4,1],[4,1],[4,0],[7,1],[7,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[6,2],[17,3],[17,2],[17,2],[17,1],[17,1],[27,2],[27,1],[30,1],[30,1],[30,1],[30,1],[30,1],[28,1],[34,2],[34,1],[35,3],[35,3],[35,3],[35,3],[35,3],[26,1],[26,1],[26,1],[29,2],[21,1],[39,3],[39,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1];
break;
case 2: this.$ = new yy.ProgramNode([], $$[$0]);
break;
case 3: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]);
break;
case 4: this.$ = new yy.ProgramNode($$[$0-1], []);
break;
case 5: this.$ = new yy.ProgramNode($$[$0]);
break;
case 6: this.$ = new yy.ProgramNode([], []);
break;
case 7: this.$ = new yy.ProgramNode([]);
break;
case 8: this.$ = [$$[$0]];
break;
case 9: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 10: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0]);
break;
case 11: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0]);
break;
case 12: this.$ = $$[$0];
break;
case 13: this.$ = $$[$0];
break;
case 14: this.$ = new yy.ContentNode($$[$0]);
break;
case 15: this.$ = new yy.CommentNode($$[$0]);
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]);
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]);
break;
case 18: this.$ = $$[$0-1];
break;
case 19:
    // Parsing out the '&' escape token at this level saves ~500 bytes after min due to the removal of one parser node.
    this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], $$[$0-2][2] === '&');

break;
case 20: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true);
break;
case 21: this.$ = new yy.PartialNode($$[$0-1]);
break;
case 22: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]);
break;
case 23:
break;
case 24: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]];
break;
case 25: this.$ = [[$$[$0-1]].concat($$[$0]), null];
break;
case 26: this.$ = [[$$[$0-1]], $$[$0]];
break;
case 27: this.$ = [[$$[$0]], null];
break;
case 28: this.$ = [[$$[$0]], null];
break;
case 29: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 30: this.$ = [$$[$0]];
break;
case 31: this.$ = $$[$0];
break;
case 32: this.$ = new yy.StringNode($$[$0]);
break;
case 33: this.$ = new yy.IntegerNode($$[$0]);
break;
case 34: this.$ = new yy.BooleanNode($$[$0]);
break;
case 35: this.$ = $$[$0];
break;
case 36: this.$ = new yy.HashNode($$[$0]);
break;
case 37: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 38: this.$ = [$$[$0]];
break;
case 39: this.$ = [$$[$0-2], $$[$0]];
break;
case 40: this.$ = [$$[$0-2], new yy.StringNode($$[$0])];
break;
case 41: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])];
break;
case 42: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])];
break;
case 43: this.$ = [$$[$0-2], $$[$0]];
break;
case 44: this.$ = new yy.PartialNameNode($$[$0]);
break;
case 45: this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0]));
break;
case 46: this.$ = new yy.PartialNameNode(new yy.IntegerNode($$[$0]));
break;
case 47: this.$ = new yy.DataNode($$[$0]);
break;
case 48: this.$ = new yy.IdNode($$[$0]);
break;
case 49: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2];
break;
case 50: this.$ = [{part: $$[$0]}];
break;
}
},
table: [{3:1,4:2,5:[2,7],6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],22:[1,14],23:[1,15],25:[1,16]},{1:[3]},{5:[1,17]},{5:[2,6],7:18,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,6],22:[1,14],23:[1,15],25:[1,16]},{5:[2,5],6:20,8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,5],22:[1,14],23:[1,15],25:[1,16]},{17:23,18:[1,22],21:24,29:25,36:[1,28],38:[1,27],39:26},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],25:[2,8]},{4:29,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],25:[1,16]},{4:30,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],25:[1,16]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],25:[2,12]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],25:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],25:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],25:[2,15]},{17:31,21:24,29:25,36:[1,28],38:[1,27],39:26},{17:32,21:24,29:25,36:[1,28],38:[1,27],39:26},{17:33,21:24,29:25,36:[1,28],38:[1,27],39:26},{21:35,26:34,31:[1,36],32:[1,37],36:[1,28],39:26},{1:[2,1]},{5:[2,2],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,2],22:[1,14],23:[1,15],25:[1,16]},{17:23,21:24,29:25,36:[1,28],38:[1,27],39:26},{5:[2,4],7:38,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,4],22:[1,14],23:[1,15],25:[1,16]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],25:[2,9]},{5:[2,23],14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],25:[2,23]},{18:[1,39]},{18:[2,27],21:44,24:[2,27],27:40,28:41,29:48,30:42,31:[1,45],32:[1,46],33:[1,47],34:43,35:49,36:[1,50],38:[1,27],39:26},{18:[2,28],24:[2,28]},{18:[2,48],24:[2,48],31:[2,48],32:[2,48],33:[2,48],36:[2,48],38:[2,48],40:[1,51]},{21:52,36:[1,28],39:26},{18:[2,50],24:[2,50],31:[2,50],32:[2,50],33:[2,50],36:[2,50],38:[2,50],40:[2,50]},{10:53,20:[1,54]},{10:55,20:[1,54]},{18:[1,56]},{18:[1,57]},{24:[1,58]},{18:[1,59],21:60,36:[1,28],39:26},{18:[2,44],36:[2,44]},{18:[2,45],36:[2,45]},{18:[2,46],36:[2,46]},{5:[2,3],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,3],22:[1,14],23:[1,15],25:[1,16]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],25:[2,17]},{18:[2,25],21:44,24:[2,25],28:61,29:48,30:62,31:[1,45],32:[1,46],33:[1,47],34:43,35:49,36:[1,50],38:[1,27],39:26},{18:[2,26],24:[2,26]},{18:[2,30],24:[2,30],31:[2,30],32:[2,30],33:[2,30],36:[2,30],38:[2,30]},{18:[2,36],24:[2,36],35:63,36:[1,64]},{18:[2,31],24:[2,31],31:[2,31],32:[2,31],33:[2,31],36:[2,31],38:[2,31]},{18:[2,32],24:[2,32],31:[2,32],32:[2,32],33:[2,32],36:[2,32],38:[2,32]},{18:[2,33],24:[2,33],31:[2,33],32:[2,33],33:[2,33],36:[2,33],38:[2,33]},{18:[2,34],24:[2,34],31:[2,34],32:[2,34],33:[2,34],36:[2,34],38:[2,34]},{18:[2,35],24:[2,35],31:[2,35],32:[2,35],33:[2,35],36:[2,35],38:[2,35]},{18:[2,38],24:[2,38],36:[2,38]},{18:[2,50],24:[2,50],31:[2,50],32:[2,50],33:[2,50],36:[2,50],37:[1,65],38:[2,50],40:[2,50]},{36:[1,66]},{18:[2,47],24:[2,47],31:[2,47],32:[2,47],33:[2,47],36:[2,47],38:[2,47]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],25:[2,10]},{21:67,36:[1,28],39:26},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],25:[2,11]},{14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],25:[2,16]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],25:[2,19]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],25:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],25:[2,21]},{18:[1,68]},{18:[2,24],24:[2,24]},{18:[2,29],24:[2,29],31:[2,29],32:[2,29],33:[2,29],36:[2,29],38:[2,29]},{18:[2,37],24:[2,37],36:[2,37]},{37:[1,65]},{21:69,29:73,31:[1,70],32:[1,71],33:[1,72],36:[1,28],38:[1,27],39:26},{18:[2,49],24:[2,49],31:[2,49],32:[2,49],33:[2,49],36:[2,49],38:[2,49],40:[2,49]},{18:[1,74]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],25:[2,22]},{18:[2,39],24:[2,39],36:[2,39]},{18:[2,40],24:[2,40],36:[2,40]},{18:[2,41],24:[2,41],36:[2,41]},{18:[2,42],24:[2,42],36:[2,42]},{18:[2,43],24:[2,43],36:[2,43]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],25:[2,18]}],
defaultActions: {17:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: yy_.yytext = "\\"; return 14;
break;
case 1:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;

break;
case 2: return 14;
break;
case 3:
                                   if(yy_.yytext.slice(-1) !== "\\") this.popState();
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1);
                                   return 14;

break;
case 4: yy_.yytext = yy_.yytext.substr(0, yy_.yyleng-4); this.popState(); return 15;
break;
case 5: return 25;
break;
case 6: return 16;
break;
case 7: return 20;
break;
case 8: return 19;
break;
case 9: return 19;
break;
case 10: return 23;
break;
case 11: return 22;
break;
case 12: this.popState(); this.begin('com');
break;
case 13: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15;
break;
case 14: return 22;
break;
case 15: return 37;
break;
case 16: return 36;
break;
case 17: return 36;
break;
case 18: return 40;
break;
case 19: /*ignore whitespace*/
break;
case 20: this.popState(); return 24;
break;
case 21: this.popState(); return 18;
break;
case 22: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 31;
break;
case 23: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\'/g,"'"); return 31;
break;
case 24: return 38;
break;
case 25: return 33;
break;
case 26: return 33;
break;
case 27: return 32;
break;
case 28: return 36;
break;
case 29: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 36;
break;
case 30: return 'INVALID';
break;
case 31: return 5;
break;
}
};
lexer.rules = [/^(?:\\\\(?=(\{\{)))/,/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[}\/ ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}\}\})/,/^(?:\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=[}\s]))/,/^(?:false(?=[}\s]))/,/^(?:-?[0-9]+(?=[}\s]))/,/^(?:[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],"inclusive":false},"emu":{"rules":[3],"inclusive":false},"com":{"rules":[4],"inclusive":false},"INITIAL":{"rules":[0,1,2,31],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();;
// lib/handlebars/compiler/base.js

Handlebars.Parser = handlebars;

Handlebars.parse = function(input) {

  // Just return if an already-compile AST was passed in.
  if(input.constructor === Handlebars.AST.ProgramNode) { return input; }

  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(input);
};
;
// lib/handlebars/compiler/ast.js
Handlebars.AST = {};

Handlebars.AST.ProgramNode = function(statements, inverse) {
  this.type = "program";
  this.statements = statements;
  if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
};

Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
  this.type = "mustache";
  this.escaped = !unescaped;
  this.hash = hash;

  var id = this.id = rawParams[0];
  var params = this.params = rawParams.slice(1);

  // a mustache is an eligible helper if:
  // * its id is simple (a single part, not `this` or `..`)
  var eligibleHelper = this.eligibleHelper = id.isSimple;

  // a mustache is definitely a helper if:
  // * it is an eligible helper, and
  // * it has at least one parameter or hash segment
  this.isHelper = eligibleHelper && (params.length || hash);

  // if a mustache is an eligible helper but not a definite
  // helper, it is ambiguous, and will be resolved in a later
  // pass or at runtime.
};

Handlebars.AST.PartialNode = function(partialName, context) {
  this.type         = "partial";
  this.partialName  = partialName;
  this.context      = context;
};

Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
  if(mustache.id.original !== close.original) {
    throw new Handlebars.Exception(mustache.id.original + " doesn't match " + close.original);
  }

  this.type = "block";
  this.mustache = mustache;
  this.program  = program;
  this.inverse  = inverse;

  if (this.inverse && !this.program) {
    this.isInverse = true;
  }
};

Handlebars.AST.ContentNode = function(string) {
  this.type = "content";
  this.string = string;
};

Handlebars.AST.HashNode = function(pairs) {
  this.type = "hash";
  this.pairs = pairs;
};

Handlebars.AST.IdNode = function(parts) {
  this.type = "ID";

  var original = "",
      dig = [],
      depth = 0;

  for(var i=0,l=parts.length; i<l; i++) {
    var part = parts[i].part;
    original += (parts[i].separator || '') + part;

    if (part === ".." || part === "." || part === "this") {
      if (dig.length > 0) { throw new Handlebars.Exception("Invalid path: " + original); }
      else if (part === "..") { depth++; }
      else { this.isScoped = true; }
    }
    else { dig.push(part); }
  }

  this.original = original;
  this.parts    = dig;
  this.string   = dig.join('.');
  this.depth    = depth;

  // an ID is simple if it only has one part, and that part is not
  // `..` or `this`.
  this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

  this.stringModeValue = this.string;
};

Handlebars.AST.PartialNameNode = function(name) {
  this.type = "PARTIAL_NAME";
  this.name = name.original;
};

Handlebars.AST.DataNode = function(id) {
  this.type = "DATA";
  this.id = id;
};

Handlebars.AST.StringNode = function(string) {
  this.type = "STRING";
  this.original =
    this.string =
    this.stringModeValue = string;
};

Handlebars.AST.IntegerNode = function(integer) {
  this.type = "INTEGER";
  this.original =
    this.integer = integer;
  this.stringModeValue = Number(integer);
};

Handlebars.AST.BooleanNode = function(bool) {
  this.type = "BOOLEAN";
  this.bool = bool;
  this.stringModeValue = bool === "true";
};

Handlebars.AST.CommentNode = function(comment) {
  this.type = "comment";
  this.comment = comment;
};
;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

var escapeChar = function(chr) {
  return escape[chr] || "&amp;";
};

Handlebars.Utils = {
  extend: function(obj, value) {
    for(var key in value) {
      if(value.hasOwnProperty(key)) {
        obj[key] = value[key];
      }
    }
  },

  escapeExpression: function(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    } else if (string == null || string === false) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = string.toString();

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  },

  isEmpty: function(value) {
    if (!value && value !== 0) {
      return true;
    } else if(toString.call(value) === "[object Array]" && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
;
// lib/handlebars/compiler/compiler.js

/*jshint eqnull:true*/
var Compiler = Handlebars.Compiler = function() {};

// the foundHelper register will disambiguate helper lookup from finding a
// function in a context. This is necessary for mustache compatibility, which
// requires that context functions in blocks are evaluated by blockHelperMissing,
// and then proceed as if the resulting value was provided to blockHelperMissing.

Compiler.prototype = {
  compiler: Compiler,

  disassemble: function() {
    var opcodes = this.opcodes, opcode, out = [], params, param;

    for (var i=0, l=opcodes.length; i<l; i++) {
      opcode = opcodes[i];

      if (opcode.opcode === 'DECLARE') {
        out.push("DECLARE " + opcode.name + "=" + opcode.value);
      } else {
        params = [];
        for (var j=0; j<opcode.args.length; j++) {
          param = opcode.args[j];
          if (typeof param === "string") {
            param = "\"" + param.replace("\n", "\\n") + "\"";
          }
          params.push(param);
        }
        out.push(opcode.opcode + " " + params.join(" "));
      }
    }

    return out.join("\n");
  },
  equals: function(other) {
    var len = this.opcodes.length;
    if (other.opcodes.length !== len) {
      return false;
    }

    for (var i = 0; i < len; i++) {
      var opcode = this.opcodes[i],
          otherOpcode = other.opcodes[i];
      if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
        return false;
      }
      for (var j = 0; j < opcode.args.length; j++) {
        if (opcode.args[j] !== otherOpcode.args[j]) {
          return false;
        }
      }
    }

    len = this.children.length;
    if (other.children.length !== len) {
      return false;
    }
    for (i = 0; i < len; i++) {
      if (!this.children[i].equals(other.children[i])) {
        return false;
      }
    }

    return true;
  },

  guid: 0,

  compile: function(program, options) {
    this.children = [];
    this.depths = {list: []};
    this.options = options;

    // These changes will propagate to the other compiler components
    var knownHelpers = this.options.knownHelpers;
    this.options.knownHelpers = {
      'helperMissing': true,
      'blockHelperMissing': true,
      'each': true,
      'if': true,
      'unless': true,
      'with': true,
      'log': true
    };
    if (knownHelpers) {
      for (var name in knownHelpers) {
        this.options.knownHelpers[name] = knownHelpers[name];
      }
    }

    return this.program(program);
  },

  accept: function(node) {
    return this[node.type](node);
  },

  program: function(program) {
    var statements = program.statements, statement;
    this.opcodes = [];

    for(var i=0, l=statements.length; i<l; i++) {
      statement = statements[i];
      this[statement.type](statement);
    }
    this.isSimple = l === 1;

    this.depths.list = this.depths.list.sort(function(a, b) {
      return a - b;
    });

    return this;
  },

  compileProgram: function(program) {
    var result = new this.compiler().compile(program, this.options);
    var guid = this.guid++, depth;

    this.usePartial = this.usePartial || result.usePartial;

    this.children[guid] = result;

    for(var i=0, l=result.depths.list.length; i<l; i++) {
      depth = result.depths.list[i];

      if(depth < 2) { continue; }
      else { this.addDepth(depth - 1); }
    }

    return guid;
  },

  block: function(block) {
    var mustache = block.mustache,
        program = block.program,
        inverse = block.inverse;

    if (program) {
      program = this.compileProgram(program);
    }

    if (inverse) {
      inverse = this.compileProgram(inverse);
    }

    var type = this.classifyMustache(mustache);

    if (type === "helper") {
      this.helperMustache(mustache, program, inverse);
    } else if (type === "simple") {
      this.simpleMustache(mustache);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('blockValue');
    } else {
      this.ambiguousMustache(mustache, program, inverse);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('ambiguousBlockValue');
    }

    this.opcode('append');
  },

  hash: function(hash) {
    var pairs = hash.pairs, pair, val;

    this.opcode('pushHash');

    for(var i=0, l=pairs.length; i<l; i++) {
      pair = pairs[i];
      val  = pair[1];

      if (this.options.stringParams) {
        if(val.depth) {
          this.addDepth(val.depth);
        }
        this.opcode('getContext', val.depth || 0);
        this.opcode('pushStringParam', val.stringModeValue, val.type);
      } else {
        this.accept(val);
      }

      this.opcode('assignToHash', pair[0]);
    }
    this.opcode('popHash');
  },

  partial: function(partial) {
    var partialName = partial.partialName;
    this.usePartial = true;

    if(partial.context) {
      this.ID(partial.context);
    } else {
      this.opcode('push', 'depth0');
    }

    this.opcode('invokePartial', partialName.name);
    this.opcode('append');
  },

  content: function(content) {
    this.opcode('appendContent', content.string);
  },

  mustache: function(mustache) {
    var options = this.options;
    var type = this.classifyMustache(mustache);

    if (type === "simple") {
      this.simpleMustache(mustache);
    } else if (type === "helper") {
      this.helperMustache(mustache);
    } else {
      this.ambiguousMustache(mustache);
    }

    if(mustache.escaped && !options.noEscape) {
      this.opcode('appendEscaped');
    } else {
      this.opcode('append');
    }
  },

  ambiguousMustache: function(mustache, program, inverse) {
    var id = mustache.id,
        name = id.parts[0],
        isBlock = program != null || inverse != null;

    this.opcode('getContext', id.depth);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    this.opcode('invokeAmbiguous', name, isBlock);
  },

  simpleMustache: function(mustache) {
    var id = mustache.id;

    if (id.type === 'DATA') {
      this.DATA(id);
    } else if (id.parts.length) {
      this.ID(id);
    } else {
      // Simplified ID for `this`
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);
      this.opcode('pushContext');
    }

    this.opcode('resolvePossibleLambda');
  },

  helperMustache: function(mustache, program, inverse) {
    var params = this.setupFullMustacheParams(mustache, program, inverse),
        name = mustache.id.parts[0];

    if (this.options.knownHelpers[name]) {
      this.opcode('invokeKnownHelper', params.length, name);
    } else if (this.options.knownHelpersOnly) {
      throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
    } else {
      this.opcode('invokeHelper', params.length, name);
    }
  },

  ID: function(id) {
    this.addDepth(id.depth);
    this.opcode('getContext', id.depth);

    var name = id.parts[0];
    if (!name) {
      this.opcode('pushContext');
    } else {
      this.opcode('lookupOnContext', id.parts[0]);
    }

    for(var i=1, l=id.parts.length; i<l; i++) {
      this.opcode('lookup', id.parts[i]);
    }
  },

  DATA: function(data) {
    this.options.data = true;
    if (data.id.isScoped || data.id.depth) {
      throw new Handlebars.Exception('Scoped data references are not supported: ' + data.original);
    }

    this.opcode('lookupData');
    var parts = data.id.parts;
    for(var i=0, l=parts.length; i<l; i++) {
      this.opcode('lookup', parts[i]);
    }
  },

  STRING: function(string) {
    this.opcode('pushString', string.string);
  },

  INTEGER: function(integer) {
    this.opcode('pushLiteral', integer.integer);
  },

  BOOLEAN: function(bool) {
    this.opcode('pushLiteral', bool.bool);
  },

  comment: function() {},

  // HELPERS
  opcode: function(name) {
    this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
  },

  declare: function(name, value) {
    this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
  },

  addDepth: function(depth) {
    if(isNaN(depth)) { throw new Error("EWOT"); }
    if(depth === 0) { return; }

    if(!this.depths[depth]) {
      this.depths[depth] = true;
      this.depths.list.push(depth);
    }
  },

  classifyMustache: function(mustache) {
    var isHelper   = mustache.isHelper;
    var isEligible = mustache.eligibleHelper;
    var options    = this.options;

    // if ambiguous, we can possibly resolve the ambiguity now
    if (isEligible && !isHelper) {
      var name = mustache.id.parts[0];

      if (options.knownHelpers[name]) {
        isHelper = true;
      } else if (options.knownHelpersOnly) {
        isEligible = false;
      }
    }

    if (isHelper) { return "helper"; }
    else if (isEligible) { return "ambiguous"; }
    else { return "simple"; }
  },

  pushParams: function(params) {
    var i = params.length, param;

    while(i--) {
      param = params[i];

      if(this.options.stringParams) {
        if(param.depth) {
          this.addDepth(param.depth);
        }

        this.opcode('getContext', param.depth || 0);
        this.opcode('pushStringParam', param.stringModeValue, param.type);
      } else {
        this[param.type](param);
      }
    }
  },

  setupMustacheParams: function(mustache) {
    var params = mustache.params;
    this.pushParams(params);

    if(mustache.hash) {
      this.hash(mustache.hash);
    } else {
      this.opcode('emptyHash');
    }

    return params;
  },

  // this will replace setupMustacheParams when we're done
  setupFullMustacheParams: function(mustache, program, inverse) {
    var params = mustache.params;
    this.pushParams(params);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    if(mustache.hash) {
      this.hash(mustache.hash);
    } else {
      this.opcode('emptyHash');
    }

    return params;
  }
};

Handlebars.precompile = function(input, options) {
  if (input == null || (typeof input !== 'string' && input.constructor !== Handlebars.AST.ProgramNode)) {
    throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  var ast = Handlebars.parse(input);
  var environment = new Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(input, options) {
  if (input == null || (typeof input !== 'string' && input.constructor !== Handlebars.AST.ProgramNode)) {
    throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  var compiled;
  function compile() {
    var ast = Handlebars.parse(input);
    var environment = new Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};

;
// lib/handlebars/compiler/javascript-compiler.js
/*jshint eqnull:true*/

var Literal = function(value) {
  this.value = value;
};


var JavaScriptCompiler = Handlebars.JavaScriptCompiler = function() {};

JavaScriptCompiler.prototype = {
  // PUBLIC API: You can override these methods in a subclass to provide
  // alternative compiled forms for name lookup and buffering semantics
  nameLookup: function(parent, name /* , type*/) {
    if (/^[0-9]+$/.test(name)) {
      return parent + "[" + name + "]";
    } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
      return parent + "." + name;
    }
    else {
      return parent + "['" + name + "']";
    }
  },

  appendToBuffer: function(string) {
    if (this.environment.isSimple) {
      return "return " + string + ";";
    } else {
      return {
        appendToBuffer: true,
        content: string,
        toString: function() { return "buffer += " + string + ";"; }
      };
    }
  },

  initializeBuffer: function() {
    return this.quotedString("");
  },

  namespace: "Handlebars",
  // END PUBLIC API

  compile: function(environment, options, context, asObject) {
    this.environment = environment;
    this.options = options || {};

    Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");

    this.name = this.environment.name;
    this.isChild = !!context;
    this.context = context || {
      programs: [],
      environments: [],
      aliases: { }
    };

    this.preamble();

    this.stackSlot = 0;
    this.stackVars = [];
    this.registers = { list: [] };
    this.compileStack = [];
    this.inlineStack = [];

    this.compileChildren(environment, options);

    var opcodes = environment.opcodes, opcode;

    this.i = 0;

    for(var l=opcodes.length; this.i<l; this.i++) {
      opcode = opcodes[this.i];

      if(opcode.opcode === 'DECLARE') {
        this[opcode.name] = opcode.value;
      } else {
        this[opcode.opcode].apply(this, opcode.args);
      }
    }

    return this.createFunctionContext(asObject);
  },

  nextOpcode: function() {
    var opcodes = this.environment.opcodes;
    return opcodes[this.i + 1];
  },

  eat: function() {
    this.i = this.i + 1;
  },

  preamble: function() {
    var out = [];

    if (!this.isChild) {
      var namespace = this.namespace;

      var copies = "helpers = this.merge(helpers, " + namespace + ".helpers);";
      if (this.environment.usePartial) { copies = copies + " partials = this.merge(partials, " + namespace + ".partials);"; }
      if (this.options.data) { copies = copies + " data = data || {};"; }
      out.push(copies);
    } else {
      out.push('');
    }

    if (!this.environment.isSimple) {
      out.push(", buffer = " + this.initializeBuffer());
    } else {
      out.push("");
    }

    // track the last context pushed into place to allow skipping the
    // getContext opcode when it would be a noop
    this.lastContext = 0;
    this.source = out;
  },

  createFunctionContext: function(asObject) {
    var locals = this.stackVars.concat(this.registers.list);

    if(locals.length > 0) {
      this.source[1] = this.source[1] + ", " + locals.join(", ");
    }

    // Generate minimizer alias mappings
    if (!this.isChild) {
      for (var alias in this.context.aliases) {
        if (this.context.aliases.hasOwnProperty(alias)) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }
    }

    if (this.source[1]) {
      this.source[1] = "var " + this.source[1].substring(2) + ";";
    }

    // Merge children
    if (!this.isChild) {
      this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
    }

    if (!this.environment.isSimple) {
      this.source.push("return buffer;");
    }

    var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

    for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
      params.push("depth" + this.environment.depths.list[i]);
    }

    // Perform a second pass over the output to merge content when possible
    var source = this.mergeSource();

    if (!this.isChild) {
      var revision = Handlebars.COMPILER_REVISION,
          versions = Handlebars.REVISION_CHANGES[revision];
      source = "this.compilerInfo = ["+revision+",'"+versions+"'];\n"+source;
    }

    if (asObject) {
      params.push(source);

      return Function.apply(this, params);
    } else {
      var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + source + '}';
      Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
      return functionSource;
    }
  },
  mergeSource: function() {
    // WARN: We are not handling the case where buffer is still populated as the source should
    // not have buffer append operations as their final action.
    var source = '',
        buffer;
    for (var i = 0, len = this.source.length; i < len; i++) {
      var line = this.source[i];
      if (line.appendToBuffer) {
        if (buffer) {
          buffer = buffer + '\n    + ' + line.content;
        } else {
          buffer = line.content;
        }
      } else {
        if (buffer) {
          source += 'buffer += ' + buffer + ';\n  ';
          buffer = undefined;
        }
        source += line + '\n  ';
      }
    }
    return source;
  },

  // [blockValue]
  //
  // On stack, before: hash, inverse, program, value
  // On stack, after: return value of blockHelperMissing
  //
  // The purpose of this opcode is to take a block of the form
  // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
  // replace it on the stack with the result of properly
  // invoking blockHelperMissing.
  blockValue: function() {
    this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

    var params = ["depth0"];
    this.setupParams(0, params);

    this.replaceStack(function(current) {
      params.splice(1, 0, current);
      return "blockHelperMissing.call(" + params.join(", ") + ")";
    });
  },

  // [ambiguousBlockValue]
  //
  // On stack, before: hash, inverse, program, value
  // Compiler value, before: lastHelper=value of last found helper, if any
  // On stack, after, if no lastHelper: same as [blockValue]
  // On stack, after, if lastHelper: value
  ambiguousBlockValue: function() {
    this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

    var params = ["depth0"];
    this.setupParams(0, params);

    var current = this.topStack();
    params.splice(1, 0, current);

    // Use the options value generated from the invocation
    params[params.length-1] = 'options';

    this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
  },

  // [appendContent]
  //
  // On stack, before: ...
  // On stack, after: ...
  //
  // Appends the string value of `content` to the current buffer
  appendContent: function(content) {
    this.source.push(this.appendToBuffer(this.quotedString(content)));
  },

  // [append]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Coerces `value` to a String and appends it to the current buffer.
  //
  // If `value` is truthy, or 0, it is coerced into a string and appended
  // Otherwise, the empty string is appended
  append: function() {
    // Force anything that is inlined onto the stack so we don't have duplication
    // when we examine local
    this.flushInline();
    var local = this.popStack();
    this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
    if (this.environment.isSimple) {
      this.source.push("else { " + this.appendToBuffer("''") + " }");
    }
  },

  // [appendEscaped]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Escape `value` and append it to the buffer
  appendEscaped: function() {
    this.context.aliases.escapeExpression = 'this.escapeExpression';

    this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
  },

  // [getContext]
  //
  // On stack, before: ...
  // On stack, after: ...
  // Compiler value, after: lastContext=depth
  //
  // Set the value of the `lastContext` compiler value to the depth
  getContext: function(depth) {
    if(this.lastContext !== depth) {
      this.lastContext = depth;
    }
  },

  // [lookupOnContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext[name], ...
  //
  // Looks up the value of `name` on the current context and pushes
  // it onto the stack.
  lookupOnContext: function(name) {
    this.push(this.nameLookup('depth' + this.lastContext, name, 'context'));
  },

  // [pushContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext, ...
  //
  // Pushes the value of the current context onto the stack.
  pushContext: function() {
    this.pushStackLiteral('depth' + this.lastContext);
  },

  // [resolvePossibleLambda]
  //
  // On stack, before: value, ...
  // On stack, after: resolved value, ...
  //
  // If the `value` is a lambda, replace it on the stack by
  // the return value of the lambda
  resolvePossibleLambda: function() {
    this.context.aliases.functionType = '"function"';

    this.replaceStack(function(current) {
      return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
    });
  },

  // [lookup]
  //
  // On stack, before: value, ...
  // On stack, after: value[name], ...
  //
  // Replace the value on the stack with the result of looking
  // up `name` on `value`
  lookup: function(name) {
    this.replaceStack(function(current) {
      return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
    });
  },

  // [lookupData]
  //
  // On stack, before: ...
  // On stack, after: data[id], ...
  //
  // Push the result of looking up `id` on the current data
  lookupData: function(id) {
    this.push('data');
  },

  // [pushStringParam]
  //
  // On stack, before: ...
  // On stack, after: string, currentContext, ...
  //
  // This opcode is designed for use in string mode, which
  // provides the string value of a parameter along with its
  // depth rather than resolving it immediately.
  pushStringParam: function(string, type) {
    this.pushStackLiteral('depth' + this.lastContext);

    this.pushString(type);

    if (typeof string === 'string') {
      this.pushString(string);
    } else {
      this.pushStackLiteral(string);
    }
  },

  emptyHash: function() {
    this.pushStackLiteral('{}');

    if (this.options.stringParams) {
      this.register('hashTypes', '{}');
      this.register('hashContexts', '{}');
    }
  },
  pushHash: function() {
    this.hash = {values: [], types: [], contexts: []};
  },
  popHash: function() {
    var hash = this.hash;
    this.hash = undefined;

    if (this.options.stringParams) {
      this.register('hashContexts', '{' + hash.contexts.join(',') + '}');
      this.register('hashTypes', '{' + hash.types.join(',') + '}');
    }
    this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
  },

  // [pushString]
  //
  // On stack, before: ...
  // On stack, after: quotedString(string), ...
  //
  // Push a quoted version of `string` onto the stack
  pushString: function(string) {
    this.pushStackLiteral(this.quotedString(string));
  },

  // [push]
  //
  // On stack, before: ...
  // On stack, after: expr, ...
  //
  // Push an expression onto the stack
  push: function(expr) {
    this.inlineStack.push(expr);
    return expr;
  },

  // [pushLiteral]
  //
  // On stack, before: ...
  // On stack, after: value, ...
  //
  // Pushes a value onto the stack. This operation prevents
  // the compiler from creating a temporary variable to hold
  // it.
  pushLiteral: function(value) {
    this.pushStackLiteral(value);
  },

  // [pushProgram]
  //
  // On stack, before: ...
  // On stack, after: program(guid), ...
  //
  // Push a program expression onto the stack. This takes
  // a compile-time guid and converts it into a runtime-accessible
  // expression.
  pushProgram: function(guid) {
    if (guid != null) {
      this.pushStackLiteral(this.programExpression(guid));
    } else {
      this.pushStackLiteral(null);
    }
  },

  // [invokeHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // Pops off the helper's parameters, invokes the helper,
  // and pushes the helper's return value onto the stack.
  //
  // If the helper is not found, `helperMissing` is called.
  invokeHelper: function(paramSize, name) {
    this.context.aliases.helperMissing = 'helpers.helperMissing';

    var helper = this.lastHelper = this.setupHelper(paramSize, name, true);
    var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');

    this.push(helper.name + ' || ' + nonHelper);
    this.replaceStack(function(name) {
      return name + ' ? ' + name + '.call(' +
          helper.callParams + ") " + ": helperMissing.call(" +
          helper.helperMissingParams + ")";
    });
  },

  // [invokeKnownHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // This operation is used when the helper is known to exist,
  // so a `helperMissing` fallback is not required.
  invokeKnownHelper: function(paramSize, name) {
    var helper = this.setupHelper(paramSize, name);
    this.push(helper.name + ".call(" + helper.callParams + ")");
  },

  // [invokeAmbiguous]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of disambiguation
  //
  // This operation is used when an expression like `{{foo}}`
  // is provided, but we don't know at compile-time whether it
  // is a helper or a path.
  //
  // This operation emits more code than the other options,
  // and can be avoided by passing the `knownHelpers` and
  // `knownHelpersOnly` flags at compile-time.
  invokeAmbiguous: function(name, helperCall) {
    this.context.aliases.functionType = '"function"';

    this.pushStackLiteral('{}');    // Hash value
    var helper = this.setupHelper(0, name, helperCall);

    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

    var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
    var nextStack = this.nextStack();

    this.source.push('if (' + nextStack + ' = ' + helperName + ') { ' + nextStack + ' = ' + nextStack + '.call(' + helper.callParams + '); }');
    this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '.apply(depth0) : ' + nextStack + '; }');
  },

  // [invokePartial]
  //
  // On stack, before: context, ...
  // On stack after: result of partial invocation
  //
  // This operation pops off a context, invokes a partial with that context,
  // and pushes the result of the invocation back.
  invokePartial: function(name) {
    var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

    if (this.options.data) {
      params.push("data");
    }

    this.context.aliases.self = "this";
    this.push("self.invokePartial(" + params.join(", ") + ")");
  },

  // [assignToHash]
  //
  // On stack, before: value, hash, ...
  // On stack, after: hash, ...
  //
  // Pops a value and hash off the stack, assigns `hash[key] = value`
  // and pushes the hash back onto the stack.
  assignToHash: function(key) {
    var value = this.popStack(),
        context,
        type;

    if (this.options.stringParams) {
      type = this.popStack();
      context = this.popStack();
    }

    var hash = this.hash;
    if (context) {
      hash.contexts.push("'" + key + "': " + context);
    }
    if (type) {
      hash.types.push("'" + key + "': " + type);
    }
    hash.values.push("'" + key + "': (" + value + ")");
  },

  // HELPERS

  compiler: JavaScriptCompiler,

  compileChildren: function(environment, options) {
    var children = environment.children, child, compiler;

    for(var i=0, l=children.length; i<l; i++) {
      child = children[i];
      compiler = new this.compiler();

      var index = this.matchExistingProgram(child);

      if (index == null) {
        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
        this.context.environments[index] = child;
      } else {
        child.index = index;
        child.name = 'program' + index;
      }
    }
  },
  matchExistingProgram: function(child) {
    for (var i = 0, len = this.context.environments.length; i < len; i++) {
      var environment = this.context.environments[i];
      if (environment && environment.equals(child)) {
        return i;
      }
    }
  },

  programExpression: function(guid) {
    this.context.aliases.self = "this";

    if(guid == null) {
      return "self.noop";
    }

    var child = this.environment.children[guid],
        depths = child.depths.list, depth;

    var programParams = [child.index, child.name, "data"];

    for(var i=0, l = depths.length; i<l; i++) {
      depth = depths[i];

      if(depth === 1) { programParams.push("depth0"); }
      else { programParams.push("depth" + (depth - 1)); }
    }

    return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")";
  },

  register: function(name, val) {
    this.useRegister(name);
    this.source.push(name + " = " + val + ";");
  },

  useRegister: function(name) {
    if(!this.registers[name]) {
      this.registers[name] = true;
      this.registers.list.push(name);
    }
  },

  pushStackLiteral: function(item) {
    return this.push(new Literal(item));
  },

  pushStack: function(item) {
    this.flushInline();

    var stack = this.incrStack();
    if (item) {
      this.source.push(stack + " = " + item + ";");
    }
    this.compileStack.push(stack);
    return stack;
  },

  replaceStack: function(callback) {
    var prefix = '',
        inline = this.isInline(),
        stack;

    // If we are currently inline then we want to merge the inline statement into the
    // replacement statement via ','
    if (inline) {
      var top = this.popStack(true);

      if (top instanceof Literal) {
        // Literals do not need to be inlined
        stack = top.value;
      } else {
        // Get or create the current stack name for use by the inline
        var name = this.stackSlot ? this.topStackName() : this.incrStack();

        prefix = '(' + this.push(name) + ' = ' + top + '),';
        stack = this.topStack();
      }
    } else {
      stack = this.topStack();
    }

    var item = callback.call(this, stack);

    if (inline) {
      if (this.inlineStack.length || this.compileStack.length) {
        this.popStack();
      }
      this.push('(' + prefix + item + ')');
    } else {
      // Prevent modification of the context depth variable. Through replaceStack
      if (!/^stack/.test(stack)) {
        stack = this.nextStack();
      }

      this.source.push(stack + " = (" + prefix + item + ");");
    }
    return stack;
  },

  nextStack: function() {
    return this.pushStack();
  },

  incrStack: function() {
    this.stackSlot++;
    if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
    return this.topStackName();
  },
  topStackName: function() {
    return "stack" + this.stackSlot;
  },
  flushInline: function() {
    var inlineStack = this.inlineStack;
    if (inlineStack.length) {
      this.inlineStack = [];
      for (var i = 0, len = inlineStack.length; i < len; i++) {
        var entry = inlineStack[i];
        if (entry instanceof Literal) {
          this.compileStack.push(entry);
        } else {
          this.pushStack(entry);
        }
      }
    }
  },
  isInline: function() {
    return this.inlineStack.length;
  },

  popStack: function(wrapped) {
    var inline = this.isInline(),
        item = (inline ? this.inlineStack : this.compileStack).pop();

    if (!wrapped && (item instanceof Literal)) {
      return item.value;
    } else {
      if (!inline) {
        this.stackSlot--;
      }
      return item;
    }
  },

  topStack: function(wrapped) {
    var stack = (this.isInline() ? this.inlineStack : this.compileStack),
        item = stack[stack.length - 1];

    if (!wrapped && (item instanceof Literal)) {
      return item.value;
    } else {
      return item;
    }
  },

  quotedString: function(str) {
    return '"' + str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
      .replace(/\u2029/g, '\\u2029') + '"';
  },

  setupHelper: function(paramSize, name, missingParams) {
    var params = [];
    this.setupParams(paramSize, params, missingParams);
    var foundHelper = this.nameLookup('helpers', name, 'helper');

    return {
      params: params,
      name: foundHelper,
      callParams: ["depth0"].concat(params).join(", "),
      helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
    };
  },

  // the params and contexts arguments are passed in arrays
  // to fill in
  setupParams: function(paramSize, params, useRegister) {
    var options = [], contexts = [], types = [], param, inverse, program;

    options.push("hash:" + this.popStack());

    inverse = this.popStack();
    program = this.popStack();

    // Avoid setting fn and inverse if neither are set. This allows
    // helpers to do a check for `if (options.fn)`
    if (program || inverse) {
      if (!program) {
        this.context.aliases.self = "this";
        program = "self.noop";
      }

      if (!inverse) {
       this.context.aliases.self = "this";
        inverse = "self.noop";
      }

      options.push("inverse:" + inverse);
      options.push("fn:" + program);
    }

    for(var i=0; i<paramSize; i++) {
      param = this.popStack();
      params.push(param);

      if(this.options.stringParams) {
        types.push(this.popStack());
        contexts.push(this.popStack());
      }
    }

    if (this.options.stringParams) {
      options.push("contexts:[" + contexts.join(",") + "]");
      options.push("types:[" + types.join(",") + "]");
      options.push("hashContexts:hashContexts");
      options.push("hashTypes:hashTypes");
    }

    if(this.options.data) {
      options.push("data:data");
    }

    options = "{" + options.join(",") + "}";
    if (useRegister) {
      this.register('options', options);
      params.push('options');
    } else {
      params.push(options);
    }
    return params.join(", ");
  }
};

var reservedWords = (
  "break else new var" +
  " case finally return void" +
  " catch for switch while" +
  " continue function this with" +
  " default if throw" +
  " delete in try" +
  " do instanceof typeof" +
  " abstract enum int short" +
  " boolean export interface static" +
  " byte extends long super" +
  " char final native synchronized" +
  " class float package throws" +
  " const goto private transient" +
  " debugger implements protected volatile" +
  " double import public let yield"
).split(" ");

var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

for(var i=0, l=reservedWords.length; i<l; i++) {
  compilerWords[reservedWords[i]] = true;
}

JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
  if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
    return true;
  }
  return false;
};
;
// lib/handlebars/runtime.js

Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = Handlebars.VM.program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common) {
          ret = {};
          Handlebars.Utils.extend(ret, common);
          Handlebars.Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var program = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    program.program = i;
    program.depth = args.length;
    return program;
  },
  program: function(i, fn, data) {
    var program = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    program.program = i;
    program.depth = 0;
    return program;
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
// lib/handlebars/browser-suffix.js
  if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = Handlebars;

  } else if (typeof define === "function" && define.amd) {
    // AMD modules
    define(function() { return Handlebars; });

  } else {
    // other, i.e. browser
    this.Handlebars = Handlebars;
  }
}).call(this);
;

(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    exports = module.exports = factory();
  }

  // Browser Global.
  if(typeof window === "object") {
    root.Geotriggers = factory();
  }

}(this, function() {

  var geotriggersUrl    = "https://geotrigger.arcgis.com/";
  var tokenUrl          = "https://arcgis.com/sharing/oauth2/token";
  var registerDeviceUrl = "https://arcgis.com/sharing/oauth2/registerDevice";
  var exports           = {};
  var CORS              = !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest());

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          FNOP = function() {},
          fBound = function() {
            return fToBind.apply(this instanceof FNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      FNOP.prototype = this.prototype;
      fBound.prototype = new FNOP();

      return fBound;
    };
  }

  function Session(options){
    this._queue = [];
    this._requestQueue = [];
    this._events = {};

    var defaults = {
      preferLocalStorage: true,
      persistSession: (typeof module !== 'undefined' && module.exports) ? false : true,
      geotriggersUrl: geotriggersUrl,
      tokenUrl: tokenUrl,
      registerDeviceUrl: registerDeviceUrl,
      automaticRegistation: true,
      proxy: false
    };

    // set application id
    if(!options || !options.clientId) {
      throw new Error("Geotriggers.Session requires an `clientId` or a `session` parameter.");
    }

    if(!options.proxy && !CORS) {
      throw new Error("This browser does not support CORS and a proxy has not been set.");
    }

    // merge defaults and options into `this`
    util.merge(this, util.merge(defaults, options));

    this.authenticatedAs = (this.clientId && this.clientSecret) ? "application" : "device";

    this.key = "geotriggers_" + this.authenticatedAs + "_" + this.clientId;

    //restore a stored session if we have one
    if(this.persistSession) {
      if(this.preferLocalStorage && hasLocalStorage){
        util.merge(this, localStorage.get(this.key));
      } else if (hasCookies) {
        util.merge(this, cookie.get(this.key));
      }
    }

    // if there is an access token and it is after when the token expires or there is no access token
    if((this.token && (Date.now() > new Date(this.expiresOn).getTime())) || !this.token){
      this.refresh();
    }
  }

  Session.prototype.authenticated = function(){
    return !!this.token;
  };

  Session.prototype.refresh = function(){
    if(this.refreshing){
      return;
    }
    this.refreshing = true;
    var url = this.tokenUrl;
    var params = {
      client_id: this.clientId,
      f: "json"
    };

    if(this.clientSecret){
      params.client_secret = this.clientSecret;
      params.grant_type =  "client_credentials";
    } else if (this.refreshToken){
      params.refresh_token = this.refreshToken;
      params.grant_type = "refresh_token";
    } else if (this.automaticRegistation) {
      url = this.registerDeviceUrl;
    }

    this.request(url, params, function(error, response, xhr){
      this.refreshing = false;

      if(error){
        this.emit("authentication:error", error);
        return;
      }

      this.expiresOn = new Date(new Date().getTime() + ((response.expires_in-(60*5)) *1000));

      if(response.deviceToken){
        this.refreshToken = response.deviceToken.refresh_token;
        this.token = response.deviceToken.access_token;
        this.deviceId = response.device.deviceId;
      } else {
        this.refreshToken = response.refresh_token;
        this.token = response.access_token;
      }

      if(this.persistSession){
        this.persist();
      }

      while(this._queue.length){
        this._queue.shift().apply(this);
      }

      while(this._requestQueue.length){
        this.request.apply(this, this._requestQueue.shift());
      }

      this.emit("authentication:success");
    }.bind(this));
  };

  Session.prototype.toJSON = function(){
    var obj = {};
    for (var key in this) {
      if (this.hasOwnProperty(key) && this[key] && !key.match(/^_.+/)) {
        obj[key] = this[key];
      }
    }
    return obj;
  };

  Session.prototype.on = function(type, listener){
    if (typeof this._events[type] === "undefined"){
      this._events[type] = [];
    }

    this._events[type].push(listener);
  };

  Session.prototype.emit = function(type){
    var args = [].splice.call(arguments,1);
    if (this._events[type] instanceof Array){
      var listeners = this._events[type];
      for (var i=0, len=listeners.length; i < len; i++){
        listeners[i].apply(this, args);
      }
    }
  };

  Session.prototype.off = function(type, listener){
    if (this._events[type] instanceof Array){
      var listeners = this._events[type];
      for (var i=0, len=listeners.length; i < len; i++){
        if (listeners[i] === listener){
          listeners.splice(i, 1);
          break;
        }
      }
    }
  };

  Session.prototype.queue = function(fn) {
    if (!this.token) {
      this._queue.push(fn);
      this.refresh();
      return;
    }

    fn.apply(this);
  };

  Session.prototype.request = function(method, params, callback){
    var args = Array.prototype.slice.apply(arguments);
    var json;
    var error;
    var response;
    var httpRequest;

    // assume this is a request to getriggers is it doesn't start with (http|https)://
    var geotriggersRequest = !method.match(/^https?:\/\//);

    // create the url for the request
    var url = (geotriggersRequest) ? this.geotriggersUrl + method : method;

    if (this.proxy) {
      url = this.proxy + url;
    }

    if(typeof params === "function"){
      callback = params;
      params = {};
    }

    if(geotriggersRequest && !this.token){
      this._requestQueue.push(args);
      this.refresh();
      return;
    }

    // callback for handling a successful request
    var handleSuccessfulResponse = function(){

      try {
        json = JSON.parse(httpRequest.responseText);
        response = (json.error) ? null : json;
        error = (json.error) ? json.error : null;
      } catch (e){
        response = null;
        error = {
          type: "parse_error",
          message: "cound not parse response as JSON"
        };
      }

      // did our token expire?
      // if it didn't resolve or reject the callback
      // if it did refresh the auth and run the request again
      if(error && error.type === "invalidHeader" && error.headers.Authorization){
        this._requestQueue.push(args);
        this.refresh();
      } else {
        if (!error){
          callback(null, response, httpRequest);
        } else if (error){
          callback(error, null, httpRequest);
        } else {
          var errorMessage = {
            type: "unexpected_response",
            message: "the api returned a non JSON or unexpected data"
          };
          callback(errorMessage, null, httpRequest);
        }
      }
    }.bind(this);

    // callback for handling an http error
    var handleErrorResponse = function(){
      var errorMessage = JSON.parse(httpRequest.responseText);
      var error = {
        type: "http_error",
        message: errorMessage
      };
    }.bind(this);

    // callback for handling state change
    var handleStateChange = function(){
      if(httpRequest.readyState === 4 && httpRequest.status < 400){
        handleSuccessfulResponse();
      } else if(httpRequest.readyState === 4 && httpRequest.status >= 400) {
        handleErrorResponse();
      }
    }.bind(this);

    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = handleStateChange;

    var body;

    // set the access token in the body
    if(geotriggersRequest){
      params.token = this.token;
      body = JSON.stringify(params);
    } else {
      body = util.serialize(params);
    }

    httpRequest.open("POST", url);
    httpRequest.setRequestHeader('Content-Type', (geotriggersRequest) ? 'application/json' : 'application/x-www-form-urlencoded');
    httpRequest.send(body);

  };

  Session.prototype.persist = function() {
    var value = {};
    if(this.clientSecret){ value.clientSecret = this.clientSecret; }
    if(this.token){ value.token = this.token; }
    if(this.refreshToken){ value.refreshToken = this.refreshToken; }
    if(this.deviceId){ value.deviceId = this.deviceId; }
    if(this.preferLocalStorage && hasLocalStorage){
      localStorage.set(this.key, value);
    } else if (hasCookies) {
      cookie.set(this.key, value);
    }
  };

  Session.prototype.destroy = function() {
    if(this.preferLocalStorage && hasLocalStorage) {
      localStorage.erase(this.key);
    } else if (hasCookies) {
      cookie.erase(this.key);
    }
  };

  exports.Session = Session;

  /*
  General Purpose Utilities
  -----------------------------------
  */

  var util = {
    // Merge Object 1 and Object 2.
    // Properties from Object 2 will override properties in Object 1.
    // Returns Object 1
    merge: function(target, obj){
      for (var attr in obj) {
        if(obj.hasOwnProperty(attr)){
          target[attr] = obj[attr];
        }
      }
      return target;
    },

    isObject: function(thing){
      return Object.prototype.toString.call(thing) === '[object Object]';
    },

    serialize: function(obj, prefix) {

      var enc = encodeURIComponent;

      // make an array to hold each peice
      var str = [];

      // for every key in our object
      for(var p in obj) {
        if(obj.hasOwnProperty(p)){
          var e;
          var k = (prefix) ? prefix + "[" + p + "]" : p, v = obj[p];
          e = (util.isObject(v)) ? util.serialize(v, k) : enc(k) + "=" + enc(v);
          str.push(e);
        }
      }

      // join with ampersands
      return str.join("&");
    }
  };

  /*
  Utilities for manipulating sessions
  -----------------------------------
  */

  var hasLocalStorage = (typeof window === "object" && typeof window.localStorage === "object") ? true : false;
  var hasCookies = (typeof document === "object" && typeof document.cookie === "string") ? true : false;

  var localStorage = {
    set:function(key, value){
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key){
      return JSON.parse(window.localStorage.getItem(key));
    },
    erase: function(key){
      window.localStorage.removeItem(key);
    }
  };

  var cookie = {
    get: function(key) {
      // Still not sure that "[a-zA-Z0-9.()=|%/_]+($|;)" match *all* allowed characters in cookies
      var tmp =  document.cookie.match((new RegExp(key +'=[a-zA-Z0-9.()=|%/_]+($|;)','g')));
      if(!tmp || !tmp[0]){
        return null;
      } else {
        return JSON.parse(tmp[0].substring(key.length+1,tmp[0].length).replace(';','')) || null;
      }
    },

    set: function(key, value, secure) {
      var cookie = [
        key+'='+JSON.stringify(value),
        'path=/',
        'domain='+window.location.host
      ];

      var expiration_date = new Date();
      expiration_date.setFullYear(expiration_date.getFullYear() + 1);
      cookie.push(expiration_date.toGMTString());

      if (secure){
        cookie.push('secure');
      }
      return document.cookie = cookie.join('; ');
    },

    erase: function(key) {
      document.cookie = key + "; " + new Date(0).toUTCString();
    }
  };

  return exports;
}));

/*
 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
 (c) 2010-2013, Vladimir Agafonkin
 (c) 2010-2011, CloudMade
*/
(function (window, document, undefined) {
var oldL = window.L,
    L = {};

L.version = '0.6.2';

// define Leaflet for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = L;

// define Leaflet as an AMD module
} else if (typeof define === 'function' && define.amd) {
  define(L);
}

// define Leaflet as a global L variable, saving the original L to restore later if needed

L.noConflict = function () {
  window.L = oldL;
  return this;
};

window.L = L;


/*
 * L.Util contains various utility functions used throughout Leaflet code.
 */

L.Util = {
  extend: function (dest) { // (Object[, Object, ...]) ->
    var sources = Array.prototype.slice.call(arguments, 1),
        i, j, len, src;

    for (j = 0, len = sources.length; j < len; j++) {
      src = sources[j] || {};
      for (i in src) {
        if (src.hasOwnProperty(i)) {
          dest[i] = src[i];
        }
      }
    }
    return dest;
  },

  bind: function (fn, obj) { // (Function, Object) -> Function
    var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
    return function () {
      return fn.apply(obj, args || arguments);
    };
  },

  stamp: (function () {
    var lastId = 0,
        key = '_leaflet_id';
    return function (obj) {
      obj[key] = obj[key] || ++lastId;
      return obj[key];
    };
  }()),

  invokeEach: function (obj, method, context) {
    var i, args;

    if (typeof obj === 'object') {
      args = Array.prototype.slice.call(arguments, 3);

      for (i in obj) {
        method.apply(context, [i, obj[i]].concat(args));
      }
      return true;
    }

    return false;
  },

  limitExecByInterval: function (fn, time, context) {
    var lock, execOnUnlock;

    return function wrapperFn() {
      var args = arguments;

      if (lock) {
        execOnUnlock = true;
        return;
      }

      lock = true;

      setTimeout(function () {
        lock = false;

        if (execOnUnlock) {
          wrapperFn.apply(context, args);
          execOnUnlock = false;
        }
      }, time);

      fn.apply(context, args);
    };
  },

  falseFn: function () {
    return false;
  },

  formatNum: function (num, digits) {
    var pow = Math.pow(10, digits || 5);
    return Math.round(num * pow) / pow;
  },

  trim: function (str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  },

  splitWords: function (str) {
    return L.Util.trim(str).split(/\s+/);
  },

  setOptions: function (obj, options) {
    obj.options = L.extend({}, obj.options, options);
    return obj.options;
  },

  getParamString: function (obj, existingUrl, uppercase) {
    var params = [];
    for (var i in obj) {
      params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
    }
    return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
  },

  template: function (str, data) {
    return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
      var value = data[key];
      if (value === undefined) {
        throw new Error('No value provided for variable ' + str);
      } else if (typeof value === 'function') {
        value = value(data);
      }
      return value;
    });
  },

  isArray: function (obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
  },

  emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
};

(function () {

  // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

  function getPrefixed(name) {
    var i, fn,
        prefixes = ['webkit', 'moz', 'o', 'ms'];

    for (i = 0; i < prefixes.length && !fn; i++) {
      fn = window[prefixes[i] + name];
    }

    return fn;
  }

  var lastTime = 0;

  function timeoutDefer(fn) {
    var time = +new Date(),
        timeToCall = Math.max(0, 16 - (time - lastTime));

    lastTime = time + timeToCall;
    return window.setTimeout(fn, timeToCall);
  }

  var requestFn = window.requestAnimationFrame ||
          getPrefixed('RequestAnimationFrame') || timeoutDefer;

  var cancelFn = window.cancelAnimationFrame ||
          getPrefixed('CancelAnimationFrame') ||
          getPrefixed('CancelRequestAnimationFrame') ||
          function (id) { window.clearTimeout(id); };


  L.Util.requestAnimFrame = function (fn, context, immediate, element) {
    fn = L.bind(fn, context);

    if (immediate && requestFn === timeoutDefer) {
      fn();
    } else {
      return requestFn.call(window, fn, element);
    }
  };

  L.Util.cancelAnimFrame = function (id) {
    if (id) {
      cancelFn.call(window, id);
    }
  };

}());

// shortcuts for most used utility functions
L.extend = L.Util.extend;
L.bind = L.Util.bind;
L.stamp = L.Util.stamp;
L.setOptions = L.Util.setOptions;


/*
 * L.Class powers the OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */

L.Class = function () {};

L.Class.extend = function (props) {

  // extended class with the new prototype
  var NewClass = function () {

    // call the constructor
    if (this.initialize) {
      this.initialize.apply(this, arguments);
    }

    // call all constructor hooks
    if (this._initHooks) {
      this.callInitHooks();
    }
  };

  // instantiate class without calling constructor
  var F = function () {};
  F.prototype = this.prototype;

  var proto = new F();
  proto.constructor = NewClass;

  NewClass.prototype = proto;

  //inherit parent's statics
  for (var i in this) {
    if (this.hasOwnProperty(i) && i !== 'prototype') {
      NewClass[i] = this[i];
    }
  }

  // mix static properties into the class
  if (props.statics) {
    L.extend(NewClass, props.statics);
    delete props.statics;
  }

  // mix includes into the prototype
  if (props.includes) {
    L.Util.extend.apply(null, [proto].concat(props.includes));
    delete props.includes;
  }

  // merge options
  if (props.options && proto.options) {
    props.options = L.extend({}, proto.options, props.options);
  }

  // mix given properties into the prototype
  L.extend(proto, props);

  proto._initHooks = [];

  var parent = this;
  // jshint camelcase: false
  NewClass.__super__ = parent.prototype;

  // add method for calling all hooks
  proto.callInitHooks = function () {

    if (this._initHooksCalled) { return; }

    if (parent.prototype.callInitHooks) {
      parent.prototype.callInitHooks.call(this);
    }

    this._initHooksCalled = true;

    for (var i = 0, len = proto._initHooks.length; i < len; i++) {
      proto._initHooks[i].call(this);
    }
  };

  return NewClass;
};


// method for adding properties to prototype
L.Class.include = function (props) {
  L.extend(this.prototype, props);
};

// merge new default options to the Class
L.Class.mergeOptions = function (options) {
  L.extend(this.prototype.options, options);
};

// add a constructor hook
L.Class.addInitHook = function (fn) { // (Function) || (String, args...)
  var args = Array.prototype.slice.call(arguments, 1);

  var init = typeof fn === 'function' ? fn : function () {
    this[fn].apply(this, args);
  };

  this.prototype._initHooks = this.prototype._initHooks || [];
  this.prototype._initHooks.push(init);
};


/*
 * L.Mixin.Events is used to add custom events functionality to Leaflet classes.
 */

var eventsKey = '_leaflet_events';

L.Mixin = {};

L.Mixin.Events = {

  addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])

    // types can be a map of types/handlers
    if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }

    var events = this[eventsKey] = this[eventsKey] || {},
        contextId = context && L.stamp(context),
        i, len, event, type, indexKey, indexLenKey, typeIndex;

    // types can be a string of space-separated words
    types = L.Util.splitWords(types);

    for (i = 0, len = types.length; i < len; i++) {
      event = {
        action: fn,
        context: context || this
      };
      type = types[i];

      if (context) {
        // store listeners of a particular context in a separate hash (if it has an id)
        // gives a major performance boost when removing thousands of map layers

        indexKey = type + '_idx';
        indexLenKey = indexKey + '_len';

        typeIndex = events[indexKey] = events[indexKey] || {};

        if (!typeIndex[contextId]) {
          typeIndex[contextId] = [];

          // keep track of the number of keys in the index to quickly check if it's empty
          events[indexLenKey] = (events[indexLenKey] || 0) + 1;
        }

        typeIndex[contextId].push(event);


      } else {
        events[type] = events[type] || [];
        events[type].push(event);
      }
    }

    return this;
  },

  hasEventListeners: function (type) { // (String) -> Boolean
    var events = this[eventsKey];
    return !!events && ((type in events && events[type].length > 0) ||
                        (type + '_idx' in events && events[type + '_idx_len'] > 0));
  },

  removeEventListener: function (types, fn, context) { // ([String, Function, Object]) or (Object[, Object])

    if (!this[eventsKey]) {
      return this;
    }

    if (!types) {
      return this.clearAllEventListeners();
    }

    if (L.Util.invokeEach(types, this.removeEventListener, this, fn, context)) { return this; }

    var events = this[eventsKey],
        contextId = context && L.stamp(context),
        i, len, type, listeners, j, indexKey, indexLenKey, typeIndex, removed;

    types = L.Util.splitWords(types);

    for (i = 0, len = types.length; i < len; i++) {
      type = types[i];
      indexKey = type + '_idx';
      indexLenKey = indexKey + '_len';

      typeIndex = events[indexKey];

      if (!fn) {
        // clear all listeners for a type if function isn't specified
        delete events[type];
        delete events[indexKey];

      } else {
        listeners = context && typeIndex ? typeIndex[contextId] : events[type];

        if (listeners) {
          for (j = listeners.length - 1; j >= 0; j--) {
            if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
              removed = listeners.splice(j, 1);
              // set the old action to a no-op, because it is possible
              // that the listener is being iterated over as part of a dispatch
              removed[0].action = L.Util.falseFn;
            }
          }

          if (context && typeIndex && (listeners.length === 0)) {
            delete typeIndex[contextId];
            events[indexLenKey]--;
          }
        }
      }
    }

    return this;
  },

  clearAllEventListeners: function () {
    delete this[eventsKey];
    return this;
  },

  fireEvent: function (type, data) { // (String[, Object])
    if (!this.hasEventListeners(type)) {
      return this;
    }

    var event = L.Util.extend({}, data, { type: type, target: this });

    var events = this[eventsKey],
        listeners, i, len, typeIndex, contextId;

    if (events[type]) {
      // make sure adding/removing listeners inside other listeners won't cause infinite loop
      listeners = events[type].slice();

      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i].action.call(listeners[i].context || this, event);
      }
    }

    // fire event for the context-indexed listeners as well
    typeIndex = events[type + '_idx'];

    for (contextId in typeIndex) {
      listeners = typeIndex[contextId].slice();

      if (listeners) {
        for (i = 0, len = listeners.length; i < len; i++) {
          listeners[i].action.call(listeners[i].context || this, event);
        }
      }
    }

    return this;
  },

  addOneTimeEventListener: function (types, fn, context) {

    if (L.Util.invokeEach(types, this.addOneTimeEventListener, this, fn, context)) { return this; }

    var handler = L.bind(function () {
      this
          .removeEventListener(types, fn, context)
          .removeEventListener(types, handler, context);
    }, this);

    return this
        .addEventListener(types, fn, context)
        .addEventListener(types, handler, context);
  }
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.once = L.Mixin.Events.addOneTimeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;


/*
 * L.Browser handles different browser and feature detections for internal Leaflet use.
 */

(function () {

  var ie = !!window.ActiveXObject,
      ie6 = ie && !window.XMLHttpRequest,
      ie7 = ie && !document.querySelector,
    ielt9 = ie && !document.addEventListener,

      // terrible browser detection to work around Safari / iOS / Android browser bugs
      ua = navigator.userAgent.toLowerCase(),
      webkit = ua.indexOf('webkit') !== -1,
      chrome = ua.indexOf('chrome') !== -1,
      phantomjs = ua.indexOf('phantom') !== -1,
      android = ua.indexOf('android') !== -1,
      android23 = ua.search('android [23]') !== -1,

      mobile = typeof orientation !== undefined + '',
      msTouch = window.navigator && window.navigator.msPointerEnabled &&
                window.navigator.msMaxTouchPoints,
      retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1) ||
               ('matchMedia' in window && window.matchMedia('(min-resolution:144dpi)') &&
                window.matchMedia('(min-resolution:144dpi)').matches),

      doc = document.documentElement,
      ie3d = ie && ('transition' in doc.style),
      webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()),
      gecko3d = 'MozPerspective' in doc.style,
      opera3d = 'OTransition' in doc.style,
      any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs;


  // PhantomJS has 'ontouchstart' in document.documentElement, but doesn't actually support touch.
  // https://github.com/Leaflet/Leaflet/pull/1434#issuecomment-13843151

  var touch = !window.L_NO_TOUCH && !phantomjs && (function () {

    var startName = 'ontouchstart';

    // IE10+ (We simulate these into touch* events in L.DomEvent and L.DomEvent.MsTouch) or WebKit, etc.
    if (msTouch || (startName in doc)) {
      return true;
    }

    // Firefox/Gecko
    var div = document.createElement('div'),
        supported = false;

    if (!div.setAttribute) {
      return false;
    }
    div.setAttribute(startName, 'return;');

    if (typeof div[startName] === 'function') {
      supported = true;
    }

    div.removeAttribute(startName);
    div = null;

    return supported;
  }());


  L.Browser = {
    ie: ie,
    ie6: ie6,
    ie7: ie7,
    ielt9: ielt9,
    webkit: webkit,

    android: android,
    android23: android23,

    chrome: chrome,

    ie3d: ie3d,
    webkit3d: webkit3d,
    gecko3d: gecko3d,
    opera3d: opera3d,
    any3d: any3d,

    mobile: mobile,
    mobileWebkit: mobile && webkit,
    mobileWebkit3d: mobile && webkit3d,
    mobileOpera: mobile && window.opera,

    touch: touch,
    msTouch: msTouch,

    retina: retina
  };

}());


/*
 * L.Point represents a point with x and y coordinates.
 */

L.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
  this.x = (round ? Math.round(x) : x);
  this.y = (round ? Math.round(y) : y);
};

L.Point.prototype = {

  clone: function () {
    return new L.Point(this.x, this.y);
  },

  // non-destructive, returns a new point
  add: function (point) {
    return this.clone()._add(L.point(point));
  },

  // destructive, used directly for performance in situations where it's safe to modify existing point
  _add: function (point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  },

  subtract: function (point) {
    return this.clone()._subtract(L.point(point));
  },

  _subtract: function (point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  },

  divideBy: function (num) {
    return this.clone()._divideBy(num);
  },

  _divideBy: function (num) {
    this.x /= num;
    this.y /= num;
    return this;
  },

  multiplyBy: function (num) {
    return this.clone()._multiplyBy(num);
  },

  _multiplyBy: function (num) {
    this.x *= num;
    this.y *= num;
    return this;
  },

  round: function () {
    return this.clone()._round();
  },

  _round: function () {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  },

  floor: function () {
    return this.clone()._floor();
  },

  _floor: function () {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  },

  distanceTo: function (point) {
    point = L.point(point);

    var x = point.x - this.x,
        y = point.y - this.y;

    return Math.sqrt(x * x + y * y);
  },

  equals: function (point) {
    point = L.point(point);

    return point.x === this.x &&
           point.y === this.y;
  },

  contains: function (point) {
    point = L.point(point);

    return Math.abs(point.x) <= Math.abs(this.x) &&
           Math.abs(point.y) <= Math.abs(this.y);
  },

  toString: function () {
    return 'Point(' +
            L.Util.formatNum(this.x) + ', ' +
            L.Util.formatNum(this.y) + ')';
  }
};

L.point = function (x, y, round) {
  if (x instanceof L.Point) {
    return x;
  }
  if (L.Util.isArray(x)) {
    return new L.Point(x[0], x[1]);
  }
  if (x === undefined || x === null) {
    return x;
  }
  return new L.Point(x, y, round);
};


/*
 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
 */

L.Bounds = function (a, b) { //(Point, Point) or Point[]
  if (!a) { return; }

  var points = b ? [a, b] : a;

  for (var i = 0, len = points.length; i < len; i++) {
    this.extend(points[i]);
  }
};

L.Bounds.prototype = {
  // extend the bounds to contain the given point
  extend: function (point) { // (Point)
    point = L.point(point);

    if (!this.min && !this.max) {
      this.min = point.clone();
      this.max = point.clone();
    } else {
      this.min.x = Math.min(point.x, this.min.x);
      this.max.x = Math.max(point.x, this.max.x);
      this.min.y = Math.min(point.y, this.min.y);
      this.max.y = Math.max(point.y, this.max.y);
    }
    return this;
  },

  getCenter: function (round) { // (Boolean) -> Point
    return new L.Point(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2, round);
  },

  getBottomLeft: function () { // -> Point
    return new L.Point(this.min.x, this.max.y);
  },

  getTopRight: function () { // -> Point
    return new L.Point(this.max.x, this.min.y);
  },

  getSize: function () {
    return this.max.subtract(this.min);
  },

  contains: function (obj) { // (Bounds) or (Point) -> Boolean
    var min, max;

    if (typeof obj[0] === 'number' || obj instanceof L.Point) {
      obj = L.point(obj);
    } else {
      obj = L.bounds(obj);
    }

    if (obj instanceof L.Bounds) {
      min = obj.min;
      max = obj.max;
    } else {
      min = max = obj;
    }

    return (min.x >= this.min.x) &&
           (max.x <= this.max.x) &&
           (min.y >= this.min.y) &&
           (max.y <= this.max.y);
  },

  intersects: function (bounds) { // (Bounds) -> Boolean
    bounds = L.bounds(bounds);

    var min = this.min,
        max = this.max,
        min2 = bounds.min,
        max2 = bounds.max,
        xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
        yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

    return xIntersects && yIntersects;
  },

  isValid: function () {
    return !!(this.min && this.max);
  }
};

L.bounds = function (a, b) { // (Bounds) or (Point, Point) or (Point[])
  if (!a || a instanceof L.Bounds) {
    return a;
  }
  return new L.Bounds(a, b);
};


/*
 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
 */

L.Transformation = function (a, b, c, d) {
  this._a = a;
  this._b = b;
  this._c = c;
  this._d = d;
};

L.Transformation.prototype = {
  transform: function (point, scale) { // (Point, Number) -> Point
    return this._transform(point.clone(), scale);
  },

  // destructive transform (faster)
  _transform: function (point, scale) {
    scale = scale || 1;
    point.x = scale * (this._a * point.x + this._b);
    point.y = scale * (this._c * point.y + this._d);
    return point;
  },

  untransform: function (point, scale) {
    scale = scale || 1;
    return new L.Point(
            (point.x / scale - this._b) / this._a,
            (point.y / scale - this._d) / this._c);
  }
};


/*
 * L.DomUtil contains various utility functions for working with DOM.
 */

L.DomUtil = {
  get: function (id) {
    return (typeof id === 'string' ? document.getElementById(id) : id);
  },

  getStyle: function (el, style) {

    var value = el.style[style];

    if (!value && el.currentStyle) {
      value = el.currentStyle[style];
    }

    if ((!value || value === 'auto') && document.defaultView) {
      var css = document.defaultView.getComputedStyle(el, null);
      value = css ? css[style] : null;
    }

    return value === 'auto' ? null : value;
  },

  getViewportOffset: function (element) {

    var top = 0,
        left = 0,
        el = element,
        docBody = document.body,
        docEl = document.documentElement,
        pos,
        ie7 = L.Browser.ie7;

    do {
      top  += el.offsetTop  || 0;
      left += el.offsetLeft || 0;

      //add borders
      top += parseInt(L.DomUtil.getStyle(el, 'borderTopWidth'), 10) || 0;
      left += parseInt(L.DomUtil.getStyle(el, 'borderLeftWidth'), 10) || 0;

      pos = L.DomUtil.getStyle(el, 'position');

      if (el.offsetParent === docBody && pos === 'absolute') { break; }

      if (pos === 'fixed') {
        top  += docBody.scrollTop  || docEl.scrollTop  || 0;
        left += docBody.scrollLeft || docEl.scrollLeft || 0;
        break;
      }

      if (pos === 'relative' && !el.offsetLeft) {
        var width = L.DomUtil.getStyle(el, 'width'),
            maxWidth = L.DomUtil.getStyle(el, 'max-width'),
            r = el.getBoundingClientRect();

        if (width !== 'none' || maxWidth !== 'none') {
          left += r.left + el.clientLeft;
        }

        //calculate full y offset since we're breaking out of the loop
        top += r.top + (docBody.scrollTop  || docEl.scrollTop  || 0);

        break;
      }

      el = el.offsetParent;

    } while (el);

    el = element;

    do {
      if (el === docBody) { break; }

      top  -= el.scrollTop  || 0;
      left -= el.scrollLeft || 0;

      // webkit (and ie <= 7) handles RTL scrollLeft different to everyone else
      // https://code.google.com/p/closure-library/source/browse/trunk/closure/goog/style/bidi.js
      if (!L.DomUtil.documentIsLtr() && (L.Browser.webkit || ie7)) {
        left += el.scrollWidth - el.clientWidth;

        // ie7 shows the scrollbar by default and provides clientWidth counting it, so we
        // need to add it back in if it is visible; scrollbar is on the left as we are RTL
        if (ie7 && L.DomUtil.getStyle(el, 'overflow-y') !== 'hidden' &&
                   L.DomUtil.getStyle(el, 'overflow') !== 'hidden') {
          left += 17;
        }
      }

      el = el.parentNode;
    } while (el);

    return new L.Point(left, top);
  },

  documentIsLtr: function () {
    if (!L.DomUtil._docIsLtrCached) {
      L.DomUtil._docIsLtrCached = true;
      L.DomUtil._docIsLtr = L.DomUtil.getStyle(document.body, 'direction') === 'ltr';
    }
    return L.DomUtil._docIsLtr;
  },

  create: function (tagName, className, container) {

    var el = document.createElement(tagName);
    el.className = className;

    if (container) {
      container.appendChild(el);
    }

    return el;
  },

  hasClass: function (el, name) {
    return (el.className.length > 0) &&
            new RegExp('(^|\\s)' + name + '(\\s|$)').test(el.className);
  },

  addClass: function (el, name) {
    if (!L.DomUtil.hasClass(el, name)) {
      el.className += (el.className ? ' ' : '') + name;
    }
  },

  removeClass: function (el, name) {
    el.className = L.Util.trim((' ' + el.className + ' ').replace(' ' + name + ' ', ' '));
  },

  setOpacity: function (el, value) {

    if ('opacity' in el.style) {
      el.style.opacity = value;

    } else if ('filter' in el.style) {

      var filter = false,
          filterName = 'DXImageTransform.Microsoft.Alpha';

      // filters collection throws an error if we try to retrieve a filter that doesn't exist
      try {
        filter = el.filters.item(filterName);
      } catch (e) {
        // don't set opacity to 1 if we haven't already set an opacity,
        // it isn't needed and breaks transparent pngs.
        if (value === 1) { return; }
      }

      value = Math.round(value * 100);

      if (filter) {
        filter.Enabled = (value !== 100);
        filter.Opacity = value;
      } else {
        el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
      }
    }
  },

  testProp: function (props) {

    var style = document.documentElement.style;

    for (var i = 0; i < props.length; i++) {
      if (props[i] in style) {
        return props[i];
      }
    }
    return false;
  },

  getTranslateString: function (point) {
    // on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
    // makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
    // (same speed either way), Opera 12 doesn't support translate3d

    var is3d = L.Browser.webkit3d,
        open = 'translate' + (is3d ? '3d' : '') + '(',
        close = (is3d ? ',0' : '') + ')';

    return open + point.x + 'px,' + point.y + 'px' + close;
  },

  getScaleString: function (scale, origin) {

    var preTranslateStr = L.DomUtil.getTranslateString(origin.add(origin.multiplyBy(-1 * scale))),
        scaleStr = ' scale(' + scale + ') ';

    return preTranslateStr + scaleStr;
  },

  setPosition: function (el, point, disable3D) { // (HTMLElement, Point[, Boolean])

    // jshint camelcase: false
    el._leaflet_pos = point;

    if (!disable3D && L.Browser.any3d) {
      el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point);

      // workaround for Android 2/3 stability (https://github.com/CloudMade/Leaflet/issues/69)
      if (L.Browser.mobileWebkit3d) {
        el.style.WebkitBackfaceVisibility = 'hidden';
      }
    } else {
      el.style.left = point.x + 'px';
      el.style.top = point.y + 'px';
    }
  },

  getPosition: function (el) {
    // this method is only used for elements previously positioned using setPosition,
    // so it's safe to cache the position for performance

    // jshint camelcase: false
    return el._leaflet_pos;
  }
};


// prefix style property names

L.DomUtil.TRANSFORM = L.DomUtil.testProp(
        ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

// webkitTransition comes first because some browser versions that drop vendor prefix don't do
// the same for the transitionend event, in particular the Android 4.1 stock browser

L.DomUtil.TRANSITION = L.DomUtil.testProp(
        ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

L.DomUtil.TRANSITION_END =
        L.DomUtil.TRANSITION === 'webkitTransition' || L.DomUtil.TRANSITION === 'OTransition' ?
        L.DomUtil.TRANSITION + 'End' : 'transitionend';

(function () {
  var userSelectProperty = L.DomUtil.testProp(
    ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

  var userDragProperty = L.DomUtil.testProp(
    ['userDrag', 'WebkitUserDrag', 'OUserDrag', 'MozUserDrag', 'msUserDrag']);

  L.extend(L.DomUtil, {
    disableTextSelection: function () {
      if (userSelectProperty) {
        var style = document.documentElement.style;
        this._userSelect = style[userSelectProperty];
        style[userSelectProperty] = 'none';
      } else {
        L.DomEvent.on(window, 'selectstart', L.DomEvent.stop);
      }
    },

    enableTextSelection: function () {
      if (userSelectProperty) {
        document.documentElement.style[userSelectProperty] = this._userSelect;
        delete this._userSelect;
      } else {
        L.DomEvent.off(window, 'selectstart', L.DomEvent.stop);
      }
    },

    disableImageDrag: function () {
      if (userDragProperty) {
        var style = document.documentElement.style;
        this._userDrag = style[userDragProperty];
        style[userDragProperty] = 'none';
      } else {
        L.DomEvent.on(window, 'dragstart', L.DomEvent.stop);
      }
    },

    enableImageDrag: function () {
      if (userDragProperty) {
        document.documentElement.style[userDragProperty] = this._userDrag;
        delete this._userDrag;
      } else {
        L.DomEvent.off(window, 'dragstart', L.DomEvent.stop);
      }
    }
  });
})();


/*
 * L.LatLng represents a geographical point with latitude and longitude coordinates.
 */

L.LatLng = function (rawLat, rawLng) { // (Number, Number)
  var lat = parseFloat(rawLat),
      lng = parseFloat(rawLng);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid LatLng object: (' + rawLat + ', ' + rawLng + ')');
  }

  this.lat = lat;
  this.lng = lng;
};

L.extend(L.LatLng, {
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
});

L.LatLng.prototype = {
  equals: function (obj) { // (LatLng) -> Boolean
    if (!obj) { return false; }

    obj = L.latLng(obj);

    var margin = Math.max(
            Math.abs(this.lat - obj.lat),
            Math.abs(this.lng - obj.lng));

    return margin <= L.LatLng.MAX_MARGIN;
  },

  toString: function (precision) { // (Number) -> String
    return 'LatLng(' +
            L.Util.formatNum(this.lat, precision) + ', ' +
            L.Util.formatNum(this.lng, precision) + ')';
  },

  // Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
  // TODO move to projection code, LatLng shouldn't know about Earth
  distanceTo: function (other) { // (LatLng) -> Number
    other = L.latLng(other);

    var R = 6378137, // earth radius in meters
        d2r = L.LatLng.DEG_TO_RAD,
        dLat = (other.lat - this.lat) * d2r,
        dLon = (other.lng - this.lng) * d2r,
        lat1 = this.lat * d2r,
        lat2 = other.lat * d2r,
        sin1 = Math.sin(dLat / 2),
        sin2 = Math.sin(dLon / 2);

    var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },

  wrap: function (a, b) { // (Number, Number) -> LatLng
    var lng = this.lng;

    a = a || -180;
    b = b ||  180;

    lng = (lng + b) % (b - a) + (lng < a || lng === b ? b : a);

    return new L.LatLng(this.lat, lng);
  }
};

L.latLng = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
  if (a instanceof L.LatLng) {
    return a;
  }
  if (L.Util.isArray(a)) {
    return new L.LatLng(a[0], a[1]);
  }
  if (a === undefined || a === null) {
    return a;
  }
  if (typeof a === 'object' && 'lat' in a) {
    return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
  }
  return new L.LatLng(a, b);
};



/*
 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

L.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
  if (!southWest) { return; }

  var latlngs = northEast ? [southWest, northEast] : southWest;

  for (var i = 0, len = latlngs.length; i < len; i++) {
    this.extend(latlngs[i]);
  }
};

L.LatLngBounds.prototype = {
  // extend the bounds to contain the given point or bounds
  extend: function (obj) { // (LatLng) or (LatLngBounds)
    if (!obj) { return this; }

    if (typeof obj[0] === 'number' || typeof obj[0] === 'string' || obj instanceof L.LatLng) {
      obj = L.latLng(obj);
    } else {
      obj = L.latLngBounds(obj);
    }

    if (obj instanceof L.LatLng) {
      if (!this._southWest && !this._northEast) {
        this._southWest = new L.LatLng(obj.lat, obj.lng);
        this._northEast = new L.LatLng(obj.lat, obj.lng);
      } else {
        this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
        this._southWest.lng = Math.min(obj.lng, this._southWest.lng);

        this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
        this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
      }
    } else if (obj instanceof L.LatLngBounds) {
      this.extend(obj._southWest);
      this.extend(obj._northEast);
    }
    return this;
  },

  // extend the bounds by a percentage
  pad: function (bufferRatio) { // (Number) -> LatLngBounds
    var sw = this._southWest,
        ne = this._northEast,
        heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
        widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

    return new L.LatLngBounds(
            new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
            new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
  },

  getCenter: function () { // -> LatLng
    return new L.LatLng(
            (this._southWest.lat + this._northEast.lat) / 2,
            (this._southWest.lng + this._northEast.lng) / 2);
  },

  getSouthWest: function () {
    return this._southWest;
  },

  getNorthEast: function () {
    return this._northEast;
  },

  getNorthWest: function () {
    return new L.LatLng(this.getNorth(), this.getWest());
  },

  getSouthEast: function () {
    return new L.LatLng(this.getSouth(), this.getEast());
  },

  getWest: function () {
    return this._southWest.lng;
  },

  getSouth: function () {
    return this._southWest.lat;
  },

  getEast: function () {
    return this._northEast.lng;
  },

  getNorth: function () {
    return this._northEast.lat;
  },

  contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
    if (typeof obj[0] === 'number' || obj instanceof L.LatLng) {
      obj = L.latLng(obj);
    } else {
      obj = L.latLngBounds(obj);
    }

    var sw = this._southWest,
        ne = this._northEast,
        sw2, ne2;

    if (obj instanceof L.LatLngBounds) {
      sw2 = obj.getSouthWest();
      ne2 = obj.getNorthEast();
    } else {
      sw2 = ne2 = obj;
    }

    return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
           (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
  },

  intersects: function (bounds) { // (LatLngBounds)
    bounds = L.latLngBounds(bounds);

    var sw = this._southWest,
        ne = this._northEast,
        sw2 = bounds.getSouthWest(),
        ne2 = bounds.getNorthEast(),

        latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
        lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

    return latIntersects && lngIntersects;
  },

  toBBoxString: function () {
    return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
  },

  equals: function (bounds) { // (LatLngBounds)
    if (!bounds) { return false; }

    bounds = L.latLngBounds(bounds);

    return this._southWest.equals(bounds.getSouthWest()) &&
           this._northEast.equals(bounds.getNorthEast());
  },

  isValid: function () {
    return !!(this._southWest && this._northEast);
  }
};

//TODO International date line?

L.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
  if (!a || a instanceof L.LatLngBounds) {
    return a;
  }
  return new L.LatLngBounds(a, b);
};


/*
 * L.Projection contains various geographical projections used by CRS classes.
 */

L.Projection = {};


/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */

L.Projection.SphericalMercator = {
  MAX_LATITUDE: 85.0511287798,

  project: function (latlng) { // (LatLng) -> Point
    var d = L.LatLng.DEG_TO_RAD,
        max = this.MAX_LATITUDE,
        lat = Math.max(Math.min(max, latlng.lat), -max),
        x = latlng.lng * d,
        y = lat * d;

    y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

    return new L.Point(x, y);
  },

  unproject: function (point) { // (Point, Boolean) -> LatLng
    var d = L.LatLng.RAD_TO_DEG,
        lng = point.x * d,
        lat = (2 * Math.atan(Math.exp(point.y)) - (Math.PI / 2)) * d;

    return new L.LatLng(lat, lng);
  }
};


/*
 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
 */

L.Projection.LonLat = {
  project: function (latlng) {
    return new L.Point(latlng.lng, latlng.lat);
  },

  unproject: function (point) {
    return new L.LatLng(point.y, point.x);
  }
};


/*
 * L.CRS is a base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
 */

L.CRS = {
  latLngToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
    var projectedPoint = this.projection.project(latlng),
        scale = this.scale(zoom);

    return this.transformation._transform(projectedPoint, scale);
  },

  pointToLatLng: function (point, zoom) { // (Point, Number[, Boolean]) -> LatLng
    var scale = this.scale(zoom),
        untransformedPoint = this.transformation.untransform(point, scale);

    return this.projection.unproject(untransformedPoint);
  },

  project: function (latlng) {
    return this.projection.project(latlng);
  },

  scale: function (zoom) {
    return 256 * Math.pow(2, zoom);
  }
};


/*
 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
 */

L.CRS.Simple = L.extend({}, L.CRS, {
  projection: L.Projection.LonLat,
  transformation: new L.Transformation(1, 0, -1, 0),

  scale: function (zoom) {
    return Math.pow(2, zoom);
  }
});


/*
 * L.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping
 * and is used by Leaflet by default.
 */

L.CRS.EPSG3857 = L.extend({}, L.CRS, {
  code: 'EPSG:3857',

  projection: L.Projection.SphericalMercator,
  transformation: new L.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),

  project: function (latlng) { // (LatLng) -> Point
    var projectedPoint = this.projection.project(latlng),
        earthRadius = 6378137;
    return projectedPoint.multiplyBy(earthRadius);
  }
});

L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, {
  code: 'EPSG:900913'
});


/*
 * L.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
 */

L.CRS.EPSG4326 = L.extend({}, L.CRS, {
  code: 'EPSG:4326',

  projection: L.Projection.LonLat,
  transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.5)
});


/*
 * L.Map is the central class of the API - it is used to create a map.
 */

L.Map = L.Class.extend({

  includes: L.Mixin.Events,

  options: {
    crs: L.CRS.EPSG3857,

    /*
    center: LatLng,
    zoom: Number,
    layers: Array,
    */

    fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android23,
    trackResize: true,
    markerZoomAnimation: L.DomUtil.TRANSITION && L.Browser.any3d
  },

  initialize: function (id, options) { // (HTMLElement or String, Object)
    options = L.setOptions(this, options);

    this._initContainer(id);
    this._initLayout();
    this._initEvents();

    if (options.maxBounds) {
      this.setMaxBounds(options.maxBounds);
    }

    if (options.center && options.zoom !== undefined) {
      this.setView(L.latLng(options.center), options.zoom, {reset: true});
    }

    this._handlers = [];

    this._layers = {};
    this._zoomBoundLayers = {};
    this._tileLayersNum = 0;

    this.callInitHooks();

    this._addLayers(options.layers);
  },


  // public methods that modify map state

  // replaced by animation-powered implementation in Map.PanAnimation.js
  setView: function (center, zoom) {
    this._resetView(L.latLng(center), this._limitZoom(zoom));
    return this;
  },

  setZoom: function (zoom, options) {
    return this.setView(this.getCenter(), zoom, {zoom: options});
  },

  zoomIn: function (delta, options) {
    return this.setZoom(this._zoom + (delta || 1), options);
  },

  zoomOut: function (delta, options) {
    return this.setZoom(this._zoom - (delta || 1), options);
  },

  setZoomAround: function (latlng, zoom, options) {
    var scale = this.getZoomScale(zoom),
        viewHalf = this.getSize().divideBy(2),
        containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),

        centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
        newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

    return this.setView(newCenter, zoom, {zoom: options});
  },

  fitBounds: function (bounds, options) {

    options = options || {};
    bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

    var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
        paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

        zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR)),
        paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

        swPoint = this.project(bounds.getSouthWest(), zoom),
        nePoint = this.project(bounds.getNorthEast(), zoom),
        center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

    return this.setView(center, zoom, options);
  },

  fitWorld: function (options) {
    return this.fitBounds([[-90, -180], [90, 180]], options);
  },

  panTo: function (center, options) { // (LatLng)
    return this.setView(center, this._zoom, {pan: options});
  },

  panBy: function (offset) { // (Point)
    // replaced with animated panBy in Map.Animation.js
    this.fire('movestart');

    this._rawPanBy(L.point(offset));

    this.fire('move');
    return this.fire('moveend');
  },

  setMaxBounds: function (bounds) {
    bounds = L.latLngBounds(bounds);

    this.options.maxBounds = bounds;

    if (!bounds) {
      this._boundsMinZoom = null;
      this.off('moveend', this._panInsideMaxBounds, this);
      return this;
    }

    var minZoom = this.getBoundsZoom(bounds, true);

    this._boundsMinZoom = minZoom;

    if (this._loaded) {
      if (this._zoom < minZoom) {
        this.setView(bounds.getCenter(), minZoom);
      } else {
        this.panInsideBounds(bounds);
      }
    }

    this.on('moveend', this._panInsideMaxBounds, this);

    return this;
  },

  panInsideBounds: function (bounds) {
    bounds = L.latLngBounds(bounds);

    var viewBounds = this.getPixelBounds(),
        viewSw = viewBounds.getBottomLeft(),
        viewNe = viewBounds.getTopRight(),
        sw = this.project(bounds.getSouthWest()),
        ne = this.project(bounds.getNorthEast()),
        dx = 0,
        dy = 0;

    if (viewNe.y < ne.y) { // north
      dy = Math.ceil(ne.y - viewNe.y);
    }
    if (viewNe.x > ne.x) { // east
      dx = Math.floor(ne.x - viewNe.x);
    }
    if (viewSw.y > sw.y) { // south
      dy = Math.floor(sw.y - viewSw.y);
    }
    if (viewSw.x < sw.x) { // west
      dx = Math.ceil(sw.x - viewSw.x);
    }

    if (dx || dy) {
      return this.panBy([dx, dy]);
    }

    return this;
  },

  addLayer: function (layer) {
    // TODO method is too big, refactor

    var id = L.stamp(layer);

    if (this._layers[id]) { return this; }

    this._layers[id] = layer;

    // TODO getMaxZoom, getMinZoom in ILayer (instead of options)
    if (layer.options && (!isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom))) {
      this._zoomBoundLayers[id] = layer;
      this._updateZoomLevels();
    }

    // TODO looks ugly, refactor!!!
    if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
      this._tileLayersNum++;
      this._tileLayersToLoad++;
      layer.on('load', this._onTileLayerLoad, this);
    }

    if (this._loaded) {
      this._layerAdd(layer);
    }

    return this;
  },

  removeLayer: function (layer) {
    var id = L.stamp(layer);

    if (!this._layers[id]) { return; }

    if (this._loaded) {
      layer.onRemove(this);
      this.fire('layerremove', {layer: layer});
    }

    delete this._layers[id];
    if (this._zoomBoundLayers[id]) {
      delete this._zoomBoundLayers[id];
      this._updateZoomLevels();
    }

    // TODO looks ugly, refactor
    if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
      this._tileLayersNum--;
      this._tileLayersToLoad--;
      layer.off('load', this._onTileLayerLoad, this);
    }

    return this;
  },

  hasLayer: function (layer) {
    if (!layer) { return false; }

    return (L.stamp(layer) in this._layers);
  },

  eachLayer: function (method, context) {
    for (var i in this._layers) {
      method.call(context, this._layers[i]);
    }
    return this;
  },

  invalidateSize: function (options) {
    options = L.extend({
      animate: false,
      pan: true
    }, options === true ? {animate: true} : options);

    var oldSize = this.getSize();
    this._sizeChanged = true;

    if (this.options.maxBounds) {
      this.setMaxBounds(this.options.maxBounds);
    }

    if (!this._loaded) { return this; }

    var newSize = this.getSize(),
        offset = oldSize.subtract(newSize).divideBy(2).round();

    if (!offset.x && !offset.y) { return this; }

    if (options.animate && options.pan) {
      this.panBy(offset);

    } else {
      if (options.pan) {
        this._rawPanBy(offset);
      }

      this.fire('move');

      // make sure moveend is not fired too often on resize
      clearTimeout(this._sizeTimer);
      this._sizeTimer = setTimeout(L.bind(this.fire, this, 'moveend'), 200);
    }

    return this.fire('resize', {
      oldSize: oldSize,
      newSize: newSize
    });
  },

  // TODO handler.addTo
  addHandler: function (name, HandlerClass) {
    if (!HandlerClass) { return; }

    var handler = this[name] = new HandlerClass(this);

    this._handlers.push(handler);

    if (this.options[name]) {
      handler.enable();
    }

    return this;
  },

  remove: function () {
    if (this._loaded) {
      this.fire('unload');
    }

    this._initEvents('off');

    delete this._container._leaflet;

    this._clearPanes();
    if (this._clearControlPos) {
      this._clearControlPos();
    }

    this._clearHandlers();

    return this;
  },


  // public methods for getting map state

  getCenter: function () { // (Boolean) -> LatLng
    this._checkIfLoaded();

    if (!this._moved()) {
      return this._initialCenter;
    }
    return this.layerPointToLatLng(this._getCenterLayerPoint());
  },

  getZoom: function () {
    return this._zoom;
  },

  getBounds: function () {
    var bounds = this.getPixelBounds(),
        sw = this.unproject(bounds.getBottomLeft()),
        ne = this.unproject(bounds.getTopRight());

    return new L.LatLngBounds(sw, ne);
  },

  getMinZoom: function () {
    var z1 = this.options.minZoom || 0,
        z2 = this._layersMinZoom || 0,
        z3 = this._boundsMinZoom || 0;

    return Math.max(z1, z2, z3);
  },

  getMaxZoom: function () {
    var z1 = this.options.maxZoom === undefined ? Infinity : this.options.maxZoom,
        z2 = this._layersMaxZoom  === undefined ? Infinity : this._layersMaxZoom;

    return Math.min(z1, z2);
  },

  getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
    bounds = L.latLngBounds(bounds);

    var zoom = this.getMinZoom() - (inside ? 1 : 0),
        maxZoom = this.getMaxZoom(),
        size = this.getSize(),

        nw = bounds.getNorthWest(),
        se = bounds.getSouthEast(),

        zoomNotFound = true,
        boundsSize;

    padding = L.point(padding || [0, 0]);

    do {
      zoom++;
      boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding);
      zoomNotFound = !inside ? size.contains(boundsSize) : boundsSize.x < size.x || boundsSize.y < size.y;

    } while (zoomNotFound && zoom <= maxZoom);

    if (zoomNotFound && inside) {
      return null;
    }

    return inside ? zoom : zoom - 1;
  },

  getSize: function () {
    if (!this._size || this._sizeChanged) {
      this._size = new L.Point(
        this._container.clientWidth,
        this._container.clientHeight);

      this._sizeChanged = false;
    }
    return this._size.clone();
  },

  getPixelBounds: function () {
    var topLeftPoint = this._getTopLeftPoint();
    return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
  },

  getPixelOrigin: function () {
    this._checkIfLoaded();
    return this._initialTopLeftPoint;
  },

  getPanes: function () {
    return this._panes;
  },

  getContainer: function () {
    return this._container;
  },


  // TODO replace with universal implementation after refactoring projections

  getZoomScale: function (toZoom) {
    var crs = this.options.crs;
    return crs.scale(toZoom) / crs.scale(this._zoom);
  },

  getScaleZoom: function (scale) {
    return this._zoom + (Math.log(scale) / Math.LN2);
  },


  // conversion methods

  project: function (latlng, zoom) { // (LatLng[, Number]) -> Point
    zoom = zoom === undefined ? this._zoom : zoom;
    return this.options.crs.latLngToPoint(L.latLng(latlng), zoom);
  },

  unproject: function (point, zoom) { // (Point[, Number]) -> LatLng
    zoom = zoom === undefined ? this._zoom : zoom;
    return this.options.crs.pointToLatLng(L.point(point), zoom);
  },

  layerPointToLatLng: function (point) { // (Point)
    var projectedPoint = L.point(point).add(this.getPixelOrigin());
    return this.unproject(projectedPoint);
  },

  latLngToLayerPoint: function (latlng) { // (LatLng)
    var projectedPoint = this.project(L.latLng(latlng))._round();
    return projectedPoint._subtract(this.getPixelOrigin());
  },

  containerPointToLayerPoint: function (point) { // (Point)
    return L.point(point).subtract(this._getMapPanePos());
  },

  layerPointToContainerPoint: function (point) { // (Point)
    return L.point(point).add(this._getMapPanePos());
  },

  containerPointToLatLng: function (point) {
    var layerPoint = this.containerPointToLayerPoint(L.point(point));
    return this.layerPointToLatLng(layerPoint);
  },

  latLngToContainerPoint: function (latlng) {
    return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));
  },

  mouseEventToContainerPoint: function (e) { // (MouseEvent)
    return L.DomEvent.getMousePosition(e, this._container);
  },

  mouseEventToLayerPoint: function (e) { // (MouseEvent)
    return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
  },

  mouseEventToLatLng: function (e) { // (MouseEvent)
    return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
  },


  // map initialization methods

  _initContainer: function (id) {
    var container = this._container = L.DomUtil.get(id);

    if (!container) {
      throw new Error('Map container not found.');
    } else if (container._leaflet) {
      throw new Error('Map container is already initialized.');
    }

    container._leaflet = true;
  },

  _initLayout: function () {
    var container = this._container;

    L.DomUtil.addClass(container, 'leaflet-container' +
      (L.Browser.touch ? ' leaflet-touch' : '') +
      (L.Browser.retina ? ' leaflet-retina' : '') +
      (this.options.fadeAnimation ? ' leaflet-fade-anim' : ''));

    var position = L.DomUtil.getStyle(container, 'position');

    if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
      container.style.position = 'relative';
    }

    this._initPanes();

    if (this._initControlPos) {
      this._initControlPos();
    }
  },

  _initPanes: function () {
    var panes = this._panes = {};

    this._mapPane = panes.mapPane = this._createPane('leaflet-map-pane', this._container);

    this._tilePane = panes.tilePane = this._createPane('leaflet-tile-pane', this._mapPane);
    panes.objectsPane = this._createPane('leaflet-objects-pane', this._mapPane);
    panes.shadowPane = this._createPane('leaflet-shadow-pane');
    panes.overlayPane = this._createPane('leaflet-overlay-pane');
    panes.markerPane = this._createPane('leaflet-marker-pane');
    panes.popupPane = this._createPane('leaflet-popup-pane');

    var zoomHide = ' leaflet-zoom-hide';

    if (!this.options.markerZoomAnimation) {
      L.DomUtil.addClass(panes.markerPane, zoomHide);
      L.DomUtil.addClass(panes.shadowPane, zoomHide);
      L.DomUtil.addClass(panes.popupPane, zoomHide);
    }
  },

  _createPane: function (className, container) {
    return L.DomUtil.create('div', className, container || this._panes.objectsPane);
  },

  _clearPanes: function () {
    this._container.removeChild(this._mapPane);
  },

  _addLayers: function (layers) {
    layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

    for (var i = 0, len = layers.length; i < len; i++) {
      this.addLayer(layers[i]);
    }
  },


  // private methods that modify map state

  _resetView: function (center, zoom, preserveMapOffset, afterZoomAnim) {

    var zoomChanged = (this._zoom !== zoom);

    if (!afterZoomAnim) {
      this.fire('movestart');

      if (zoomChanged) {
        this.fire('zoomstart');
      }
    }

    this._zoom = zoom;
    this._initialCenter = center;

    this._initialTopLeftPoint = this._getNewTopLeftPoint(center);

    if (!preserveMapOffset) {
      L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
    } else {
      this._initialTopLeftPoint._add(this._getMapPanePos());
    }

    this._tileLayersToLoad = this._tileLayersNum;

    var loading = !this._loaded;
    this._loaded = true;

    if (loading) {
      this.fire('load');
      this.eachLayer(this._layerAdd, this);
    }

    this.fire('viewreset', {hard: !preserveMapOffset});

    this.fire('move');

    if (zoomChanged || afterZoomAnim) {
      this.fire('zoomend');
    }

    this.fire('moveend', {hard: !preserveMapOffset});
  },

  _rawPanBy: function (offset) {
    L.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
  },

  _getZoomSpan: function () {
    return this.getMaxZoom() - this.getMinZoom();
  },

  _updateZoomLevels: function () {
    var i,
      minZoom = Infinity,
      maxZoom = -Infinity,
      oldZoomSpan = this._getZoomSpan();

    for (i in this._zoomBoundLayers) {
      var layer = this._zoomBoundLayers[i];
      if (!isNaN(layer.options.minZoom)) {
        minZoom = Math.min(minZoom, layer.options.minZoom);
      }
      if (!isNaN(layer.options.maxZoom)) {
        maxZoom = Math.max(maxZoom, layer.options.maxZoom);
      }
    }

    if (i === undefined) { // we have no tilelayers
      this._layersMaxZoom = this._layersMinZoom = undefined;
    } else {
      this._layersMaxZoom = maxZoom;
      this._layersMinZoom = minZoom;
    }

    if (oldZoomSpan !== this._getZoomSpan()) {
      this.fire('zoomlevelschange');
    }
  },

  _panInsideMaxBounds: function () {
    this.panInsideBounds(this.options.maxBounds);
  },

  _checkIfLoaded: function () {
    if (!this._loaded) {
      throw new Error('Set map center and zoom first.');
    }
  },

  // map events

  _initEvents: function (onOff) {
    if (!L.DomEvent) { return; }

    onOff = onOff || 'on';

    L.DomEvent[onOff](this._container, 'click', this._onMouseClick, this);

    var events = ['dblclick', 'mousedown', 'mouseup', 'mouseenter',
                  'mouseleave', 'mousemove', 'contextmenu'],
        i, len;

    for (i = 0, len = events.length; i < len; i++) {
      L.DomEvent[onOff](this._container, events[i], this._fireMouseEvent, this);
    }

    if (this.options.trackResize) {
      L.DomEvent[onOff](window, 'resize', this._onResize, this);
    }
  },

  _onResize: function () {
    L.Util.cancelAnimFrame(this._resizeRequest);
    this._resizeRequest = L.Util.requestAnimFrame(
            this.invalidateSize, this, false, this._container);
  },

  _onMouseClick: function (e) {
    // jshint camelcase: false
    if (!this._loaded || (!e._simulated && this.dragging && this.dragging.moved()) || e._leaflet_stop) { return; }

    this.fire('preclick');
    this._fireMouseEvent(e);
  },

  _fireMouseEvent: function (e) {
    // jshint camelcase: false
    if (!this._loaded || e._leaflet_stop) { return; }

    var type = e.type;

    type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

    if (!this.hasEventListeners(type)) { return; }

    if (type === 'contextmenu') {
      L.DomEvent.preventDefault(e);
    }

    var containerPoint = this.mouseEventToContainerPoint(e),
        layerPoint = this.containerPointToLayerPoint(containerPoint),
        latlng = this.layerPointToLatLng(layerPoint);

    this.fire(type, {
      latlng: latlng,
      layerPoint: layerPoint,
      containerPoint: containerPoint,
      originalEvent: e
    });
  },

  _onTileLayerLoad: function () {
    this._tileLayersToLoad--;
    if (this._tileLayersNum && !this._tileLayersToLoad) {
      this.fire('tilelayersload');
    }
  },

  _clearHandlers: function () {
    for (var i = 0, len = this._handlers.length; i < len; i++) {
      this._handlers[i].disable();
    }
  },

  whenReady: function (callback, context) {
    if (this._loaded) {
      callback.call(context || this, this);
    } else {
      this.on('load', callback, context);
    }
    return this;
  },

  _layerAdd: function (layer) {
    layer.onAdd(this);
    this.fire('layeradd', {layer: layer});
  },


  // private methods for getting map state

  _getMapPanePos: function () {
    return L.DomUtil.getPosition(this._mapPane);
  },

  _moved: function () {
    var pos = this._getMapPanePos();
    return pos && !pos.equals([0, 0]);
  },

  _getTopLeftPoint: function () {
    return this.getPixelOrigin().subtract(this._getMapPanePos());
  },

  _getNewTopLeftPoint: function (center, zoom) {
    var viewHalf = this.getSize()._divideBy(2);
    // TODO round on display, not calculation to increase precision?
    return this.project(center, zoom)._subtract(viewHalf)._round();
  },

  _latLngToNewLayerPoint: function (latlng, newZoom, newCenter) {
    var topLeft = this._getNewTopLeftPoint(newCenter, newZoom).add(this._getMapPanePos());
    return this.project(latlng, newZoom)._subtract(topLeft);
  },

  // layer point of the current center
  _getCenterLayerPoint: function () {
    return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
  },

  // offset of the specified place to the current center in pixels
  _getCenterOffset: function (latlng) {
    return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
  },

  _limitZoom: function (zoom) {
    var min = this.getMinZoom(),
        max = this.getMaxZoom();

    return Math.max(min, Math.min(max, zoom));
  }
});

L.map = function (id, options) {
  return new L.Map(id, options);
};


/*
 * Mercator projection that takes into account that the Earth is not a perfect sphere.
 * Less popular than spherical mercator; used by projections like EPSG:3395.
 */

L.Projection.Mercator = {
  MAX_LATITUDE: 85.0840591556,

  R_MINOR: 6356752.314245179,
  R_MAJOR: 6378137,

  project: function (latlng) { // (LatLng) -> Point
    var d = L.LatLng.DEG_TO_RAD,
        max = this.MAX_LATITUDE,
        lat = Math.max(Math.min(max, latlng.lat), -max),
        r = this.R_MAJOR,
        r2 = this.R_MINOR,
        x = latlng.lng * d * r,
        y = lat * d,
        tmp = r2 / r,
        eccent = Math.sqrt(1.0 - tmp * tmp),
        con = eccent * Math.sin(y);

    con = Math.pow((1 - con) / (1 + con), eccent * 0.5);

    var ts = Math.tan(0.5 * ((Math.PI * 0.5) - y)) / con;
    y = -r * Math.log(ts);

    return new L.Point(x, y);
  },

  unproject: function (point) { // (Point, Boolean) -> LatLng
    var d = L.LatLng.RAD_TO_DEG,
        r = this.R_MAJOR,
        r2 = this.R_MINOR,
        lng = point.x * d / r,
        tmp = r2 / r,
        eccent = Math.sqrt(1 - (tmp * tmp)),
        ts = Math.exp(- point.y / r),
        phi = (Math.PI / 2) - 2 * Math.atan(ts),
        numIter = 15,
        tol = 1e-7,
        i = numIter,
        dphi = 0.1,
        con;

    while ((Math.abs(dphi) > tol) && (--i > 0)) {
      con = eccent * Math.sin(phi);
      dphi = (Math.PI / 2) - 2 * Math.atan(ts *
                  Math.pow((1.0 - con) / (1.0 + con), 0.5 * eccent)) - phi;
      phi += dphi;
    }

    return new L.LatLng(phi * d, lng);
  }
};



L.CRS.EPSG3395 = L.extend({}, L.CRS, {
  code: 'EPSG:3395',

  projection: L.Projection.Mercator,

  transformation: (function () {
    var m = L.Projection.Mercator,
        r = m.R_MAJOR,
        r2 = m.R_MINOR;

    return new L.Transformation(0.5 / (Math.PI * r), 0.5, -0.5 / (Math.PI * r2), 0.5);
  }())
});


/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */

L.TileLayer = L.Class.extend({
  includes: L.Mixin.Events,

  options: {
    minZoom: 0,
    maxZoom: 18,
    tileSize: 256,
    subdomains: 'abc',
    errorTileUrl: '',
    attribution: '',
    zoomOffset: 0,
    opacity: 1,
    /* (undefined works too)
    zIndex: null,
    tms: false,
    continuousWorld: false,
    noWrap: false,
    zoomReverse: false,
    detectRetina: false,
    reuseTiles: false,
    bounds: false,
    */
    unloadInvisibleTiles: L.Browser.mobile,
    updateWhenIdle: L.Browser.mobile
  },

  initialize: function (url, options) {
    options = L.setOptions(this, options);

    // detecting retina displays, adjusting tileSize and zoom levels
    if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

      options.tileSize = Math.floor(options.tileSize / 2);
      options.zoomOffset++;

      if (options.minZoom > 0) {
        options.minZoom--;
      }
      this.options.maxZoom--;
    }

    if (options.bounds) {
      options.bounds = L.latLngBounds(options.bounds);
    }

    this._url = url;

    var subdomains = this.options.subdomains;

    if (typeof subdomains === 'string') {
      this.options.subdomains = subdomains.split('');
    }
  },

  onAdd: function (map) {
    this._map = map;
    this._animated = map._zoomAnimated;

    // create a container div for tiles
    this._initContainer();

    // create an image to clone for tiles
    this._createTileProto();

    // set up events
    map.on({
      'viewreset': this._reset,
      'moveend': this._update
    }, this);

    if (this._animated) {
      map.on({
        'zoomanim': this._animateZoom,
        'zoomend': this._endZoomAnim
      }, this);
    }

    if (!this.options.updateWhenIdle) {
      this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
      map.on('move', this._limitedUpdate, this);
    }

    this._reset();
    this._update();
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  onRemove: function (map) {
    this._container.parentNode.removeChild(this._container);

    map.off({
      'viewreset': this._reset,
      'moveend': this._update
    }, this);

    if (this._animated) {
      map.off({
        'zoomanim': this._animateZoom,
        'zoomend': this._endZoomAnim
      }, this);
    }

    if (!this.options.updateWhenIdle) {
      map.off('move', this._limitedUpdate, this);
    }

    this._container = null;
    this._map = null;
  },

  bringToFront: function () {
    var pane = this._map._panes.tilePane;

    if (this._container) {
      pane.appendChild(this._container);
      this._setAutoZIndex(pane, Math.max);
    }

    return this;
  },

  bringToBack: function () {
    var pane = this._map._panes.tilePane;

    if (this._container) {
      pane.insertBefore(this._container, pane.firstChild);
      this._setAutoZIndex(pane, Math.min);
    }

    return this;
  },

  getAttribution: function () {
    return this.options.attribution;
  },

  getContainer: function () {
    return this._container;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;

    if (this._map) {
      this._updateOpacity();
    }

    return this;
  },

  setZIndex: function (zIndex) {
    this.options.zIndex = zIndex;
    this._updateZIndex();

    return this;
  },

  setUrl: function (url, noRedraw) {
    this._url = url;

    if (!noRedraw) {
      this.redraw();
    }

    return this;
  },

  redraw: function () {
    if (this._map) {
      this._reset({hard: true});
      this._update();
    }
    return this;
  },

  _updateZIndex: function () {
    if (this._container && this.options.zIndex !== undefined) {
      this._container.style.zIndex = this.options.zIndex;
    }
  },

  _setAutoZIndex: function (pane, compare) {

    var layers = pane.children,
        edgeZIndex = -compare(Infinity, -Infinity), // -Infinity for max, Infinity for min
        zIndex, i, len;

    for (i = 0, len = layers.length; i < len; i++) {

      if (layers[i] !== this._container) {
        zIndex = parseInt(layers[i].style.zIndex, 10);

        if (!isNaN(zIndex)) {
          edgeZIndex = compare(edgeZIndex, zIndex);
        }
      }
    }

    this.options.zIndex = this._container.style.zIndex =
            (isFinite(edgeZIndex) ? edgeZIndex : 0) + compare(1, -1);
  },

  _updateOpacity: function () {
    var i,
        tiles = this._tiles;

    if (L.Browser.ielt9) {
      for (i in tiles) {
        L.DomUtil.setOpacity(tiles[i], this.options.opacity);
      }
    } else {
      L.DomUtil.setOpacity(this._container, this.options.opacity);
    }
  },

  _initContainer: function () {
    var tilePane = this._map._panes.tilePane;

    if (!this._container) {
      this._container = L.DomUtil.create('div', 'leaflet-layer');

      this._updateZIndex();

      if (this._animated) {
        var className = 'leaflet-tile-container leaflet-zoom-animated';

        this._bgBuffer = L.DomUtil.create('div', className, this._container);
        this._tileContainer = L.DomUtil.create('div', className, this._container);

      } else {
        this._tileContainer = this._container;
      }

      tilePane.appendChild(this._container);

      if (this.options.opacity < 1) {
        this._updateOpacity();
      }
    }
  },

  _reset: function (e) {
    for (var key in this._tiles) {
      this.fire('tileunload', {tile: this._tiles[key]});
    }

    this._tiles = {};
    this._tilesToLoad = 0;

    if (this.options.reuseTiles) {
      this._unusedTiles = [];
    }

    this._tileContainer.innerHTML = '';

    if (this._animated && e && e.hard) {
      this._clearBgBuffer();
    }

    this._initContainer();
  },

  _update: function () {

    if (!this._map) { return; }

    var bounds = this._map.getPixelBounds(),
        zoom = this._map.getZoom(),
        tileSize = this.options.tileSize;

    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return;
    }

    var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor());

    this._addTilesFromCenterOut(tileBounds);

    if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
      this._removeOtherTiles(tileBounds);
    }
  },

  _addTilesFromCenterOut: function (bounds) {
    var queue = [],
        center = bounds.getCenter();

    var j, i, point;

    for (j = bounds.min.y; j <= bounds.max.y; j++) {
      for (i = bounds.min.x; i <= bounds.max.x; i++) {
        point = new L.Point(i, j);

        if (this._tileShouldBeLoaded(point)) {
          queue.push(point);
        }
      }
    }

    var tilesToLoad = queue.length;

    if (tilesToLoad === 0) { return; }

    // load tiles in order of their distance to center
    queue.sort(function (a, b) {
      return a.distanceTo(center) - b.distanceTo(center);
    });

    var fragment = document.createDocumentFragment();

    // if its the first batch of tiles to load
    if (!this._tilesToLoad) {
      this.fire('loading');
    }

    this._tilesToLoad += tilesToLoad;

    for (i = 0; i < tilesToLoad; i++) {
      this._addTile(queue[i], fragment);
    }

    this._tileContainer.appendChild(fragment);
  },

  _tileShouldBeLoaded: function (tilePoint) {
    if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
      return false; // already loaded
    }

    var options = this.options;

    if (!options.continuousWorld) {
      var limit = this._getWrapTileNum();

      // don't load if exceeds world bounds
      if ((options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit)) ||
        tilePoint.y < 0 || tilePoint.y >= limit) { return false; }
    }

    if (options.bounds) {
      var tileSize = options.tileSize,
          nwPoint = tilePoint.multiplyBy(tileSize),
          sePoint = nwPoint.add([tileSize, tileSize]),
          nw = this._map.unproject(nwPoint),
          se = this._map.unproject(sePoint);

      // TODO temporary hack, will be removed after refactoring projections
      // https://github.com/Leaflet/Leaflet/issues/1618
      if (!options.continuousWorld && !options.noWrap) {
        nw = nw.wrap();
        se = se.wrap();
      }

      if (!options.bounds.intersects([nw, se])) { return false; }
    }

    return true;
  },

  _removeOtherTiles: function (bounds) {
    var kArr, x, y, key;

    for (key in this._tiles) {
      kArr = key.split(':');
      x = parseInt(kArr[0], 10);
      y = parseInt(kArr[1], 10);

      // remove tile if it's out of bounds
      if (x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
        this._removeTile(key);
      }
    }
  },

  _removeTile: function (key) {
    var tile = this._tiles[key];

    this.fire('tileunload', {tile: tile, url: tile.src});

    if (this.options.reuseTiles) {
      L.DomUtil.removeClass(tile, 'leaflet-tile-loaded');
      this._unusedTiles.push(tile);

    } else if (tile.parentNode === this._tileContainer) {
      this._tileContainer.removeChild(tile);
    }

    // for https://github.com/CloudMade/Leaflet/issues/137
    if (!L.Browser.android) {
      tile.onload = null;
      tile.src = L.Util.emptyImageUrl;
    }

    delete this._tiles[key];
  },

  _addTile: function (tilePoint, container) {
    var tilePos = this._getTilePos(tilePoint);

    // get unused tile - or create a new tile
    var tile = this._getTile();

    /*
    Chrome 20 layouts much faster with top/left (verify with timeline, frames)
    Android 4 browser has display issues with top/left and requires transform instead
    Android 2 browser requires top/left or tiles disappear on load or first drag
    (reappear after zoom) https://github.com/CloudMade/Leaflet/issues/866
    (other browsers don't currently care) - see debug/hacks/jitter.html for an example
    */
    L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome || L.Browser.android23);

    this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;

    this._loadTile(tile, tilePoint);

    if (tile.parentNode !== this._tileContainer) {
      container.appendChild(tile);
    }
  },

  _getZoomForUrl: function () {

    var options = this.options,
        zoom = this._map.getZoom();

    if (options.zoomReverse) {
      zoom = options.maxZoom - zoom;
    }

    return zoom + options.zoomOffset;
  },

  _getTilePos: function (tilePoint) {
    var origin = this._map.getPixelOrigin(),
        tileSize = this.options.tileSize;

    return tilePoint.multiplyBy(tileSize).subtract(origin);
  },

  // image-specific code (override to implement e.g. Canvas or SVG tile layer)

  getTileUrl: function (tilePoint) {
    return L.Util.template(this._url, L.extend({
      s: this._getSubdomain(tilePoint),
      z: tilePoint.z,
      x: tilePoint.x,
      y: tilePoint.y
    }, this.options));
  },

  _getWrapTileNum: function () {
    // TODO refactor, limit is not valid for non-standard projections
    return Math.pow(2, this._getZoomForUrl());
  },

  _adjustTilePoint: function (tilePoint) {

    var limit = this._getWrapTileNum();

    // wrap tile coordinates
    if (!this.options.continuousWorld && !this.options.noWrap) {
      tilePoint.x = ((tilePoint.x % limit) + limit) % limit;
    }

    if (this.options.tms) {
      tilePoint.y = limit - tilePoint.y - 1;
    }

    tilePoint.z = this._getZoomForUrl();
  },

  _getSubdomain: function (tilePoint) {
    var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
    return this.options.subdomains[index];
  },

  _createTileProto: function () {
    var img = this._tileImg = L.DomUtil.create('img', 'leaflet-tile');
    img.style.width = img.style.height = this.options.tileSize + 'px';
    img.galleryimg = 'no';
  },

  _getTile: function () {
    if (this.options.reuseTiles && this._unusedTiles.length > 0) {
      var tile = this._unusedTiles.pop();
      this._resetTile(tile);
      return tile;
    }
    return this._createTile();
  },

  // Override if data stored on a tile needs to be cleaned up before reuse
  _resetTile: function (/*tile*/) {},

  _createTile: function () {
    var tile = this._tileImg.cloneNode(false);
    tile.onselectstart = tile.onmousemove = L.Util.falseFn;

    if (L.Browser.ielt9 && this.options.opacity !== undefined) {
      L.DomUtil.setOpacity(tile, this.options.opacity);
    }
    return tile;
  },

  _loadTile: function (tile, tilePoint) {
    tile._layer  = this;
    tile.onload  = this._tileOnLoad;
    tile.onerror = this._tileOnError;

    this._adjustTilePoint(tilePoint);
    tile.src     = this.getTileUrl(tilePoint);
  },

  _tileLoaded: function () {
    this._tilesToLoad--;
    if (!this._tilesToLoad) {
      this.fire('load');

      if (this._animated) {
        // clear scaled tiles after all new tiles are loaded (for performance)
        clearTimeout(this._clearBgBufferTimer);
        this._clearBgBufferTimer = setTimeout(L.bind(this._clearBgBuffer, this), 500);
      }
    }
  },

  _tileOnLoad: function () {
    var layer = this._layer;

    //Only if we are loading an actual image
    if (this.src !== L.Util.emptyImageUrl) {
      L.DomUtil.addClass(this, 'leaflet-tile-loaded');

      layer.fire('tileload', {
        tile: this,
        url: this.src
      });
    }

    layer._tileLoaded();
  },

  _tileOnError: function () {
    var layer = this._layer;

    layer.fire('tileerror', {
      tile: this,
      url: this.src
    });

    var newUrl = layer.options.errorTileUrl;
    if (newUrl) {
      this.src = newUrl;
    }

    layer._tileLoaded();
  }
});

L.tileLayer = function (url, options) {
  return new L.TileLayer(url, options);
};


/*
 * L.TileLayer.WMS is used for putting WMS tile layers on the map.
 */

L.TileLayer.WMS = L.TileLayer.extend({

  defaultWmsParams: {
    service: 'WMS',
    request: 'GetMap',
    version: '1.1.1',
    layers: '',
    styles: '',
    format: 'image/jpeg',
    transparent: false
  },

  initialize: function (url, options) { // (String, Object)

    this._url = url;

    var wmsParams = L.extend({}, this.defaultWmsParams),
        tileSize = options.tileSize || this.options.tileSize;

    if (options.detectRetina && L.Browser.retina) {
      wmsParams.width = wmsParams.height = tileSize * 2;
    } else {
      wmsParams.width = wmsParams.height = tileSize;
    }

    for (var i in options) {
      // all keys that are not TileLayer options go to WMS params
      if (!this.options.hasOwnProperty(i) && i !== 'crs') {
        wmsParams[i] = options[i];
      }
    }

    this.wmsParams = wmsParams;

    L.setOptions(this, options);
  },

  onAdd: function (map) {

    this._crs = this.options.crs || map.options.crs;

    var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs';
    this.wmsParams[projectionKey] = this._crs.code;

    L.TileLayer.prototype.onAdd.call(this, map);
  },

  getTileUrl: function (tilePoint, zoom) { // (Point, Number) -> String

    var map = this._map,
        tileSize = this.options.tileSize,

        nwPoint = tilePoint.multiplyBy(tileSize),
        sePoint = nwPoint.add([tileSize, tileSize]),

        nw = this._crs.project(map.unproject(nwPoint, zoom)),
        se = this._crs.project(map.unproject(sePoint, zoom)),

        bbox = [nw.x, se.y, se.x, nw.y].join(','),

        url = L.Util.template(this._url, {s: this._getSubdomain(tilePoint)});

    return url + L.Util.getParamString(this.wmsParams, url, true) + '&BBOX=' + bbox;
  },

  setParams: function (params, noRedraw) {

    L.extend(this.wmsParams, params);

    if (!noRedraw) {
      this.redraw();
    }

    return this;
  }
});

L.tileLayer.wms = function (url, options) {
  return new L.TileLayer.WMS(url, options);
};


/*
 * L.TileLayer.Canvas is a class that you can use as a base for creating
 * dynamically drawn Canvas-based tile layers.
 */

L.TileLayer.Canvas = L.TileLayer.extend({
  options: {
    async: false
  },

  initialize: function (options) {
    L.setOptions(this, options);
  },

  redraw: function () {
    for (var i in this._tiles) {
      this._redrawTile(this._tiles[i]);
    }
    return this;
  },

  _redrawTile: function (tile) {
    this.drawTile(tile, tile._tilePoint, this._map._zoom);
  },

  _createTileProto: function () {
    var proto = this._canvasProto = L.DomUtil.create('canvas', 'leaflet-tile');
    proto.width = proto.height = this.options.tileSize;
  },

  _createTile: function () {
    var tile = this._canvasProto.cloneNode(false);
    tile.onselectstart = tile.onmousemove = L.Util.falseFn;
    return tile;
  },

  _loadTile: function (tile, tilePoint) {
    tile._layer = this;
    tile._tilePoint = tilePoint;

    this._redrawTile(tile);

    if (!this.options.async) {
      this.tileDrawn(tile);
    }
  },

  drawTile: function (/*tile, tilePoint*/) {
    // override with rendering code
  },

  tileDrawn: function (tile) {
    this._tileOnLoad.call(tile);
  }
});


L.tileLayer.canvas = function (options) {
  return new L.TileLayer.Canvas(options);
};


/*
 * L.ImageOverlay is used to overlay images over the map (to specific geographical bounds).
 */

L.ImageOverlay = L.Class.extend({
  includes: L.Mixin.Events,

  options: {
    opacity: 1
  },

  initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
    this._url = url;
    this._bounds = L.latLngBounds(bounds);

    L.setOptions(this, options);
  },

  onAdd: function (map) {
    this._map = map;

    if (!this._image) {
      this._initImage();
    }

    map._panes.overlayPane.appendChild(this._image);

    map.on('viewreset', this._reset, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._image);

    map.off('viewreset', this._reset, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    this._updateOpacity();
    return this;
  },

  // TODO remove bringToFront/bringToBack duplication from TileLayer/Path
  bringToFront: function () {
    if (this._image) {
      this._map._panes.overlayPane.appendChild(this._image);
    }
    return this;
  },

  bringToBack: function () {
    var pane = this._map._panes.overlayPane;
    if (this._image) {
      pane.insertBefore(this._image, pane.firstChild);
    }
    return this;
  },

  _initImage: function () {
    this._image = L.DomUtil.create('img', 'leaflet-image-layer');

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    //TODO createImage util method to remove duplication
    L.extend(this._image, {
      galleryimg: 'no',
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.bind(this._onImageLoad, this),
      src: this._url
    });
  },

  _animateZoom: function (e) {
    var map = this._map,
        image = this._image,
        scale = map.getZoomScale(e.zoom),
        nw = this._bounds.getNorthWest(),
        se = this._bounds.getSouthEast(),

        topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
        size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
        origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

    image.style[L.DomUtil.TRANSFORM] =
            L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
  },

  _reset: function () {
    var image   = this._image,
        topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
        size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

    L.DomUtil.setPosition(image, topLeft);

    image.style.width  = size.x + 'px';
    image.style.height = size.y + 'px';
  },

  _onImageLoad: function () {
    this.fire('load');
  },

  _updateOpacity: function () {
    L.DomUtil.setOpacity(this._image, this.options.opacity);
  }
});

L.imageOverlay = function (url, bounds, options) {
  return new L.ImageOverlay(url, bounds, options);
};


/*
 * L.Icon is an image-based icon class that you can use with L.Marker for custom markers.
 */

L.Icon = L.Class.extend({
  options: {
    /*
    iconUrl: (String) (required)
    iconRetinaUrl: (String) (optional, used for retina devices if detected)
    iconSize: (Point) (can be set through CSS)
    iconAnchor: (Point) (centered by default, can be set in CSS with negative margins)
    popupAnchor: (Point) (if not specified, popup opens in the anchor point)
    shadowUrl: (String) (no shadow by default)
    shadowRetinaUrl: (String) (optional, used for retina devices if detected)
    shadowSize: (Point)
    shadowAnchor: (Point)
    */
    className: ''
  },

  initialize: function (options) {
    L.setOptions(this, options);
  },

  createIcon: function (oldIcon) {
    return this._createIcon('icon', oldIcon);
  },

  createShadow: function (oldIcon) {
    return this._createIcon('shadow', oldIcon);
  },

  _createIcon: function (name, oldIcon) {
    var src = this._getIconUrl(name);

    if (!src) {
      if (name === 'icon') {
        throw new Error('iconUrl not set in Icon options (see the docs).');
      }
      return null;
    }

    var img;
    if (!oldIcon || oldIcon.tagName !== 'IMG') {
      img = this._createImg(src);
    } else {
      img = this._createImg(src, oldIcon);
    }
    this._setIconStyles(img, name);

    return img;
  },

  _setIconStyles: function (img, name) {
    var options = this.options,
        size = L.point(options[name + 'Size']),
        anchor;

    if (name === 'shadow') {
      anchor = L.point(options.shadowAnchor || options.iconAnchor);
    } else {
      anchor = L.point(options.iconAnchor);
    }

    if (!anchor && size) {
      anchor = size.divideBy(2, true);
    }

    img.className = 'leaflet-marker-' + name + ' ' + options.className;

    if (anchor) {
      img.style.marginLeft = (-anchor.x) + 'px';
      img.style.marginTop  = (-anchor.y) + 'px';
    }

    if (size) {
      img.style.width  = size.x + 'px';
      img.style.height = size.y + 'px';
    }
  },

  _createImg: function (src, el) {

    if (!L.Browser.ie6) {
      if (!el) {
        el = document.createElement('img');
      }
      el.src = src;
    } else {
      if (!el) {
        el = document.createElement('div');
      }
      el.style.filter =
              'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
    }
    return el;
  },

  _getIconUrl: function (name) {
    if (L.Browser.retina && this.options[name + 'RetinaUrl']) {
      return this.options[name + 'RetinaUrl'];
    }
    return this.options[name + 'Url'];
  }
});

L.icon = function (options) {
  return new L.Icon(options);
};


/*
 * L.Icon.Default is the blue marker icon used by default in Leaflet.
 */

L.Icon.Default = L.Icon.extend({

  options: {
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],

    shadowSize: [41, 41]
  },

  _getIconUrl: function (name) {
    var key = name + 'Url';

    if (this.options[key]) {
      return this.options[key];
    }

    if (L.Browser.retina && name === 'icon') {
      name += '-2x';
    }

    var path = L.Icon.Default.imagePath;

    if (!path) {
      throw new Error('Couldn\'t autodetect L.Icon.Default.imagePath, set it manually.');
    }

    return path + '/marker-' + name + '.png';
  }
});

L.Icon.Default.imagePath = (function () {
  var scripts = document.getElementsByTagName('script'),
      leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;

  var i, len, src, matches, path;

  for (i = 0, len = scripts.length; i < len; i++) {
    src = scripts[i].src;
    matches = src.match(leafletRe);

    if (matches) {
      path = src.split(leafletRe)[0];
      return (path ? path + '/' : '') + 'images';
    }
  }
}());


/*
 * L.Marker is used to display clickable/draggable icons on the map.
 */

L.Marker = L.Class.extend({

  includes: L.Mixin.Events,

  options: {
    icon: new L.Icon.Default(),
    title: '',
    clickable: true,
    draggable: false,
    keyboard: true,
    zIndexOffset: 0,
    opacity: 1,
    riseOnHover: false,
    riseOffset: 250
  },

  initialize: function (latlng, options) {
    L.setOptions(this, options);
    this._latlng = L.latLng(latlng);
  },

  onAdd: function (map) {
    this._map = map;

    map.on('viewreset', this.update, this);

    this._initIcon();
    this.update();

    if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
      map.on('zoomanim', this._animateZoom, this);
    }
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  onRemove: function (map) {
    if (this.dragging) {
      this.dragging.disable();
    }

    this._removeIcon();
    this._removeShadow();

    this.fire('remove');

    map.off({
      'viewreset': this.update,
      'zoomanim': this._animateZoom
    }, this);

    this._map = null;
  },

  getLatLng: function () {
    return this._latlng;
  },

  setLatLng: function (latlng) {
    this._latlng = L.latLng(latlng);

    this.update();

    return this.fire('move', { latlng: this._latlng });
  },

  setZIndexOffset: function (offset) {
    this.options.zIndexOffset = offset;
    this.update();

    return this;
  },

  setIcon: function (icon) {

    this.options.icon = icon;

    if (this._map) {
      this._initIcon();
      this.update();
    }

    return this;
  },

  update: function () {
    if (this._icon) {
      var pos = this._map.latLngToLayerPoint(this._latlng).round();
      this._setPos(pos);
    }

    return this;
  },

  _initIcon: function () {
    var options = this.options,
        map = this._map,
        animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
        classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

    var icon = options.icon.createIcon(this._icon),
      addIcon = false;

    // if we're not reusing the icon, remove the old one and init new one
    if (icon !== this._icon) {
      if (this._icon) {
        this._removeIcon();
      }
      addIcon = true;

      if (options.title) {
        icon.title = options.title;
      }
    }

    L.DomUtil.addClass(icon, classToAdd);

    if (options.keyboard) {
      icon.tabIndex = '0';
    }

    this._icon = icon;

    this._initInteraction();

    if (options.riseOnHover) {
      L.DomEvent
        .on(icon, 'mouseover', this._bringToFront, this)
        .on(icon, 'mouseout', this._resetZIndex, this);
    }

    var newShadow = options.icon.createShadow(this._shadow),
      addShadow = false;

    if (newShadow !== this._shadow) {
      this._removeShadow();
      addShadow = true;

      if (newShadow) {
        L.DomUtil.addClass(newShadow, classToAdd);
      }
    }
    this._shadow = newShadow;


    if (options.opacity < 1) {
      this._updateOpacity();
    }


    var panes = this._map._panes;

    if (addIcon) {
      panes.markerPane.appendChild(this._icon);
    }

    if (newShadow && addShadow) {
      panes.shadowPane.appendChild(this._shadow);
    }
  },

  _removeIcon: function () {
    if (this.options.riseOnHover) {
      L.DomEvent
          .off(this._icon, 'mouseover', this._bringToFront)
          .off(this._icon, 'mouseout', this._resetZIndex);
    }

    this._map._panes.markerPane.removeChild(this._icon);

    this._icon = null;
  },

  _removeShadow: function () {
    if (this._shadow) {
      this._map._panes.shadowPane.removeChild(this._shadow);
    }
    this._shadow = null;
  },

  _setPos: function (pos) {
    L.DomUtil.setPosition(this._icon, pos);

    if (this._shadow) {
      L.DomUtil.setPosition(this._shadow, pos);
    }

    this._zIndex = pos.y + this.options.zIndexOffset;

    this._resetZIndex();
  },

  _updateZIndex: function (offset) {
    this._icon.style.zIndex = this._zIndex + offset;
  },

  _animateZoom: function (opt) {
    var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

    this._setPos(pos);
  },

  _initInteraction: function () {

    if (!this.options.clickable) { return; }

    // TODO refactor into something shared with Map/Path/etc. to DRY it up

    var icon = this._icon,
        events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

    L.DomUtil.addClass(icon, 'leaflet-clickable');
    L.DomEvent.on(icon, 'click', this._onMouseClick, this);
    L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);

    for (var i = 0; i < events.length; i++) {
      L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
    }

    if (L.Handler.MarkerDrag) {
      this.dragging = new L.Handler.MarkerDrag(this);

      if (this.options.draggable) {
        this.dragging.enable();
      }
    }
  },

  _onMouseClick: function (e) {
    var wasDragged = this.dragging && this.dragging.moved();

    if (this.hasEventListeners(e.type) || wasDragged) {
      L.DomEvent.stopPropagation(e);
    }

    if (wasDragged) { return; }

    if ((!this.dragging || !this.dragging._enabled) && this._map.dragging && this._map.dragging.moved()) { return; }

    this.fire(e.type, {
      originalEvent: e,
      latlng: this._latlng
    });
  },

  _onKeyPress: function (e) {
    if (e.keyCode === 13) {
      this.fire('click', {
        originalEvent: e,
        latlng: this._latlng
      });
    }
  },

  _fireMouseEvent: function (e) {

    this.fire(e.type, {
      originalEvent: e,
      latlng: this._latlng
    });

    // TODO proper custom event propagation
    // this line will always be called if marker is in a FeatureGroup
    if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
      L.DomEvent.preventDefault(e);
    }
    if (e.type !== 'mousedown') {
      L.DomEvent.stopPropagation(e);
    } else {
      L.DomEvent.preventDefault(e);
    }
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    if (this._map) {
      this._updateOpacity();
    }
  },

  _updateOpacity: function () {
    L.DomUtil.setOpacity(this._icon, this.options.opacity);
    if (this._shadow) {
      L.DomUtil.setOpacity(this._shadow, this.options.opacity);
    }
  },

  _bringToFront: function () {
    this._updateZIndex(this.options.riseOffset);
  },

  _resetZIndex: function () {
    this._updateZIndex(0);
  }
});

L.marker = function (latlng, options) {
  return new L.Marker(latlng, options);
};


/*
 * L.DivIcon is a lightweight HTML-based icon class (as opposed to the image-based L.Icon)
 * to use with L.Marker.
 */

L.DivIcon = L.Icon.extend({
  options: {
    iconSize: [12, 12], // also can be set through CSS
    /*
    iconAnchor: (Point)
    popupAnchor: (Point)
    html: (String)
    bgPos: (Point)
    */
    className: 'leaflet-div-icon',
    html: false
  },

  createIcon: function (oldIcon) {
    var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
        options = this.options;

    if (options.html !== false) {
      div.innerHTML = options.html;
    } else {
      div.innerHTML = '';
    }

    if (options.bgPos) {
      div.style.backgroundPosition =
              (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
    }

    this._setIconStyles(div, 'icon');
    return div;
  },

  createShadow: function () {
    return null;
  }
});

L.divIcon = function (options) {
  return new L.DivIcon(options);
};


/*
 * L.Popup is used for displaying popups on the map.
 */

L.Map.mergeOptions({
  closePopupOnClick: true
});

L.Popup = L.Class.extend({
  includes: L.Mixin.Events,

  options: {
    minWidth: 50,
    maxWidth: 300,
    maxHeight: null,
    autoPan: true,
    closeButton: true,
    offset: [0, 7],
    autoPanPadding: [5, 5],
    keepInView: false,
    className: '',
    zoomAnimation: true
  },

  initialize: function (options, source) {
    L.setOptions(this, options);

    this._source = source;
    this._animated = L.Browser.any3d && this.options.zoomAnimation;
    this._isOpen = false;
  },

  onAdd: function (map) {
    this._map = map;

    if (!this._container) {
      this._initLayout();
    }
    this._updateContent();

    var animFade = map.options.fadeAnimation;

    if (animFade) {
      L.DomUtil.setOpacity(this._container, 0);
    }
    map._panes.popupPane.appendChild(this._container);

    map.on(this._getEvents(), this);

    this._update();

    if (animFade) {
      L.DomUtil.setOpacity(this._container, 1);
    }

    this.fire('open');

    map.fire('popupopen', {popup: this});

    if (this._source) {
      this._source.fire('popupopen', {popup: this});
    }
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  openOn: function (map) {
    map.openPopup(this);
    return this;
  },

  onRemove: function (map) {
    map._panes.popupPane.removeChild(this._container);

    L.Util.falseFn(this._container.offsetWidth); // force reflow

    map.off(this._getEvents(), this);

    if (map.options.fadeAnimation) {
      L.DomUtil.setOpacity(this._container, 0);
    }

    this._map = null;

    this.fire('close');

    map.fire('popupclose', {popup: this});

    if (this._source) {
      this._source.fire('popupclose', {popup: this});
    }
  },

  setLatLng: function (latlng) {
    this._latlng = L.latLng(latlng);
    this._update();
    return this;
  },

  setContent: function (content) {
    this._content = content;
    this._update();
    return this;
  },

  _getEvents: function () {
    var events = {
      viewreset: this._updatePosition
    };

    if (this._animated) {
      events.zoomanim = this._zoomAnimation;
    }
    if ('closeOnClick' in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
      events.preclick = this._close;
    }
    if (this.options.keepInView) {
      events.moveend = this._adjustPan;
    }

    return events;
  },

  _close: function () {
    if (this._map) {
      this._map.closePopup(this);
    }
  },

  _initLayout: function () {
    var prefix = 'leaflet-popup',
      containerClass = prefix + ' ' + this.options.className + ' leaflet-zoom-' +
              (this._animated ? 'animated' : 'hide'),
      container = this._container = L.DomUtil.create('div', containerClass),
      closeButton;

    if (this.options.closeButton) {
      closeButton = this._closeButton =
              L.DomUtil.create('a', prefix + '-close-button', container);
      closeButton.href = '#close';
      closeButton.innerHTML = '&#215;';
      L.DomEvent.disableClickPropagation(closeButton);

      L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
    }

    var wrapper = this._wrapper =
            L.DomUtil.create('div', prefix + '-content-wrapper', container);
    L.DomEvent.disableClickPropagation(wrapper);

    this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);
    L.DomEvent.on(this._contentNode, 'mousewheel', L.DomEvent.stopPropagation);
    L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);
    this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
    this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
  },

  _update: function () {
    if (!this._map) { return; }

    this._container.style.visibility = 'hidden';

    this._updateContent();
    this._updateLayout();
    this._updatePosition();

    this._container.style.visibility = '';

    this._adjustPan();
  },

  _updateContent: function () {
    if (!this._content) { return; }

    if (typeof this._content === 'string') {
      this._contentNode.innerHTML = this._content;
    } else {
      while (this._contentNode.hasChildNodes()) {
        this._contentNode.removeChild(this._contentNode.firstChild);
      }
      this._contentNode.appendChild(this._content);
    }
    this.fire('contentupdate');
  },

  _updateLayout: function () {
    var container = this._contentNode,
        style = container.style;

    style.width = '';
    style.whiteSpace = 'nowrap';

    var width = container.offsetWidth;
    width = Math.min(width, this.options.maxWidth);
    width = Math.max(width, this.options.minWidth);

    style.width = (width + 1) + 'px';
    style.whiteSpace = '';

    style.height = '';

    var height = container.offsetHeight,
        maxHeight = this.options.maxHeight,
        scrolledClass = 'leaflet-popup-scrolled';

    if (maxHeight && height > maxHeight) {
      style.height = maxHeight + 'px';
      L.DomUtil.addClass(container, scrolledClass);
    } else {
      L.DomUtil.removeClass(container, scrolledClass);
    }

    this._containerWidth = this._container.offsetWidth;
  },

  _updatePosition: function () {
    if (!this._map) { return; }

    var pos = this._map.latLngToLayerPoint(this._latlng),
        animated = this._animated,
        offset = L.point(this.options.offset);

    if (animated) {
      L.DomUtil.setPosition(this._container, pos);
    }

    this._containerBottom = -offset.y - (animated ? 0 : pos.y);
    this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (animated ? 0 : pos.x);

    // bottom position the popup in case the height of the popup changes (images loading etc)
    this._container.style.bottom = this._containerBottom + 'px';
    this._container.style.left = this._containerLeft + 'px';
  },

  _zoomAnimation: function (opt) {
    var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

    L.DomUtil.setPosition(this._container, pos);
  },

  _adjustPan: function () {
    if (!this.options.autoPan) { return; }

    var map = this._map,
        containerHeight = this._container.offsetHeight,
        containerWidth = this._containerWidth,

        layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);

    if (this._animated) {
      layerPos._add(L.DomUtil.getPosition(this._container));
    }

    var containerPos = map.layerPointToContainerPoint(layerPos),
        padding = L.point(this.options.autoPanPadding),
        size = map.getSize(),
        dx = 0,
        dy = 0;

    if (containerPos.x + containerWidth > size.x) { // right
      dx = containerPos.x + containerWidth - size.x + padding.x;
    }
    if (containerPos.x - dx < 0) { // left
      dx = containerPos.x - padding.x;
    }
    if (containerPos.y + containerHeight > size.y) { // bottom
      dy = containerPos.y + containerHeight - size.y + padding.y;
    }
    if (containerPos.y - dy < 0) { // top
      dy = containerPos.y - padding.y;
    }

    if (dx || dy) {
      map
          .fire('autopanstart')
          .panBy([dx, dy]);
    }
  },

  _onCloseButtonClick: function (e) {
    this._close();
    L.DomEvent.stop(e);
  }
});

L.popup = function (options, source) {
  return new L.Popup(options, source);
};


L.Map.include({
  openPopup: function (popup, latlng, options) { // (Popup) or (String || HTMLElement, LatLng[, Object])
    this.closePopup();

    if (!(popup instanceof L.Popup)) {
      var content = popup;

      popup = new L.Popup(options)
          .setLatLng(latlng)
          .setContent(content);
    }
    popup._isOpen = true;

    this._popup = popup;
    return this.addLayer(popup);
  },

  closePopup: function (popup) {
    if (!popup || popup === this._popup) {
      popup = this._popup;
      this._popup = null;
    }
    if (popup) {
      this.removeLayer(popup);
      popup._isOpen = false;
    }
    return this;
  }
});


/*
 * Popup extension to L.Marker, adding popup-related methods.
 */

L.Marker.include({
  openPopup: function () {
    if (this._popup && this._map && !this._map.hasLayer(this._popup)) {
      this._popup.setLatLng(this._latlng);
      this._map.openPopup(this._popup);
    }

    return this;
  },

  closePopup: function () {
    if (this._popup) {
      this._popup._close();
    }
    return this;
  },

  togglePopup: function () {
    if (this._popup) {
      if (this._popup._isOpen) {
        this.closePopup();
      } else {
        this.openPopup();
      }
    }
    return this;
  },

  bindPopup: function (content, options) {
    var anchor = L.point(this.options.icon.options.popupAnchor || [0, 0]);

    anchor = anchor.add(L.Popup.prototype.options.offset);

    if (options && options.offset) {
      anchor = anchor.add(options.offset);
    }

    options = L.extend({offset: anchor}, options);

    if (!this._popup) {
      this
          .on('click', this.togglePopup, this)
          .on('remove', this.closePopup, this)
          .on('move', this._movePopup, this);
    }

    if (content instanceof L.Popup) {
      L.setOptions(content, options);
      this._popup = content;
    } else {
      this._popup = new L.Popup(options, this)
        .setContent(content);
    }

    return this;
  },

  setPopupContent: function (content) {
    if (this._popup) {
      this._popup.setContent(content);
    }
    return this;
  },

  unbindPopup: function () {
    if (this._popup) {
      this._popup = null;
      this
          .off('click', this.togglePopup)
          .off('remove', this.closePopup)
          .off('move', this._movePopup);
    }
    return this;
  },

  _movePopup: function (e) {
    this._popup.setLatLng(e.latlng);
  }
});


/*
 * L.LayerGroup is a class to combine several layers into one so that
 * you can manipulate the group (e.g. add/remove it) as one layer.
 */

L.LayerGroup = L.Class.extend({
  initialize: function (layers) {
    this._layers = {};

    var i, len;

    if (layers) {
      for (i = 0, len = layers.length; i < len; i++) {
        this.addLayer(layers[i]);
      }
    }
  },

  addLayer: function (layer) {
    var id = this.getLayerId(layer);

    this._layers[id] = layer;

    if (this._map) {
      this._map.addLayer(layer);
    }

    return this;
  },

  removeLayer: function (layer) {
    var id = layer in this._layers ? layer : this.getLayerId(layer);

    if (this._map && this._layers[id]) {
      this._map.removeLayer(this._layers[id]);
    }

    delete this._layers[id];

    return this;
  },

  hasLayer: function (layer) {
    if (!layer) { return false; }

    return (layer in this._layers || this.getLayerId(layer) in this._layers);
  },

  clearLayers: function () {
    this.eachLayer(this.removeLayer, this);
    return this;
  },

  invoke: function (methodName) {
    var args = Array.prototype.slice.call(arguments, 1),
        i, layer;

    for (i in this._layers) {
      layer = this._layers[i];

      if (layer[methodName]) {
        layer[methodName].apply(layer, args);
      }
    }

    return this;
  },

  onAdd: function (map) {
    this._map = map;
    this.eachLayer(map.addLayer, map);
  },

  onRemove: function (map) {
    this.eachLayer(map.removeLayer, map);
    this._map = null;
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  eachLayer: function (method, context) {
    for (var i in this._layers) {
      method.call(context, this._layers[i]);
    }
    return this;
  },

  getLayer: function (id) {
    return this._layers[id];
  },

  getLayers: function () {
    var layers = [];

    for (var i in this._layers) {
      layers.push(this._layers[i]);
    }
    return layers;
  },

  setZIndex: function (zIndex) {
    return this.invoke('setZIndex', zIndex);
  },

  getLayerId: function (layer) {
    return L.stamp(layer);
  }
});

L.layerGroup = function (layers) {
  return new L.LayerGroup(layers);
};


/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
 * shared between a group of interactive layers (like vectors or markers).
 */

L.FeatureGroup = L.LayerGroup.extend({
  includes: L.Mixin.Events,

  statics: {
    EVENTS: 'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose'
  },

  addLayer: function (layer) {
    if (this.hasLayer(layer)) {
      return this;
    }

    layer.on(L.FeatureGroup.EVENTS, this._propagateEvent, this);

    L.LayerGroup.prototype.addLayer.call(this, layer);

    if (this._popupContent && layer.bindPopup) {
      layer.bindPopup(this._popupContent, this._popupOptions);
    }

    return this.fire('layeradd', {layer: layer});
  },

  removeLayer: function (layer) {
    if (layer in this._layers) {
      layer = this._layers[layer];
    }

    layer.off(L.FeatureGroup.EVENTS, this._propagateEvent, this);

    L.LayerGroup.prototype.removeLayer.call(this, layer);

    if (this._popupContent) {
      this.invoke('unbindPopup');
    }

    return this.fire('layerremove', {layer: layer});
  },

  bindPopup: function (content, options) {
    this._popupContent = content;
    this._popupOptions = options;
    return this.invoke('bindPopup', content, options);
  },

  setStyle: function (style) {
    return this.invoke('setStyle', style);
  },

  bringToFront: function () {
    return this.invoke('bringToFront');
  },

  bringToBack: function () {
    return this.invoke('bringToBack');
  },

  getBounds: function () {
    var bounds = new L.LatLngBounds();

    this.eachLayer(function (layer) {
      bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds());
    });

    return bounds;
  },

  _propagateEvent: function (e) {
    if (!e.layer) {
      e.layer = e.target;
    }
    e.target = this;

    this.fire(e.type, e);
  }
});

L.featureGroup = function (layers) {
  return new L.FeatureGroup(layers);
};


/*
 * L.Path is a base class for rendering vector paths on a map. Inherited by Polyline, Circle, etc.
 */

L.Path = L.Class.extend({
  includes: [L.Mixin.Events],

  statics: {
    // how much to extend the clip area around the map view
    // (relative to its size, e.g. 0.5 is half the screen in each direction)
    // set it so that SVG element doesn't exceed 1280px (vectors flicker on dragend if it is)
    CLIP_PADDING: L.Browser.mobile ?
      Math.max(0, Math.min(0.5,
              (1280 / Math.max(window.innerWidth, window.innerHeight) - 1) / 2)) : 0.5
  },

  options: {
    stroke: true,
    color: '#0033ff',
    dashArray: null,
    weight: 5,
    opacity: 0.5,

    fill: false,
    fillColor: null, //same as color by default
    fillOpacity: 0.2,

    clickable: true
  },

  initialize: function (options) {
    L.setOptions(this, options);
  },

  onAdd: function (map) {
    this._map = map;

    if (!this._container) {
      this._initElements();
      this._initEvents();
    }

    this.projectLatlngs();
    this._updatePath();

    if (this._container) {
      this._map._pathRoot.appendChild(this._container);
    }

    this.fire('add');

    map.on({
      'viewreset': this.projectLatlngs,
      'moveend': this._updatePath
    }, this);
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  onRemove: function (map) {
    map._pathRoot.removeChild(this._container);

    // Need to fire remove event before we set _map to null as the event hooks might need the object
    this.fire('remove');
    this._map = null;

    if (L.Browser.vml) {
      this._container = null;
      this._stroke = null;
      this._fill = null;
    }

    map.off({
      'viewreset': this.projectLatlngs,
      'moveend': this._updatePath
    }, this);
  },

  projectLatlngs: function () {
    // do all projection stuff here
  },

  setStyle: function (style) {
    L.setOptions(this, style);

    if (this._container) {
      this._updateStyle();
    }

    return this;
  },

  redraw: function () {
    if (this._map) {
      this.projectLatlngs();
      this._updatePath();
    }
    return this;
  }
});

L.Map.include({
  _updatePathViewport: function () {
    var p = L.Path.CLIP_PADDING,
        size = this.getSize(),
        panePos = L.DomUtil.getPosition(this._mapPane),
        min = panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)._round()),
        max = min.add(size.multiplyBy(1 + p * 2)._round());

    this._pathViewport = new L.Bounds(min, max);
  }
});


/*
 * Extends L.Path with SVG-specific rendering code.
 */

L.Path.SVG_NS = 'http://www.w3.org/2000/svg';

L.Browser.svg = !!(document.createElementNS && document.createElementNS(L.Path.SVG_NS, 'svg').createSVGRect);

L.Path = L.Path.extend({
  statics: {
    SVG: L.Browser.svg
  },

  bringToFront: function () {
    var root = this._map._pathRoot,
        path = this._container;

    if (path && root.lastChild !== path) {
      root.appendChild(path);
    }
    return this;
  },

  bringToBack: function () {
    var root = this._map._pathRoot,
        path = this._container,
        first = root.firstChild;

    if (path && first !== path) {
      root.insertBefore(path, first);
    }
    return this;
  },

  getPathString: function () {
    // form path string here
  },

  _createElement: function (name) {
    return document.createElementNS(L.Path.SVG_NS, name);
  },

  _initElements: function () {
    this._map._initPathRoot();
    this._initPath();
    this._initStyle();
  },

  _initPath: function () {
    this._container = this._createElement('g');

    this._path = this._createElement('path');
    this._container.appendChild(this._path);
  },

  _initStyle: function () {
    if (this.options.stroke) {
      this._path.setAttribute('stroke-linejoin', 'round');
      this._path.setAttribute('stroke-linecap', 'round');
    }
    if (this.options.fill) {
      this._path.setAttribute('fill-rule', 'evenodd');
    }
    if (this.options.pointerEvents) {
      this._path.setAttribute('pointer-events', this.options.pointerEvents);
    }
    if (!this.options.clickable && !this.options.pointerEvents) {
      this._path.setAttribute('pointer-events', 'none');
    }
    this._updateStyle();
  },

  _updateStyle: function () {
    if (this.options.stroke) {
      this._path.setAttribute('stroke', this.options.color);
      this._path.setAttribute('stroke-opacity', this.options.opacity);
      this._path.setAttribute('stroke-width', this.options.weight);
      if (this.options.dashArray) {
        this._path.setAttribute('stroke-dasharray', this.options.dashArray);
      } else {
        this._path.removeAttribute('stroke-dasharray');
      }
    } else {
      this._path.setAttribute('stroke', 'none');
    }
    if (this.options.fill) {
      this._path.setAttribute('fill', this.options.fillColor || this.options.color);
      this._path.setAttribute('fill-opacity', this.options.fillOpacity);
    } else {
      this._path.setAttribute('fill', 'none');
    }
  },

  _updatePath: function () {
    var str = this.getPathString();
    if (!str) {
      // fix webkit empty string parsing bug
      str = 'M0 0';
    }
    this._path.setAttribute('d', str);
  },

  // TODO remove duplication with L.Map
  _initEvents: function () {
    if (this.options.clickable) {
      if (L.Browser.svg || !L.Browser.vml) {
        this._path.setAttribute('class', 'leaflet-clickable');
      }

      L.DomEvent.on(this._container, 'click', this._onMouseClick, this);

      var events = ['dblclick', 'mousedown', 'mouseover',
                    'mouseout', 'mousemove', 'contextmenu'];
      for (var i = 0; i < events.length; i++) {
        L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);
      }
    }
  },

  _onMouseClick: function (e) {
    if (this._map.dragging && this._map.dragging.moved()) { return; }

    this._fireMouseEvent(e);
  },

  _fireMouseEvent: function (e) {
    if (!this.hasEventListeners(e.type)) { return; }

    var map = this._map,
        containerPoint = map.mouseEventToContainerPoint(e),
        layerPoint = map.containerPointToLayerPoint(containerPoint),
        latlng = map.layerPointToLatLng(layerPoint);

    this.fire(e.type, {
      latlng: latlng,
      layerPoint: layerPoint,
      containerPoint: containerPoint,
      originalEvent: e
    });

    if (e.type === 'contextmenu') {
      L.DomEvent.preventDefault(e);
    }
    if (e.type !== 'mousemove') {
      L.DomEvent.stopPropagation(e);
    }
  }
});

L.Map.include({
  _initPathRoot: function () {
    if (!this._pathRoot) {
      this._pathRoot = L.Path.prototype._createElement('svg');
      this._panes.overlayPane.appendChild(this._pathRoot);

      if (this.options.zoomAnimation && L.Browser.any3d) {
        this._pathRoot.setAttribute('class', ' leaflet-zoom-animated');

        this.on({
          'zoomanim': this._animatePathZoom,
          'zoomend': this._endPathZoom
        });
      } else {
        this._pathRoot.setAttribute('class', ' leaflet-zoom-hide');
      }

      this.on('moveend', this._updateSvgViewport);
      this._updateSvgViewport();
    }
  },

  _animatePathZoom: function (e) {
    var scale = this.getZoomScale(e.zoom),
        offset = this._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._pathViewport.min);

    this._pathRoot.style[L.DomUtil.TRANSFORM] =
            L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';

    this._pathZooming = true;
  },

  _endPathZoom: function () {
    this._pathZooming = false;
  },

  _updateSvgViewport: function () {

    if (this._pathZooming) {
      // Do not update SVGs while a zoom animation is going on otherwise the animation will break.
      // When the zoom animation ends we will be updated again anyway
      // This fixes the case where you do a momentum move and zoom while the move is still ongoing.
      return;
    }

    this._updatePathViewport();

    var vp = this._pathViewport,
        min = vp.min,
        max = vp.max,
        width = max.x - min.x,
        height = max.y - min.y,
        root = this._pathRoot,
        pane = this._panes.overlayPane;

    // Hack to make flicker on drag end on mobile webkit less irritating
    if (L.Browser.mobileWebkit) {
      pane.removeChild(root);
    }

    L.DomUtil.setPosition(root, min);
    root.setAttribute('width', width);
    root.setAttribute('height', height);
    root.setAttribute('viewBox', [min.x, min.y, width, height].join(' '));

    if (L.Browser.mobileWebkit) {
      pane.appendChild(root);
    }
  }
});


/*
 * Popup extension to L.Path (polylines, polygons, circles), adding popup-related methods.
 */

L.Path.include({

  bindPopup: function (content, options) {

    if (content instanceof L.Popup) {
      this._popup = content;
    } else {
      if (!this._popup || options) {
        this._popup = new L.Popup(options, this);
      }
      this._popup.setContent(content);
    }

    if (!this._popupHandlersAdded) {
      this
          .on('click', this._openPopup, this)
          .on('remove', this.closePopup, this);

      this._popupHandlersAdded = true;
    }

    return this;
  },

  unbindPopup: function () {
    if (this._popup) {
      this._popup = null;
      this
          .off('click', this._openPopup)
          .off('remove', this.closePopup);

      this._popupHandlersAdded = false;
    }
    return this;
  },

  openPopup: function (latlng) {

    if (this._popup) {
      // open the popup from one of the path's points if not specified
      latlng = latlng || this._latlng ||
               this._latlngs[Math.floor(this._latlngs.length / 2)];

      this._openPopup({latlng: latlng});
    }

    return this;
  },

  closePopup: function () {
    if (this._popup) {
      this._popup._close();
    }
    return this;
  },

  _openPopup: function (e) {
    this._popup.setLatLng(e.latlng);
    this._map.openPopup(this._popup);
  }
});


/*
 * Vector rendering for IE6-8 through VML.
 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
 */

L.Browser.vml = !L.Browser.svg && (function () {
  try {
    var div = document.createElement('div');
    div.innerHTML = '<v:shape adj="1"/>';

    var shape = div.firstChild;
    shape.style.behavior = 'url(#default#VML)';

    return shape && (typeof shape.adj === 'object');

  } catch (e) {
    return false;
  }
}());

L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
  statics: {
    VML: true,
    CLIP_PADDING: 0.02
  },

  _createElement: (function () {
    try {
      document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
      return function (name) {
        return document.createElement('<lvml:' + name + ' class="lvml">');
      };
    } catch (e) {
      return function (name) {
        return document.createElement(
                '<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }
  }()),

  _initPath: function () {
    var container = this._container = this._createElement('shape');
    L.DomUtil.addClass(container, 'leaflet-vml-shape');
    if (this.options.clickable) {
      L.DomUtil.addClass(container, 'leaflet-clickable');
    }
    container.coordsize = '1 1';

    this._path = this._createElement('path');
    container.appendChild(this._path);

    this._map._pathRoot.appendChild(container);
  },

  _initStyle: function () {
    this._updateStyle();
  },

  _updateStyle: function () {
    var stroke = this._stroke,
        fill = this._fill,
        options = this.options,
        container = this._container;

    container.stroked = options.stroke;
    container.filled = options.fill;

    if (options.stroke) {
      if (!stroke) {
        stroke = this._stroke = this._createElement('stroke');
        stroke.endcap = 'round';
        container.appendChild(stroke);
      }
      stroke.weight = options.weight + 'px';
      stroke.color = options.color;
      stroke.opacity = options.opacity;

      if (options.dashArray) {
        stroke.dashStyle = options.dashArray instanceof Array ?
            options.dashArray.join(' ') :
            options.dashArray.replace(/( *, *)/g, ' ');
      } else {
        stroke.dashStyle = '';
      }

    } else if (stroke) {
      container.removeChild(stroke);
      this._stroke = null;
    }

    if (options.fill) {
      if (!fill) {
        fill = this._fill = this._createElement('fill');
        container.appendChild(fill);
      }
      fill.color = options.fillColor || options.color;
      fill.opacity = options.fillOpacity;

    } else if (fill) {
      container.removeChild(fill);
      this._fill = null;
    }
  },

  _updatePath: function () {
    var style = this._container.style;

    style.display = 'none';
    this._path.v = this.getPathString() + ' '; // the space fixes IE empty path string bug
    style.display = '';
  }
});

L.Map.include(L.Browser.svg || !L.Browser.vml ? {} : {
  _initPathRoot: function () {
    if (this._pathRoot) { return; }

    var root = this._pathRoot = document.createElement('div');
    root.className = 'leaflet-vml-container';
    this._panes.overlayPane.appendChild(root);

    this.on('moveend', this._updatePathViewport);
    this._updatePathViewport();
  }
});


/*
 * Vector rendering for all browsers that support canvas.
 */

L.Browser.canvas = (function () {
  return !!document.createElement('canvas').getContext;
}());

L.Path = (L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? L.Path : L.Path.extend({
  statics: {
    //CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
    CANVAS: true,
    SVG: false
  },

  redraw: function () {
    if (this._map) {
      this.projectLatlngs();
      this._requestUpdate();
    }
    return this;
  },

  setStyle: function (style) {
    L.setOptions(this, style);

    if (this._map) {
      this._updateStyle();
      this._requestUpdate();
    }
    return this;
  },

  onRemove: function (map) {
    map
        .off('viewreset', this.projectLatlngs, this)
        .off('moveend', this._updatePath, this);

    if (this.options.clickable) {
      this._map.off('click', this._onClick, this);
      this._map.off('mousemove', this._onMouseMove, this);
    }

    this._requestUpdate();

    this._map = null;
  },

  _requestUpdate: function () {
    if (this._map && !L.Path._updateRequest) {
      L.Path._updateRequest = L.Util.requestAnimFrame(this._fireMapMoveEnd, this._map);
    }
  },

  _fireMapMoveEnd: function () {
    L.Path._updateRequest = null;
    this.fire('moveend');
  },

  _initElements: function () {
    this._map._initPathRoot();
    this._ctx = this._map._canvasCtx;
  },

  _updateStyle: function () {
    var options = this.options;

    if (options.stroke) {
      this._ctx.lineWidth = options.weight;
      this._ctx.strokeStyle = options.color;
    }
    if (options.fill) {
      this._ctx.fillStyle = options.fillColor || options.color;
    }
  },

  _drawPath: function () {
    var i, j, len, len2, point, drawMethod;

    this._ctx.beginPath();

    for (i = 0, len = this._parts.length; i < len; i++) {
      for (j = 0, len2 = this._parts[i].length; j < len2; j++) {
        point = this._parts[i][j];
        drawMethod = (j === 0 ? 'move' : 'line') + 'To';

        this._ctx[drawMethod](point.x, point.y);
      }
      // TODO refactor ugly hack
      if (this instanceof L.Polygon) {
        this._ctx.closePath();
      }
    }
  },

  _checkIfEmpty: function () {
    return !this._parts.length;
  },

  _updatePath: function () {
    if (this._checkIfEmpty()) { return; }

    var ctx = this._ctx,
        options = this.options;

    this._drawPath();
    ctx.save();
    this._updateStyle();

    if (options.fill) {
      ctx.globalAlpha = options.fillOpacity;
      ctx.fill();
    }

    if (options.stroke) {
      ctx.globalAlpha = options.opacity;
      ctx.stroke();
    }

    ctx.restore();

    // TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
  },

  _initEvents: function () {
    if (this.options.clickable) {
      // TODO dblclick
      this._map.on('mousemove', this._onMouseMove, this);
      this._map.on('click', this._onClick, this);
    }
  },

  _onClick: function (e) {
    if (this._containsPoint(e.layerPoint)) {
      this.fire('click', e);
    }
  },

  _onMouseMove: function (e) {
    if (!this._map || this._map._animatingZoom) { return; }

    // TODO don't do on each move
    if (this._containsPoint(e.layerPoint)) {
      this._ctx.canvas.style.cursor = 'pointer';
      this._mouseInside = true;
      this.fire('mouseover', e);

    } else if (this._mouseInside) {
      this._ctx.canvas.style.cursor = '';
      this._mouseInside = false;
      this.fire('mouseout', e);
    }
  }
});

L.Map.include((L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? {} : {
  _initPathRoot: function () {
    var root = this._pathRoot,
        ctx;

    if (!root) {
      root = this._pathRoot = document.createElement('canvas');
      root.style.position = 'absolute';
      ctx = this._canvasCtx = root.getContext('2d');

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      this._panes.overlayPane.appendChild(root);

      if (this.options.zoomAnimation) {
        this._pathRoot.className = 'leaflet-zoom-animated';
        this.on('zoomanim', this._animatePathZoom);
        this.on('zoomend', this._endPathZoom);
      }
      this.on('moveend', this._updateCanvasViewport);
      this._updateCanvasViewport();
    }
  },

  _updateCanvasViewport: function () {
    // don't redraw while zooming. See _updateSvgViewport for more details
    if (this._pathZooming) { return; }
    this._updatePathViewport();

    var vp = this._pathViewport,
        min = vp.min,
        size = vp.max.subtract(min),
        root = this._pathRoot;

    //TODO check if this works properly on mobile webkit
    L.DomUtil.setPosition(root, min);
    root.width = size.x;
    root.height = size.y;
    root.getContext('2d').translate(-min.x, -min.y);
  }
});


/*
 * L.LineUtil contains different utility functions for line segments
 * and polylines (clipping, simplification, distances, etc.)
 */

/*jshint bitwise:false */ // allow bitwise oprations for this file

L.LineUtil = {

  // Simplify polyline with vertex reduction and Douglas-Peucker simplification.
  // Improves rendering performance dramatically by lessening the number of points to draw.

  simplify: function (/*Point[]*/ points, /*Number*/ tolerance) {
    if (!tolerance || !points.length) {
      return points.slice();
    }

    var sqTolerance = tolerance * tolerance;

    // stage 1: vertex reduction
    points = this._reducePoints(points, sqTolerance);

    // stage 2: Douglas-Peucker simplification
    points = this._simplifyDP(points, sqTolerance);

    return points;
  },

  // distance from a point to a segment between two points
  pointToSegmentDistance:  function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
    return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
  },

  closestPointOnSegment: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
    return this._sqClosestPointOnSegment(p, p1, p2);
  },

  // Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
  _simplifyDP: function (points, sqTolerance) {

    var len = points.length,
        ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
        markers = new ArrayConstructor(len);

    markers[0] = markers[len - 1] = 1;

    this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

    var i,
        newPoints = [];

    for (i = 0; i < len; i++) {
      if (markers[i]) {
        newPoints.push(points[i]);
      }
    }

    return newPoints;
  },

  _simplifyDPStep: function (points, markers, sqTolerance, first, last) {

    var maxSqDist = 0,
        index, i, sqDist;

    for (i = first + 1; i <= last - 1; i++) {
      sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);

      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }

    if (maxSqDist > sqTolerance) {
      markers[index] = 1;

      this._simplifyDPStep(points, markers, sqTolerance, first, index);
      this._simplifyDPStep(points, markers, sqTolerance, index, last);
    }
  },

  // reduce points that are too close to each other to a single point
  _reducePoints: function (points, sqTolerance) {
    var reducedPoints = [points[0]];

    for (var i = 1, prev = 0, len = points.length; i < len; i++) {
      if (this._sqDist(points[i], points[prev]) > sqTolerance) {
        reducedPoints.push(points[i]);
        prev = i;
      }
    }
    if (prev < len - 1) {
      reducedPoints.push(points[len - 1]);
    }
    return reducedPoints;
  },

  // Cohen-Sutherland line clipping algorithm.
  // Used to avoid rendering parts of a polyline that are not currently visible.

  clipSegment: function (a, b, bounds, useLastCode) {
    var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
        codeB = this._getBitCode(b, bounds),

        codeOut, p, newCode;

    // save 2nd code to avoid calculating it on the next segment
    this._lastCode = codeB;

    while (true) {
      // if a,b is inside the clip window (trivial accept)
      if (!(codeA | codeB)) {
        return [a, b];
      // if a,b is outside the clip window (trivial reject)
      } else if (codeA & codeB) {
        return false;
      // other cases
      } else {
        codeOut = codeA || codeB;
        p = this._getEdgeIntersection(a, b, codeOut, bounds);
        newCode = this._getBitCode(p, bounds);

        if (codeOut === codeA) {
          a = p;
          codeA = newCode;
        } else {
          b = p;
          codeB = newCode;
        }
      }
    }
  },

  _getEdgeIntersection: function (a, b, code, bounds) {
    var dx = b.x - a.x,
        dy = b.y - a.y,
        min = bounds.min,
        max = bounds.max;

    if (code & 8) { // top
      return new L.Point(a.x + dx * (max.y - a.y) / dy, max.y);
    } else if (code & 4) { // bottom
      return new L.Point(a.x + dx * (min.y - a.y) / dy, min.y);
    } else if (code & 2) { // right
      return new L.Point(max.x, a.y + dy * (max.x - a.x) / dx);
    } else if (code & 1) { // left
      return new L.Point(min.x, a.y + dy * (min.x - a.x) / dx);
    }
  },

  _getBitCode: function (/*Point*/ p, bounds) {
    var code = 0;

    if (p.x < bounds.min.x) { // left
      code |= 1;
    } else if (p.x > bounds.max.x) { // right
      code |= 2;
    }
    if (p.y < bounds.min.y) { // bottom
      code |= 4;
    } else if (p.y > bounds.max.y) { // top
      code |= 8;
    }

    return code;
  },

  // square distance (to avoid unnecessary Math.sqrt calls)
  _sqDist: function (p1, p2) {
    var dx = p2.x - p1.x,
        dy = p2.y - p1.y;
    return dx * dx + dy * dy;
  },

  // return closest point on segment or distance to that point
  _sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y,
        dot = dx * dx + dy * dy,
        t;

    if (dot > 0) {
      t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

      if (t > 1) {
        x = p2.x;
        y = p2.y;
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }

    dx = p.x - x;
    dy = p.y - y;

    return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
  }
};


/*
 * L.Polyline is used to display polylines on a map.
 */

L.Polyline = L.Path.extend({
  initialize: function (latlngs, options) {
    L.Path.prototype.initialize.call(this, options);

    this._latlngs = this._convertLatLngs(latlngs);
  },

  options: {
    // how much to simplify the polyline on each zoom level
    // more = better performance and smoother look, less = more accurate
    smoothFactor: 1.0,
    noClip: false
  },

  projectLatlngs: function () {
    this._originalPoints = [];

    for (var i = 0, len = this._latlngs.length; i < len; i++) {
      this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
    }
  },

  getPathString: function () {
    for (var i = 0, len = this._parts.length, str = ''; i < len; i++) {
      str += this._getPathPartStr(this._parts[i]);
    }
    return str;
  },

  getLatLngs: function () {
    return this._latlngs;
  },

  setLatLngs: function (latlngs) {
    this._latlngs = this._convertLatLngs(latlngs);
    return this.redraw();
  },

  addLatLng: function (latlng) {
    this._latlngs.push(L.latLng(latlng));
    return this.redraw();
  },

  spliceLatLngs: function () { // (Number index, Number howMany)
    var removed = [].splice.apply(this._latlngs, arguments);
    this._convertLatLngs(this._latlngs, true);
    this.redraw();
    return removed;
  },

  closestLayerPoint: function (p) {
    var minDistance = Infinity, parts = this._parts, p1, p2, minPoint = null;

    for (var j = 0, jLen = parts.length; j < jLen; j++) {
      var points = parts[j];
      for (var i = 1, len = points.length; i < len; i++) {
        p1 = points[i - 1];
        p2 = points[i];
        var sqDist = L.LineUtil._sqClosestPointOnSegment(p, p1, p2, true);
        if (sqDist < minDistance) {
          minDistance = sqDist;
          minPoint = L.LineUtil._sqClosestPointOnSegment(p, p1, p2);
        }
      }
    }
    if (minPoint) {
      minPoint.distance = Math.sqrt(minDistance);
    }
    return minPoint;
  },

  getBounds: function () {
    return new L.LatLngBounds(this.getLatLngs());
  },

  _convertLatLngs: function (latlngs, overwrite) {
    var i, len, target = overwrite ? latlngs : [];

    for (i = 0, len = latlngs.length; i < len; i++) {
      if (L.Util.isArray(latlngs[i]) && typeof latlngs[i][0] !== 'number') {
        return;
      }
      target[i] = L.latLng(latlngs[i]);
    }
    return target;
  },

  _initEvents: function () {
    L.Path.prototype._initEvents.call(this);
  },

  _getPathPartStr: function (points) {
    var round = L.Path.VML;

    for (var j = 0, len2 = points.length, str = '', p; j < len2; j++) {
      p = points[j];
      if (round) {
        p._round();
      }
      str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
    }
    return str;
  },

  _clipPoints: function () {
    var points = this._originalPoints,
        len = points.length,
        i, k, segment;

    if (this.options.noClip) {
      this._parts = [points];
      return;
    }

    this._parts = [];

    var parts = this._parts,
        vp = this._map._pathViewport,
        lu = L.LineUtil;

    for (i = 0, k = 0; i < len - 1; i++) {
      segment = lu.clipSegment(points[i], points[i + 1], vp, i);
      if (!segment) {
        continue;
      }

      parts[k] = parts[k] || [];
      parts[k].push(segment[0]);

      // if segment goes out of screen, or it's the last one, it's the end of the line part
      if ((segment[1] !== points[i + 1]) || (i === len - 2)) {
        parts[k].push(segment[1]);
        k++;
      }
    }
  },

  // simplify each clipped part of the polyline
  _simplifyPoints: function () {
    var parts = this._parts,
        lu = L.LineUtil;

    for (var i = 0, len = parts.length; i < len; i++) {
      parts[i] = lu.simplify(parts[i], this.options.smoothFactor);
    }
  },

  _updatePath: function () {
    if (!this._map) { return; }

    this._clipPoints();
    this._simplifyPoints();

    L.Path.prototype._updatePath.call(this);
  }
});

L.polyline = function (latlngs, options) {
  return new L.Polyline(latlngs, options);
};


/*
 * L.PolyUtil contains utility functions for polygons (clipping, etc.).
 */

/*jshint bitwise:false */ // allow bitwise operations here

L.PolyUtil = {};

/*
 * Sutherland-Hodgeman polygon clipping algorithm.
 * Used to avoid rendering parts of a polygon that are not currently visible.
 */
L.PolyUtil.clipPolygon = function (points, bounds) {
  var clippedPoints,
      edges = [1, 4, 2, 8],
      i, j, k,
      a, b,
      len, edge, p,
      lu = L.LineUtil;

  for (i = 0, len = points.length; i < len; i++) {
    points[i]._code = lu._getBitCode(points[i], bounds);
  }

  // for each edge (left, bottom, right, top)
  for (k = 0; k < 4; k++) {
    edge = edges[k];
    clippedPoints = [];

    for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
      a = points[i];
      b = points[j];

      // if a is inside the clip window
      if (!(a._code & edge)) {
        // if b is outside the clip window (a->b goes out of screen)
        if (b._code & edge) {
          p = lu._getEdgeIntersection(b, a, edge, bounds);
          p._code = lu._getBitCode(p, bounds);
          clippedPoints.push(p);
        }
        clippedPoints.push(a);

      // else if b is inside the clip window (a->b enters the screen)
      } else if (!(b._code & edge)) {
        p = lu._getEdgeIntersection(b, a, edge, bounds);
        p._code = lu._getBitCode(p, bounds);
        clippedPoints.push(p);
      }
    }
    points = clippedPoints;
  }

  return points;
};


/*
 * L.Polygon is used to display polygons on a map.
 */

L.Polygon = L.Polyline.extend({
  options: {
    fill: true
  },

  initialize: function (latlngs, options) {
    var i, len, hole;

    L.Polyline.prototype.initialize.call(this, latlngs, options);

    if (latlngs && L.Util.isArray(latlngs[0]) && (typeof latlngs[0][0] !== 'number')) {
      this._latlngs = this._convertLatLngs(latlngs[0]);
      this._holes = latlngs.slice(1);

      for (i = 0, len = this._holes.length; i < len; i++) {
        hole = this._holes[i] = this._convertLatLngs(this._holes[i]);
        if (hole[0].equals(hole[hole.length - 1])) {
          hole.pop();
        }
      }
    }

    // filter out last point if its equal to the first one
    latlngs = this._latlngs;

    if (latlngs.length >= 2 && latlngs[0].equals(latlngs[latlngs.length - 1])) {
      latlngs.pop();
    }
  },

  projectLatlngs: function () {
    L.Polyline.prototype.projectLatlngs.call(this);

    // project polygon holes points
    // TODO move this logic to Polyline to get rid of duplication
    this._holePoints = [];

    if (!this._holes) { return; }

    var i, j, len, len2;

    for (i = 0, len = this._holes.length; i < len; i++) {
      this._holePoints[i] = [];

      for (j = 0, len2 = this._holes[i].length; j < len2; j++) {
        this._holePoints[i][j] = this._map.latLngToLayerPoint(this._holes[i][j]);
      }
    }
  },

  _clipPoints: function () {
    var points = this._originalPoints,
        newParts = [];

    this._parts = [points].concat(this._holePoints);

    if (this.options.noClip) { return; }

    for (var i = 0, len = this._parts.length; i < len; i++) {
      var clipped = L.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport);
      if (clipped.length) {
        newParts.push(clipped);
      }
    }

    this._parts = newParts;
  },

  _getPathPartStr: function (points) {
    var str = L.Polyline.prototype._getPathPartStr.call(this, points);
    return str + (L.Browser.svg ? 'z' : 'x');
  }
});

L.polygon = function (latlngs, options) {
  return new L.Polygon(latlngs, options);
};


/*
 * Contains L.MultiPolyline and L.MultiPolygon layers.
 */

(function () {
  function createMulti(Klass) {

    return L.FeatureGroup.extend({

      initialize: function (latlngs, options) {
        this._layers = {};
        this._options = options;
        this.setLatLngs(latlngs);
      },

      setLatLngs: function (latlngs) {
        var i = 0,
            len = latlngs.length;

        this.eachLayer(function (layer) {
          if (i < len) {
            layer.setLatLngs(latlngs[i++]);
          } else {
            this.removeLayer(layer);
          }
        }, this);

        while (i < len) {
          this.addLayer(new Klass(latlngs[i++], this._options));
        }

        return this;
      }
    });
  }

  L.MultiPolyline = createMulti(L.Polyline);
  L.MultiPolygon = createMulti(L.Polygon);

  L.multiPolyline = function (latlngs, options) {
    return new L.MultiPolyline(latlngs, options);
  };

  L.multiPolygon = function (latlngs, options) {
    return new L.MultiPolygon(latlngs, options);
  };
}());


/*
 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
 */

L.Rectangle = L.Polygon.extend({
  initialize: function (latLngBounds, options) {
    L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
  },

  setBounds: function (latLngBounds) {
    this.setLatLngs(this._boundsToLatLngs(latLngBounds));
  },

  _boundsToLatLngs: function (latLngBounds) {
    latLngBounds = L.latLngBounds(latLngBounds);
    return [
      latLngBounds.getSouthWest(),
      latLngBounds.getNorthWest(),
      latLngBounds.getNorthEast(),
      latLngBounds.getSouthEast()
    ];
  }
});

L.rectangle = function (latLngBounds, options) {
  return new L.Rectangle(latLngBounds, options);
};


/*
 * L.Circle is a circle overlay (with a certain radius in meters).
 */

L.Circle = L.Path.extend({
  initialize: function (latlng, radius, options) {
    L.Path.prototype.initialize.call(this, options);

    this._latlng = L.latLng(latlng);
    this._mRadius = radius;
  },

  options: {
    fill: true
  },

  setLatLng: function (latlng) {
    this._latlng = L.latLng(latlng);
    return this.redraw();
  },

  setRadius: function (radius) {
    this._mRadius = radius;
    return this.redraw();
  },

  projectLatlngs: function () {
    var lngRadius = this._getLngRadius(),
        latlng = this._latlng,
        pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]);

    this._point = this._map.latLngToLayerPoint(latlng);
    this._radius = Math.max(this._point.x - pointLeft.x, 1);
  },

  getBounds: function () {
    var lngRadius = this._getLngRadius(),
        latRadius = (this._mRadius / 40075017) * 360,
        latlng = this._latlng;

    return new L.LatLngBounds(
            [latlng.lat - latRadius, latlng.lng - lngRadius],
            [latlng.lat + latRadius, latlng.lng + lngRadius]);
  },

  getLatLng: function () {
    return this._latlng;
  },

  getPathString: function () {
    var p = this._point,
        r = this._radius;

    if (this._checkIfEmpty()) {
      return '';
    }

    if (L.Browser.svg) {
      return 'M' + p.x + ',' + (p.y - r) +
             'A' + r + ',' + r + ',0,1,1,' +
             (p.x - 0.1) + ',' + (p.y - r) + ' z';
    } else {
      p._round();
      r = Math.round(r);
      return 'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r + ' 0,' + (65535 * 360);
    }
  },

  getRadius: function () {
    return this._mRadius;
  },

  // TODO Earth hardcoded, move into projection code!

  _getLatRadius: function () {
    return (this._mRadius / 40075017) * 360;
  },

  _getLngRadius: function () {
    return this._getLatRadius() / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);
  },

  _checkIfEmpty: function () {
    if (!this._map) {
      return false;
    }
    var vp = this._map._pathViewport,
        r = this._radius,
        p = this._point;

    return p.x - r > vp.max.x || p.y - r > vp.max.y ||
           p.x + r < vp.min.x || p.y + r < vp.min.y;
  }
});

L.circle = function (latlng, radius, options) {
  return new L.Circle(latlng, radius, options);
};


/*
 * L.CircleMarker is a circle overlay with a permanent pixel radius.
 */

L.CircleMarker = L.Circle.extend({
  options: {
    radius: 10,
    weight: 2
  },

  initialize: function (latlng, options) {
    L.Circle.prototype.initialize.call(this, latlng, null, options);
    this._radius = this.options.radius;
  },

  projectLatlngs: function () {
    this._point = this._map.latLngToLayerPoint(this._latlng);
  },

  _updateStyle : function () {
    L.Circle.prototype._updateStyle.call(this);
    this.setRadius(this.options.radius);
  },

  setRadius: function (radius) {
    this.options.radius = this._radius = radius;
    return this.redraw();
  }
});

L.circleMarker = function (latlng, options) {
  return new L.CircleMarker(latlng, options);
};


/*
 * Extends L.Polyline to be able to manually detect clicks on Canvas-rendered polylines.
 */

L.Polyline.include(!L.Path.CANVAS ? {} : {
  _containsPoint: function (p, closed) {
    var i, j, k, len, len2, dist, part,
        w = this.options.weight / 2;

    if (L.Browser.touch) {
      w += 10; // polyline click tolerance on touch devices
    }

    for (i = 0, len = this._parts.length; i < len; i++) {
      part = this._parts[i];
      for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
        if (!closed && (j === 0)) {
          continue;
        }

        dist = L.LineUtil.pointToSegmentDistance(p, part[k], part[j]);

        if (dist <= w) {
          return true;
        }
      }
    }
    return false;
  }
});


/*
 * Extends L.Polygon to be able to manually detect clicks on Canvas-rendered polygons.
 */

L.Polygon.include(!L.Path.CANVAS ? {} : {
  _containsPoint: function (p) {
    var inside = false,
        part, p1, p2,
        i, j, k,
        len, len2;

    // TODO optimization: check if within bounds first

    if (L.Polyline.prototype._containsPoint.call(this, p, true)) {
      // click on polygon border
      return true;
    }

    // ray casting algorithm for detecting if point is in polygon

    for (i = 0, len = this._parts.length; i < len; i++) {
      part = this._parts[i];

      for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
        p1 = part[j];
        p2 = part[k];

        if (((p1.y > p.y) !== (p2.y > p.y)) &&
            (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
          inside = !inside;
        }
      }
    }

    return inside;
  }
});


/*
 * Extends L.Circle with Canvas-specific code.
 */

L.Circle.include(!L.Path.CANVAS ? {} : {
  _drawPath: function () {
    var p = this._point;
    this._ctx.beginPath();
    this._ctx.arc(p.x, p.y, this._radius, 0, Math.PI * 2, false);
  },

  _containsPoint: function (p) {
    var center = this._point,
        w2 = this.options.stroke ? this.options.weight / 2 : 0;

    return (p.distanceTo(center) <= this._radius + w2);
  }
});


/*
 * CircleMarker canvas specific drawing parts.
 */

L.CircleMarker.include(!L.Path.CANVAS ? {} : {
  _updateStyle: function () {
    L.Path.prototype._updateStyle.call(this);
  }
});


/*
 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
 */

L.GeoJSON = L.FeatureGroup.extend({

  initialize: function (geojson, options) {
    L.setOptions(this, options);

    this._layers = {};

    if (geojson) {
      this.addData(geojson);
    }
  },

  addData: function (geojson) {
    var features = L.Util.isArray(geojson) ? geojson : geojson.features,
        i, len;

    if (features) {
      for (i = 0, len = features.length; i < len; i++) {
        // Only add this if geometry or geometries are set and not null
        if (features[i].geometries || features[i].geometry || features[i].features) {
          this.addData(features[i]);
        }
      }
      return this;
    }

    var options = this.options;

    if (options.filter && !options.filter(geojson)) { return; }

    var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng);
    layer.feature = L.GeoJSON.asFeature(geojson);

    layer.defaultOptions = layer.options;
    this.resetStyle(layer);

    if (options.onEachFeature) {
      options.onEachFeature(geojson, layer);
    }

    return this.addLayer(layer);
  },

  resetStyle: function (layer) {
    var style = this.options.style;
    if (style) {
      // reset any custom styles
      L.Util.extend(layer.options, layer.defaultOptions);

      this._setLayerStyle(layer, style);
    }
  },

  setStyle: function (style) {
    this.eachLayer(function (layer) {
      this._setLayerStyle(layer, style);
    }, this);
  },

  _setLayerStyle: function (layer, style) {
    if (typeof style === 'function') {
      style = style(layer.feature);
    }
    if (layer.setStyle) {
      layer.setStyle(style);
    }
  }
});

L.extend(L.GeoJSON, {
  geometryToLayer: function (geojson, pointToLayer, coordsToLatLng) {
    var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
        coords = geometry.coordinates,
        layers = [],
        latlng, latlngs, i, len, layer;

    coordsToLatLng = coordsToLatLng || this.coordsToLatLng;

    switch (geometry.type) {
    case 'Point':
      latlng = coordsToLatLng(coords);
      return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);

    case 'MultiPoint':
      for (i = 0, len = coords.length; i < len; i++) {
        latlng = coordsToLatLng(coords[i]);
        layer = pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);
        layers.push(layer);
      }
      return new L.FeatureGroup(layers);

    case 'LineString':
      latlngs = this.coordsToLatLngs(coords, 0, coordsToLatLng);
      return new L.Polyline(latlngs);

    case 'Polygon':
      latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
      return new L.Polygon(latlngs);

    case 'MultiLineString':
      latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
      return new L.MultiPolyline(latlngs);

    case 'MultiPolygon':
      latlngs = this.coordsToLatLngs(coords, 2, coordsToLatLng);
      return new L.MultiPolygon(latlngs);

    case 'GeometryCollection':
      for (i = 0, len = geometry.geometries.length; i < len; i++) {

        layer = this.geometryToLayer({
          geometry: geometry.geometries[i],
          type: 'Feature',
          properties: geojson.properties
        }, pointToLayer, coordsToLatLng);

        layers.push(layer);
      }
      return new L.FeatureGroup(layers);

    default:
      throw new Error('Invalid GeoJSON object.');
    }
  },

  coordsToLatLng: function (coords) { // (Array[, Boolean]) -> LatLng
    return new L.LatLng(coords[1], coords[0]);
  },

  coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) { // (Array[, Number, Function]) -> Array
    var latlng, i, len,
        latlngs = [];

    for (i = 0, len = coords.length; i < len; i++) {
      latlng = levelsDeep ?
              this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
              (coordsToLatLng || this.coordsToLatLng)(coords[i]);

      latlngs.push(latlng);
    }

    return latlngs;
  },

  latLngToCoords: function (latLng) {
    return [latLng.lng, latLng.lat];
  },

  latLngsToCoords: function (latLngs) {
    var coords = [];

    for (var i = 0, len = latLngs.length; i < len; i++) {
      coords.push(L.GeoJSON.latLngToCoords(latLngs[i]));
    }

    return coords;
  },

  getFeature: function (layer, newGeometry) {
    return layer.feature ? L.extend({}, layer.feature, {geometry: newGeometry}) : L.GeoJSON.asFeature(newGeometry);
  },

  asFeature: function (geoJSON) {
    if (geoJSON.type === 'Feature') {
      return geoJSON;
    }

    return {
      type: 'Feature',
      properties: {},
      geometry: geoJSON
    };
  }
});

var PointToGeoJSON = {
  toGeoJSON: function () {
    return L.GeoJSON.getFeature(this, {
      type: 'Point',
      coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
    });
  }
};

L.Marker.include(PointToGeoJSON);
L.Circle.include(PointToGeoJSON);
L.CircleMarker.include(PointToGeoJSON);

L.Polyline.include({
  toGeoJSON: function () {
    return L.GeoJSON.getFeature(this, {
      type: 'LineString',
      coordinates: L.GeoJSON.latLngsToCoords(this.getLatLngs())
    });
  }
});

L.Polygon.include({
  toGeoJSON: function () {
    var coords = [L.GeoJSON.latLngsToCoords(this.getLatLngs())],
        i, len, hole;

    coords[0].push(coords[0][0]);

    if (this._holes) {
      for (i = 0, len = this._holes.length; i < len; i++) {
        hole = L.GeoJSON.latLngsToCoords(this._holes[i]);
        hole.push(hole[0]);
        coords.push(hole);
      }
    }

    return L.GeoJSON.getFeature(this, {
      type: 'Polygon',
      coordinates: coords
    });
  }
});

(function () {
  function includeMulti(Klass, type) {
    Klass.include({
      toGeoJSON: function () {
        var coords = [];

        this.eachLayer(function (layer) {
          coords.push(layer.toGeoJSON().geometry.coordinates);
        });

        return L.GeoJSON.getFeature(this, {
          type: type,
          coordinates: coords
        });
      }
    });
  }

  includeMulti(L.MultiPolyline, 'MultiLineString');
  includeMulti(L.MultiPolygon, 'MultiPolygon');
}());

L.LayerGroup.include({
  toGeoJSON: function () {
    var features = [];

    this.eachLayer(function (layer) {
      if (layer.toGeoJSON) {
        features.push(L.GeoJSON.asFeature(layer.toGeoJSON()));
      }
    });

    return {
      type: 'FeatureCollection',
      features: features
    };
  }
});

L.geoJson = function (geojson, options) {
  return new L.GeoJSON(geojson, options);
};


/*
 * L.DomEvent contains functions for working with DOM events.
 */

L.DomEvent = {
  /* inspired by John Resig, Dean Edwards and YUI addEvent implementations */
  addListener: function (obj, type, fn, context) { // (HTMLElement, String, Function[, Object])

    var id = L.stamp(fn),
        key = '_leaflet_' + type + id,
        handler, originalHandler, newType;

    if (obj[key]) { return this; }

    handler = function (e) {
      return fn.call(context || obj, e || L.DomEvent._getEvent());
    };

    if (L.Browser.msTouch && type.indexOf('touch') === 0) {
      return this.addMsTouchListener(obj, type, handler, id);
    }
    if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
      this.addDoubleTapListener(obj, handler, id);
    }

    if ('addEventListener' in obj) {

      if (type === 'mousewheel') {
        obj.addEventListener('DOMMouseScroll', handler, false);
        obj.addEventListener(type, handler, false);

      } else if ((type === 'mouseenter') || (type === 'mouseleave')) {

        originalHandler = handler;
        newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');

        handler = function (e) {
          if (!L.DomEvent._checkMouse(obj, e)) { return; }
          return originalHandler(e);
        };

        obj.addEventListener(newType, handler, false);

      } else if (type === 'click' && L.Browser.android) {
        originalHandler = handler;
        handler = function (e) {
          return L.DomEvent._filterClick(e, originalHandler);
        };

        obj.addEventListener(type, handler, false);
      } else {
        obj.addEventListener(type, handler, false);
      }

    } else if ('attachEvent' in obj) {
      obj.attachEvent('on' + type, handler);
    }

    obj[key] = handler;

    return this;
  },

  removeListener: function (obj, type, fn) {  // (HTMLElement, String, Function)

    var id = L.stamp(fn),
        key = '_leaflet_' + type + id,
        handler = obj[key];

    if (!handler) { return this; }

    if (L.Browser.msTouch && type.indexOf('touch') === 0) {
      this.removeMsTouchListener(obj, type, id);
    } else if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
      this.removeDoubleTapListener(obj, id);

    } else if ('removeEventListener' in obj) {

      if (type === 'mousewheel') {
        obj.removeEventListener('DOMMouseScroll', handler, false);
        obj.removeEventListener(type, handler, false);

      } else if ((type === 'mouseenter') || (type === 'mouseleave')) {
        obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
      } else {
        obj.removeEventListener(type, handler, false);
      }
    } else if ('detachEvent' in obj) {
      obj.detachEvent('on' + type, handler);
    }

    obj[key] = null;

    return this;
  },

  stopPropagation: function (e) {

    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    return this;
  },

  disableClickPropagation: function (el) {
    var stop = L.DomEvent.stopPropagation;

    for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
      L.DomEvent.addListener(el, L.Draggable.START[i], stop);
    }

    return L.DomEvent
      .addListener(el, 'click', L.DomEvent._fakeStop)
      .addListener(el, 'dblclick', stop);
  },

  preventDefault: function (e) {

    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
    return this;
  },

  stop: function (e) {
    return L.DomEvent.preventDefault(e).stopPropagation(e);
  },

  getMousePosition: function (e, container) {

    var body = document.body,
        docEl = document.documentElement,
        x = e.pageX ? e.pageX : e.clientX + body.scrollLeft + docEl.scrollLeft,
        y = e.pageY ? e.pageY : e.clientY + body.scrollTop + docEl.scrollTop,
        pos = new L.Point(x, y);

    return (container ? pos._subtract(L.DomUtil.getViewportOffset(container)) : pos);
  },

  getWheelDelta: function (e) {

    var delta = 0;

    if (e.wheelDelta) {
      delta = e.wheelDelta / 120;
    }
    if (e.detail) {
      delta = -e.detail / 3;
    }
    return delta;
  },

  _fakeStop: function stop(e) {
    // fakes stopPropagation by setting a special event flag checked in Map mouse events handler
    // jshint camelcase: false
    e._leaflet_stop = true;
  },

  // check if element really left/entered the event target (for mouseenter/mouseleave)
  _checkMouse: function (el, e) {

    var related = e.relatedTarget;

    if (!related) { return true; }

    try {
      while (related && (related !== el)) {
        related = related.parentNode;
      }
    } catch (err) {
      return false;
    }
    return (related !== el);
  },

  _getEvent: function () { // evil magic for IE
    /*jshint noarg:false */
    var e = window.event;
    if (!e) {
      var caller = arguments.callee.caller;
      while (caller) {
        e = caller['arguments'][0];
        if (e && window.Event === e.constructor) {
          break;
        }
        caller = caller.caller;
      }
    }
    return e;
  },

  // this is a horrible workaround for a bug in Android where a single touch triggers two click events
  _filterClick: function (e, handler) {
    var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
      elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);

    // are they closer together than 1000ms yet more than 100ms?
    // Android typically triggers them ~300ms apart while multiple listeners
    // on the same event should be triggered far faster;
    // or check if click is simulated on the element, and if it is, reject any non-simulated events

    if ((elapsed && elapsed > 100 && elapsed < 1000) || (e.target._simulatedClick && !e._simulated)) {
      L.DomEvent.stop(e);
      return;
    }
    L.DomEvent._lastClick = timeStamp;

    return handler(e);
  }
};

L.DomEvent.on = L.DomEvent.addListener;
L.DomEvent.off = L.DomEvent.removeListener;


/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Class.extend({
  includes: L.Mixin.Events,

  statics: {
    START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
    END: {
      mousedown: 'mouseup',
      touchstart: 'touchend',
      MSPointerDown: 'touchend'
    },
    MOVE: {
      mousedown: 'mousemove',
      touchstart: 'touchmove',
      MSPointerDown: 'touchmove'
    }
  },

  initialize: function (element, dragStartTarget) {
    this._element = element;
    this._dragStartTarget = dragStartTarget || element;
  },

  enable: function () {
    if (this._enabled) { return; }

    for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
      L.DomEvent.on(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
    }

    this._enabled = true;
  },

  disable: function () {
    if (!this._enabled) { return; }

    for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
      L.DomEvent.off(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
    }

    this._enabled = false;
    this._moved = false;
  },

  _onDown: function (e) {
    if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

    L.DomEvent
      .stopPropagation(e);

    if (L.Draggable._disabled) { return; }

    L.DomUtil.disableImageDrag();
    L.DomUtil.disableTextSelection();

    var first = e.touches ? e.touches[0] : e,
        el = first.target;

    // if touching a link, highlight it
    if (L.Browser.touch && el.tagName.toLowerCase() === 'a') {
      L.DomUtil.addClass(el, 'leaflet-active');
    }

    this._moved = false;

    if (this._moving) { return; }

    this._startPoint = new L.Point(first.clientX, first.clientY);
    this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

    L.DomEvent
        .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
        .on(document, L.Draggable.END[e.type], this._onUp, this);
  },

  _onMove: function (e) {
    if (e.touches && e.touches.length > 1) { return; }

    var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
        newPoint = new L.Point(first.clientX, first.clientY),
        offset = newPoint.subtract(this._startPoint);

    if (!offset.x && !offset.y) { return; }

    L.DomEvent.preventDefault(e);

    if (!this._moved) {
      this.fire('dragstart');

      this._moved = true;
      this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);

      if (!L.Browser.touch) {
        L.DomUtil.addClass(document.body, 'leaflet-dragging');
      }
    }

    this._newPos = this._startPos.add(offset);
    this._moving = true;

    L.Util.cancelAnimFrame(this._animRequest);
    this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
  },

  _updatePosition: function () {
    this.fire('predrag');
    L.DomUtil.setPosition(this._element, this._newPos);
    this.fire('drag');
  },

  _onUp: function () {
    if (!L.Browser.touch) {
      L.DomUtil.removeClass(document.body, 'leaflet-dragging');
    }

    for (var i in L.Draggable.MOVE) {
      L.DomEvent
          .off(document, L.Draggable.MOVE[i], this._onMove)
          .off(document, L.Draggable.END[i], this._onUp);
    }

    L.DomUtil.enableImageDrag();
    L.DomUtil.enableTextSelection();

    if (this._moved) {
      // ensure drag is not fired after dragend
      L.Util.cancelAnimFrame(this._animRequest);

      this.fire('dragend');
    }

    this._moving = false;
  }
});


/*
  L.Handler is a base class for handler classes that are used internally to inject
  interaction features like dragging to classes like Map and Marker.
*/

L.Handler = L.Class.extend({
  initialize: function (map) {
    this._map = map;
  },

  enable: function () {
    if (this._enabled) { return; }

    this._enabled = true;
    this.addHooks();
  },

  disable: function () {
    if (!this._enabled) { return; }

    this._enabled = false;
    this.removeHooks();
  },

  enabled: function () {
    return !!this._enabled;
  }
});


/*
 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
 */

L.Map.mergeOptions({
  dragging: true,

  inertia: !L.Browser.android23,
  inertiaDeceleration: 3400, // px/s^2
  inertiaMaxSpeed: Infinity, // px/s
  inertiaThreshold: L.Browser.touch ? 32 : 18, // ms
  easeLinearity: 0.25,

  // TODO refactor, move to CRS
  worldCopyJump: false
});

L.Map.Drag = L.Handler.extend({
  addHooks: function () {
    if (!this._draggable) {
      var map = this._map;

      this._draggable = new L.Draggable(map._mapPane, map._container);

      this._draggable.on({
        'dragstart': this._onDragStart,
        'drag': this._onDrag,
        'dragend': this._onDragEnd
      }, this);

      if (map.options.worldCopyJump) {
        this._draggable.on('predrag', this._onPreDrag, this);
        map.on('viewreset', this._onViewReset, this);
      }
    }
    this._draggable.enable();
  },

  removeHooks: function () {
    this._draggable.disable();
  },

  moved: function () {
    return this._draggable && this._draggable._moved;
  },

  _onDragStart: function () {
    var map = this._map;

    if (map._panAnim) {
      map._panAnim.stop();
    }

    map
        .fire('movestart')
        .fire('dragstart');

    if (map.options.inertia) {
      this._positions = [];
      this._times = [];
    }
  },

  _onDrag: function () {
    if (this._map.options.inertia) {
      var time = this._lastTime = +new Date(),
          pos = this._lastPos = this._draggable._newPos;

      this._positions.push(pos);
      this._times.push(time);

      if (time - this._times[0] > 200) {
        this._positions.shift();
        this._times.shift();
      }
    }

    this._map
        .fire('move')
        .fire('drag');
  },

  _onViewReset: function () {
    // TODO fix hardcoded Earth values
    var pxCenter = this._map.getSize()._divideBy(2),
        pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

    this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
    this._worldWidth = this._map.project([0, 180]).x;
  },

  _onPreDrag: function () {
    // TODO refactor to be able to adjust map pane position after zoom
    var worldWidth = this._worldWidth,
        halfWidth = Math.round(worldWidth / 2),
        dx = this._initialWorldOffset,
        x = this._draggable._newPos.x,
        newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
        newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
        newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

    this._draggable._newPos.x = newX;
  },

  _onDragEnd: function () {
    var map = this._map,
        options = map.options,
        delay = +new Date() - this._lastTime,

        noInertia = !options.inertia || delay > options.inertiaThreshold || !this._positions[0];

    map.fire('dragend');

    if (noInertia) {
      map.fire('moveend');

    } else {

      var direction = this._lastPos.subtract(this._positions[0]),
          duration = (this._lastTime + delay - this._times[0]) / 1000,
          ease = options.easeLinearity,

          speedVector = direction.multiplyBy(ease / duration),
          speed = speedVector.distanceTo([0, 0]),

          limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
          limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

          decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
          offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

      if (!offset.x || !offset.y) {
        map.fire('moveend');

      } else {
        L.Util.requestAnimFrame(function () {
          map.panBy(offset, {
            duration: decelerationDuration,
            easeLinearity: ease,
            noMoveStart: true
          });
        });
      }
    }
  }
});

L.Map.addInitHook('addHandler', 'dragging', L.Map.Drag);


/*
 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
 */

L.Map.mergeOptions({
  doubleClickZoom: true
});

L.Map.DoubleClickZoom = L.Handler.extend({
  addHooks: function () {
    this._map.on('dblclick', this._onDoubleClick);
  },

  removeHooks: function () {
    this._map.off('dblclick', this._onDoubleClick);
  },

  _onDoubleClick: function (e) {
    this.setZoomAround(e.containerPoint, this._zoom + 1);
  }
});

L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);


/*
 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
 */

L.Map.mergeOptions({
  scrollWheelZoom: true
});

L.Map.ScrollWheelZoom = L.Handler.extend({
  addHooks: function () {
    L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);
    L.DomEvent.on(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
    this._delta = 0;
  },

  removeHooks: function () {
    L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll);
    L.DomEvent.off(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
  },

  _onWheelScroll: function (e) {
    var delta = L.DomEvent.getWheelDelta(e);

    this._delta += delta;
    this._lastMousePos = this._map.mouseEventToContainerPoint(e);

    if (!this._startTime) {
      this._startTime = +new Date();
    }

    var left = Math.max(40 - (+new Date() - this._startTime), 0);

    clearTimeout(this._timer);
    this._timer = setTimeout(L.bind(this._performZoom, this), left);

    L.DomEvent.preventDefault(e);
    L.DomEvent.stopPropagation(e);
  },

  _performZoom: function () {
    var map = this._map,
        delta = this._delta,
        zoom = map.getZoom();

    delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
    delta = Math.max(Math.min(delta, 4), -4);
    delta = map._limitZoom(zoom + delta) - zoom;

    this._delta = 0;
    this._startTime = null;

    if (!delta) { return; }

    map.setZoomAround(this._lastMousePos, zoom + delta);
  }
});

L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);


/*
 * Extends the event handling code with double tap support for mobile browsers.
 */

L.extend(L.DomEvent, {

  _touchstart: L.Browser.msTouch ? 'MSPointerDown' : 'touchstart',
  _touchend: L.Browser.msTouch ? 'MSPointerUp' : 'touchend',

  // inspired by Zepto touch code by Thomas Fuchs
  addDoubleTapListener: function (obj, handler, id) {
    var last,
        doubleTap = false,
        delay = 250,
        touch,
        pre = '_leaflet_',
        touchstart = this._touchstart,
        touchend = this._touchend,
        trackedTouches = [];

    function onTouchStart(e) {
      var count;

      if (L.Browser.msTouch) {
        trackedTouches.push(e.pointerId);
        count = trackedTouches.length;
      } else {
        count = e.touches.length;
      }
      if (count > 1) {
        return;
      }

      var now = Date.now(),
        delta = now - (last || now);

      touch = e.touches ? e.touches[0] : e;
      doubleTap = (delta > 0 && delta <= delay);
      last = now;
    }

    function onTouchEnd(e) {
      if (L.Browser.msTouch) {
        var idx = trackedTouches.indexOf(e.pointerId);
        if (idx === -1) {
          return;
        }
        trackedTouches.splice(idx, 1);
      }

      if (doubleTap) {
        if (L.Browser.msTouch) {
          // work around .type being readonly with MSPointer* events
          var newTouch = { },
            prop;

          // jshint forin:false
          for (var i in touch) {
            prop = touch[i];
            if (typeof prop === 'function') {
              newTouch[i] = prop.bind(touch);
            } else {
              newTouch[i] = prop;
            }
          }
          touch = newTouch;
        }
        touch.type = 'dblclick';
        handler(touch);
        last = null;
      }
    }
    obj[pre + touchstart + id] = onTouchStart;
    obj[pre + touchend + id] = onTouchEnd;

    // on msTouch we need to listen on the document, otherwise a drag starting on the map and moving off screen
    // will not come through to us, so we will lose track of how many touches are ongoing
    var endElement = L.Browser.msTouch ? document.documentElement : obj;

    obj.addEventListener(touchstart, onTouchStart, false);
    endElement.addEventListener(touchend, onTouchEnd, false);

    if (L.Browser.msTouch) {
      endElement.addEventListener('MSPointerCancel', onTouchEnd, false);
    }

    return this;
  },

  removeDoubleTapListener: function (obj, id) {
    var pre = '_leaflet_';

    obj.removeEventListener(this._touchstart, obj[pre + this._touchstart + id], false);
    (L.Browser.msTouch ? document.documentElement : obj).removeEventListener(
            this._touchend, obj[pre + this._touchend + id], false);

    if (L.Browser.msTouch) {
      document.documentElement.removeEventListener('MSPointerCancel', obj[pre + this._touchend + id], false);
    }

    return this;
  }
});


/*
 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
 */

L.extend(L.DomEvent, {

  _msTouches: [],
  _msDocumentListener: false,

  // Provides a touch events wrapper for msPointer events.
  // Based on changes by veproza https://github.com/CloudMade/Leaflet/pull/1019

  addMsTouchListener: function (obj, type, handler, id) {

    switch (type) {
    case 'touchstart':
      return this.addMsTouchListenerStart(obj, type, handler, id);
    case 'touchend':
      return this.addMsTouchListenerEnd(obj, type, handler, id);
    case 'touchmove':
      return this.addMsTouchListenerMove(obj, type, handler, id);
    default:
      throw 'Unknown touch event type';
    }
  },

  addMsTouchListenerStart: function (obj, type, handler, id) {
    var pre = '_leaflet_',
        touches = this._msTouches;

    var cb = function (e) {

      var alreadyInArray = false;
      for (var i = 0; i < touches.length; i++) {
        if (touches[i].pointerId === e.pointerId) {
          alreadyInArray = true;
          break;
        }
      }
      if (!alreadyInArray) {
        touches.push(e);
      }

      e.touches = touches.slice();
      e.changedTouches = [e];

      handler(e);
    };

    obj[pre + 'touchstart' + id] = cb;
    obj.addEventListener('MSPointerDown', cb, false);

    // need to also listen for end events to keep the _msTouches list accurate
    // this needs to be on the body and never go away
    if (!this._msDocumentListener) {
      var internalCb = function (e) {
        for (var i = 0; i < touches.length; i++) {
          if (touches[i].pointerId === e.pointerId) {
            touches.splice(i, 1);
            break;
          }
        }
      };
      //We listen on the documentElement as any drags that end by moving the touch off the screen get fired there
      document.documentElement.addEventListener('MSPointerUp', internalCb, false);
      document.documentElement.addEventListener('MSPointerCancel', internalCb, false);

      this._msDocumentListener = true;
    }

    return this;
  },

  addMsTouchListenerMove: function (obj, type, handler, id) {
    var pre = '_leaflet_',
        touches = this._msTouches;

    function cb(e) {

      // don't fire touch moves when mouse isn't down
      if (e.pointerType === e.MSPOINTER_TYPE_MOUSE && e.buttons === 0) { return; }

      for (var i = 0; i < touches.length; i++) {
        if (touches[i].pointerId === e.pointerId) {
          touches[i] = e;
          break;
        }
      }

      e.touches = touches.slice();
      e.changedTouches = [e];

      handler(e);
    }

    obj[pre + 'touchmove' + id] = cb;
    obj.addEventListener('MSPointerMove', cb, false);

    return this;
  },

  addMsTouchListenerEnd: function (obj, type, handler, id) {
    var pre = '_leaflet_',
        touches = this._msTouches;

    var cb = function (e) {
      for (var i = 0; i < touches.length; i++) {
        if (touches[i].pointerId === e.pointerId) {
          touches.splice(i, 1);
          break;
        }
      }

      e.touches = touches.slice();
      e.changedTouches = [e];

      handler(e);
    };

    obj[pre + 'touchend' + id] = cb;
    obj.addEventListener('MSPointerUp', cb, false);
    obj.addEventListener('MSPointerCancel', cb, false);

    return this;
  },

  removeMsTouchListener: function (obj, type, id) {
    var pre = '_leaflet_',
        cb = obj[pre + type + id];

    switch (type) {
    case 'touchstart':
      obj.removeEventListener('MSPointerDown', cb, false);
      break;
    case 'touchmove':
      obj.removeEventListener('MSPointerMove', cb, false);
      break;
    case 'touchend':
      obj.removeEventListener('MSPointerUp', cb, false);
      obj.removeEventListener('MSPointerCancel', cb, false);
      break;
    }

    return this;
  }
});


/*
 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
 */

L.Map.mergeOptions({
  touchZoom: L.Browser.touch && !L.Browser.android23
});

L.Map.TouchZoom = L.Handler.extend({
  addHooks: function () {
    L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
  },

  removeHooks: function () {
    L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
  },

  _onTouchStart: function (e) {
    var map = this._map;

    if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

    var p1 = map.mouseEventToLayerPoint(e.touches[0]),
        p2 = map.mouseEventToLayerPoint(e.touches[1]),
        viewCenter = map._getCenterLayerPoint();

    this._startCenter = p1.add(p2)._divideBy(2);
    this._startDist = p1.distanceTo(p2);

    this._moved = false;
    this._zooming = true;

    this._centerOffset = viewCenter.subtract(this._startCenter);

    if (map._panAnim) {
      map._panAnim.stop();
    }

    L.DomEvent
        .on(document, 'touchmove', this._onTouchMove, this)
        .on(document, 'touchend', this._onTouchEnd, this);

    L.DomEvent.preventDefault(e);
  },

  _onTouchMove: function (e) {
    var map = this._map;

    if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

    var p1 = map.mouseEventToLayerPoint(e.touches[0]),
        p2 = map.mouseEventToLayerPoint(e.touches[1]);

    this._scale = p1.distanceTo(p2) / this._startDist;
    this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter);

    if (this._scale === 1) { return; }

    if (!this._moved) {
      L.DomUtil.addClass(map._mapPane, 'leaflet-touching');

      map
          .fire('movestart')
          .fire('zoomstart');

      this._moved = true;
    }

    L.Util.cancelAnimFrame(this._animRequest);
    this._animRequest = L.Util.requestAnimFrame(
            this._updateOnMove, this, true, this._map._container);

    L.DomEvent.preventDefault(e);
  },

  _updateOnMove: function () {
    var map = this._map,
        origin = this._getScaleOrigin(),
        center = map.layerPointToLatLng(origin),
        zoom = map.getScaleZoom(this._scale);

    map._animateZoom(center, zoom, this._startCenter, this._scale, this._delta);
  },

  _onTouchEnd: function () {
    if (!this._moved || !this._zooming) {
      this._zooming = false;
      return;
    }

    var map = this._map;

    this._zooming = false;
    L.DomUtil.removeClass(map._mapPane, 'leaflet-touching');
    L.Util.cancelAnimFrame(this._animRequest);

    L.DomEvent
        .off(document, 'touchmove', this._onTouchMove)
        .off(document, 'touchend', this._onTouchEnd);

    var origin = this._getScaleOrigin(),
        center = map.layerPointToLatLng(origin),

        oldZoom = map.getZoom(),
        floatZoomDelta = map.getScaleZoom(this._scale) - oldZoom,
        roundZoomDelta = (floatZoomDelta > 0 ?
                Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta)),

        zoom = map._limitZoom(oldZoom + roundZoomDelta),
        scale = map.getZoomScale(zoom) / this._scale;

    map._animateZoom(center, zoom, origin, scale);
  },

  _getScaleOrigin: function () {
    var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale);
    return this._startCenter.add(centerOffset);
  }
});

L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);


/*
 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
 */

L.Map.mergeOptions({
  tap: true,
  tapTolerance: 15
});

L.Map.Tap = L.Handler.extend({
  addHooks: function () {
    L.DomEvent.on(this._map._container, 'touchstart', this._onDown, this);
  },

  removeHooks: function () {
    L.DomEvent.off(this._map._container, 'touchstart', this._onDown, this);
  },

  _onDown: function (e) {
    if (!e.touches) { return; }

    L.DomEvent.preventDefault(e);

    this._fireClick = true;

    // don't simulate click or track longpress if more than 1 touch
    if (e.touches.length > 1) {
      this._fireClick = false;
      clearTimeout(this._holdTimeout);
      return;
    }

    var first = e.touches[0],
        el = first.target;

    this._startPos = this._newPos = new L.Point(first.clientX, first.clientY);

    // if touching a link, highlight it
    if (el.tagName.toLowerCase() === 'a') {
      L.DomUtil.addClass(el, 'leaflet-active');
    }

    // simulate long hold but setting a timeout
    this._holdTimeout = setTimeout(L.bind(function () {
      if (this._isTapValid()) {
        this._fireClick = false;
        this._onUp();
        this._simulateEvent('contextmenu', first);
      }
    }, this), 1000);

    L.DomEvent
      .on(document, 'touchmove', this._onMove, this)
      .on(document, 'touchend', this._onUp, this);
  },

  _onUp: function (e) {
    clearTimeout(this._holdTimeout);

    L.DomEvent
      .off(document, 'touchmove', this._onMove, this)
      .off(document, 'touchend', this._onUp, this);

    if (this._fireClick && e && e.changedTouches) {

      var first = e.changedTouches[0],
          el = first.target;

      if (el.tagName.toLowerCase() === 'a') {
        L.DomUtil.removeClass(el, 'leaflet-active');
      }

      // simulate click if the touch didn't move too much
      if (this._isTapValid()) {
        this._simulateEvent('click', first);
      }
    }
  },

  _isTapValid: function () {
    return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
  },

  _onMove: function (e) {
    var first = e.touches[0];
    this._newPos = new L.Point(first.clientX, first.clientY);
  },

  _simulateEvent: function (type, e) {
    var simulatedEvent = document.createEvent('MouseEvents');

    simulatedEvent._simulated = true;
    e.target._simulatedClick = true;

    simulatedEvent.initMouseEvent(
            type, true, true, window, 1,
            e.screenX, e.screenY,
            e.clientX, e.clientY,
            false, false, false, false, 0, null);

    e.target.dispatchEvent(simulatedEvent);
  }
});

if (L.Browser.touch && !L.Browser.msTouch) {
  L.Map.addInitHook('addHandler', 'tap', L.Map.Tap);
}


/*
 * L.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
  * (zoom to a selected bounding box), enabled by default.
 */

L.Map.mergeOptions({
  boxZoom: true
});

L.Map.BoxZoom = L.Handler.extend({
  initialize: function (map) {
    this._map = map;
    this._container = map._container;
    this._pane = map._panes.overlayPane;
  },

  addHooks: function () {
    L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
  },

  removeHooks: function () {
    L.DomEvent.off(this._container, 'mousedown', this._onMouseDown);
  },

  _onMouseDown: function (e) {
    if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

    L.DomUtil.disableTextSelection();
    L.DomUtil.disableImageDrag();

    this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

    this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
    L.DomUtil.setPosition(this._box, this._startLayerPoint);

    //TODO refactor: move cursor to styles
    this._container.style.cursor = 'crosshair';

    L.DomEvent
        .on(document, 'mousemove', this._onMouseMove, this)
        .on(document, 'mouseup', this._onMouseUp, this)
        .on(document, 'keydown', this._onKeyDown, this);

    this._map.fire('boxzoomstart');
  },

  _onMouseMove: function (e) {
    var startPoint = this._startLayerPoint,
        box = this._box,

        layerPoint = this._map.mouseEventToLayerPoint(e),
        offset = layerPoint.subtract(startPoint),

        newPos = new L.Point(
            Math.min(layerPoint.x, startPoint.x),
            Math.min(layerPoint.y, startPoint.y));

    L.DomUtil.setPosition(box, newPos);

    // TODO refactor: remove hardcoded 4 pixels
    box.style.width  = (Math.max(0, Math.abs(offset.x) - 4)) + 'px';
    box.style.height = (Math.max(0, Math.abs(offset.y) - 4)) + 'px';
  },

  _finish: function () {
    this._pane.removeChild(this._box);
    this._container.style.cursor = '';

    L.DomUtil.enableTextSelection();
    L.DomUtil.enableImageDrag();

    L.DomEvent
        .off(document, 'mousemove', this._onMouseMove)
        .off(document, 'mouseup', this._onMouseUp)
        .off(document, 'keydown', this._onKeyDown);
  },

  _onMouseUp: function (e) {

    this._finish();

    var map = this._map,
        layerPoint = map.mouseEventToLayerPoint(e);

    if (this._startLayerPoint.equals(layerPoint)) { return; }

    var bounds = new L.LatLngBounds(
            map.layerPointToLatLng(this._startLayerPoint),
            map.layerPointToLatLng(layerPoint));

    map.fitBounds(bounds);

    map.fire('boxzoomend', {
      boxZoomBounds: bounds
    });
  },

  _onKeyDown: function (e) {
    if (e.keyCode === 27) {
      this._finish();
    }
  }
});

L.Map.addInitHook('addHandler', 'boxZoom', L.Map.BoxZoom);


/*
 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
 */

L.Map.mergeOptions({
  keyboard: true,
  keyboardPanOffset: 80,
  keyboardZoomOffset: 1
});

L.Map.Keyboard = L.Handler.extend({

  keyCodes: {
    left:    [37],
    right:   [39],
    down:    [40],
    up:      [38],
    zoomIn:  [187, 107, 61],
    zoomOut: [189, 109, 173]
  },

  initialize: function (map) {
    this._map = map;

    this._setPanOffset(map.options.keyboardPanOffset);
    this._setZoomOffset(map.options.keyboardZoomOffset);
  },

  addHooks: function () {
    var container = this._map._container;

    // make the container focusable by tabbing
    if (container.tabIndex === -1) {
      container.tabIndex = '0';
    }

    L.DomEvent
        .on(container, 'focus', this._onFocus, this)
        .on(container, 'blur', this._onBlur, this)
        .on(container, 'mousedown', this._onMouseDown, this);

    this._map
        .on('focus', this._addHooks, this)
        .on('blur', this._removeHooks, this);
  },

  removeHooks: function () {
    this._removeHooks();

    var container = this._map._container;

    L.DomEvent
        .off(container, 'focus', this._onFocus, this)
        .off(container, 'blur', this._onBlur, this)
        .off(container, 'mousedown', this._onMouseDown, this);

    this._map
        .off('focus', this._addHooks, this)
        .off('blur', this._removeHooks, this);
  },

  _onMouseDown: function () {
    if (this._focused) { return; }

    var body = document.body,
        docEl = document.documentElement,
        top = body.scrollTop || docEl.scrollTop,
        left = body.scrollTop || docEl.scrollLeft;

    this._map._container.focus();

    window.scrollTo(left, top);
  },

  _onFocus: function () {
    this._focused = true;
    this._map.fire('focus');
  },

  _onBlur: function () {
    this._focused = false;
    this._map.fire('blur');
  },

  _setPanOffset: function (pan) {
    var keys = this._panKeys = {},
        codes = this.keyCodes,
        i, len;

    for (i = 0, len = codes.left.length; i < len; i++) {
      keys[codes.left[i]] = [-1 * pan, 0];
    }
    for (i = 0, len = codes.right.length; i < len; i++) {
      keys[codes.right[i]] = [pan, 0];
    }
    for (i = 0, len = codes.down.length; i < len; i++) {
      keys[codes.down[i]] = [0, pan];
    }
    for (i = 0, len = codes.up.length; i < len; i++) {
      keys[codes.up[i]] = [0, -1 * pan];
    }
  },

  _setZoomOffset: function (zoom) {
    var keys = this._zoomKeys = {},
        codes = this.keyCodes,
        i, len;

    for (i = 0, len = codes.zoomIn.length; i < len; i++) {
      keys[codes.zoomIn[i]] = zoom;
    }
    for (i = 0, len = codes.zoomOut.length; i < len; i++) {
      keys[codes.zoomOut[i]] = -zoom;
    }
  },

  _addHooks: function () {
    L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
  },

  _removeHooks: function () {
    L.DomEvent.off(document, 'keydown', this._onKeyDown, this);
  },

  _onKeyDown: function (e) {
    var key = e.keyCode,
        map = this._map;

    if (key in this._panKeys) {

      if (map._panAnim && map._panAnim._inProgress) { return; }

      map.panBy(this._panKeys[key]);

      if (map.options.maxBounds) {
        map.panInsideBounds(map.options.maxBounds);
      }

    } else if (key in this._zoomKeys) {
      map.setZoom(map.getZoom() + this._zoomKeys[key]);

    } else {
      return;
    }

    L.DomEvent.stop(e);
  }
});

L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);


/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */

L.Handler.MarkerDrag = L.Handler.extend({
  initialize: function (marker) {
    this._marker = marker;
  },

  addHooks: function () {
    var icon = this._marker._icon;
    if (!this._draggable) {
      this._draggable = new L.Draggable(icon, icon);
    }

    this._draggable
      .on('dragstart', this._onDragStart, this)
      .on('drag', this._onDrag, this)
      .on('dragend', this._onDragEnd, this);
    this._draggable.enable();
  },

  removeHooks: function () {
    this._draggable
      .off('dragstart', this._onDragStart, this)
      .off('drag', this._onDrag, this)
      .off('dragend', this._onDragEnd, this);

    this._draggable.disable();
  },

  moved: function () {
    return this._draggable && this._draggable._moved;
  },

  _onDragStart: function () {
    this._marker
        .closePopup()
        .fire('movestart')
        .fire('dragstart');
  },

  _onDrag: function () {
    var marker = this._marker,
        shadow = marker._shadow,
        iconPos = L.DomUtil.getPosition(marker._icon),
        latlng = marker._map.layerPointToLatLng(iconPos);

    // update shadow position
    if (shadow) {
      L.DomUtil.setPosition(shadow, iconPos);
    }

    marker._latlng = latlng;

    marker
        .fire('move', {latlng: latlng})
        .fire('drag');
  },

  _onDragEnd: function () {
    this._marker
        .fire('moveend')
        .fire('dragend');
  }
});


/*
 * L.Control is a base class for implementing map controls. Handles positioning.
 * All other controls extend from this class.
 */

L.Control = L.Class.extend({
  options: {
    position: 'topright'
  },

  initialize: function (options) {
    L.setOptions(this, options);
  },

  getPosition: function () {
    return this.options.position;
  },

  setPosition: function (position) {
    var map = this._map;

    if (map) {
      map.removeControl(this);
    }

    this.options.position = position;

    if (map) {
      map.addControl(this);
    }

    return this;
  },

  getContainer: function () {
    return this._container;
  },

  addTo: function (map) {
    this._map = map;

    var container = this._container = this.onAdd(map),
        pos = this.getPosition(),
        corner = map._controlCorners[pos];

    L.DomUtil.addClass(container, 'leaflet-control');

    if (pos.indexOf('bottom') !== -1) {
      corner.insertBefore(container, corner.firstChild);
    } else {
      corner.appendChild(container);
    }

    return this;
  },

  removeFrom: function (map) {
    var pos = this.getPosition(),
        corner = map._controlCorners[pos];

    corner.removeChild(this._container);
    this._map = null;

    if (this.onRemove) {
      this.onRemove(map);
    }

    return this;
  }
});

L.control = function (options) {
  return new L.Control(options);
};


// adds control-related methods to L.Map

L.Map.include({
  addControl: function (control) {
    control.addTo(this);
    return this;
  },

  removeControl: function (control) {
    control.removeFrom(this);
    return this;
  },

  _initControlPos: function () {
    var corners = this._controlCorners = {},
        l = 'leaflet-',
        container = this._controlContainer =
                L.DomUtil.create('div', l + 'control-container', this._container);

    function createCorner(vSide, hSide) {
      var className = l + vSide + ' ' + l + hSide;

      corners[vSide + hSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('top', 'left');
    createCorner('top', 'right');
    createCorner('bottom', 'left');
    createCorner('bottom', 'right');
  },

  _clearControlPos: function () {
    this._container.removeChild(this._controlContainer);
  }
});


/*
 * L.Control.Zoom is used for the default zoom buttons on the map.
 */

L.Control.Zoom = L.Control.extend({
  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    var zoomName = 'leaflet-control-zoom',
        container = L.DomUtil.create('div', zoomName + ' leaflet-bar');

    this._map = map;

    this._zoomInButton  = this._createButton(
            '+', 'Zoom in',  zoomName + '-in',  container, this._zoomIn,  this);
    this._zoomOutButton = this._createButton(
            '-', 'Zoom out', zoomName + '-out', container, this._zoomOut, this);

    map.on('zoomend zoomlevelschange', this._updateDisabled, this);

    return container;
  },

  onRemove: function (map) {
    map.off('zoomend zoomlevelschange', this._updateDisabled, this);
  },

  _zoomIn: function (e) {
    this._map.zoomIn(e.shiftKey ? 3 : 1);
  },

  _zoomOut: function (e) {
    this._map.zoomOut(e.shiftKey ? 3 : 1);
  },

  _createButton: function (html, title, className, container, fn, context) {
    var link = L.DomUtil.create('a', className, container);
    link.innerHTML = html;
    link.href = '#';
    link.title = title;

    var stop = L.DomEvent.stopPropagation;

    L.DomEvent
        .on(link, 'click', stop)
        .on(link, 'mousedown', stop)
        .on(link, 'dblclick', stop)
        .on(link, 'click', L.DomEvent.preventDefault)
        .on(link, 'click', fn, context);

    return link;
  },

  _updateDisabled: function () {
    var map = this._map,
      className = 'leaflet-disabled';

    L.DomUtil.removeClass(this._zoomInButton, className);
    L.DomUtil.removeClass(this._zoomOutButton, className);

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomOutButton, className);
    }
    if (map._zoom === map.getMaxZoom()) {
      L.DomUtil.addClass(this._zoomInButton, className);
    }
  }
});

L.Map.mergeOptions({
  zoomControl: true
});

L.Map.addInitHook(function () {
  if (this.options.zoomControl) {
    this.zoomControl = new L.Control.Zoom();
    this.addControl(this.zoomControl);
  }
});

L.control.zoom = function (options) {
  return new L.Control.Zoom(options);
};



/*
 * L.Control.Attribution is used for displaying attribution on the map (added by default).
 */

L.Control.Attribution = L.Control.extend({
  options: {
    position: 'bottomright',
    prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
  },

  initialize: function (options) {
    L.setOptions(this, options);

    this._attributions = {};
  },

  onAdd: function (map) {
    this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
    L.DomEvent.disableClickPropagation(this._container);

    map
        .on('layeradd', this._onLayerAdd, this)
        .on('layerremove', this._onLayerRemove, this);

    this._update();

    return this._container;
  },

  onRemove: function (map) {
    map
        .off('layeradd', this._onLayerAdd)
        .off('layerremove', this._onLayerRemove);

  },

  setPrefix: function (prefix) {
    this.options.prefix = prefix;
    this._update();
    return this;
  },

  addAttribution: function (text) {
    if (!text) { return; }

    if (!this._attributions[text]) {
      this._attributions[text] = 0;
    }
    this._attributions[text]++;

    this._update();

    return this;
  },

  removeAttribution: function (text) {
    if (!text) { return; }

    if (this._attributions[text]) {
      this._attributions[text]--;
      this._update();
    }

    return this;
  },

  _update: function () {
    if (!this._map) { return; }

    var attribs = [];

    for (var i in this._attributions) {
      if (this._attributions[i]) {
        attribs.push(i);
      }
    }

    var prefixAndAttribs = [];

    if (this.options.prefix) {
      prefixAndAttribs.push(this.options.prefix);
    }
    if (attribs.length) {
      prefixAndAttribs.push(attribs.join(', '));
    }

    this._container.innerHTML = prefixAndAttribs.join(' | ');
  },

  _onLayerAdd: function (e) {
    if (e.layer.getAttribution) {
      this.addAttribution(e.layer.getAttribution());
    }
  },

  _onLayerRemove: function (e) {
    if (e.layer.getAttribution) {
      this.removeAttribution(e.layer.getAttribution());
    }
  }
});

L.Map.mergeOptions({
  attributionControl: true
});

L.Map.addInitHook(function () {
  if (this.options.attributionControl) {
    this.attributionControl = (new L.Control.Attribution()).addTo(this);
  }
});

L.control.attribution = function (options) {
  return new L.Control.Attribution(options);
};


/*
 * L.Control.Scale is used for displaying metric/imperial scale on the map.
 */

L.Control.Scale = L.Control.extend({
  options: {
    position: 'bottomleft',
    maxWidth: 100,
    metric: true,
    imperial: true,
    updateWhenIdle: false
  },

  onAdd: function (map) {
    this._map = map;

    var className = 'leaflet-control-scale',
        container = L.DomUtil.create('div', className),
        options = this.options;

    this._addScales(options, className, container);

    map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
    map.whenReady(this._update, this);

    return container;
  },

  onRemove: function (map) {
    map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
  },

  _addScales: function (options, className, container) {
    if (options.metric) {
      this._mScale = L.DomUtil.create('div', className + '-line', container);
    }
    if (options.imperial) {
      this._iScale = L.DomUtil.create('div', className + '-line', container);
    }
  },

  _update: function () {
    var bounds = this._map.getBounds(),
        centerLat = bounds.getCenter().lat,
        halfWorldMeters = 6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180),
        dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,

        size = this._map.getSize(),
        options = this.options,
        maxMeters = 0;

    if (size.x > 0) {
      maxMeters = dist * (options.maxWidth / size.x);
    }

    this._updateScales(options, maxMeters);
  },

  _updateScales: function (options, maxMeters) {
    if (options.metric && maxMeters) {
      this._updateMetric(maxMeters);
    }

    if (options.imperial && maxMeters) {
      this._updateImperial(maxMeters);
    }
  },

  _updateMetric: function (maxMeters) {
    var meters = this._getRoundNum(maxMeters);

    this._mScale.style.width = this._getScaleWidth(meters / maxMeters) + 'px';
    this._mScale.innerHTML = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
  },

  _updateImperial: function (maxMeters) {
    var maxFeet = maxMeters * 3.2808399,
        scale = this._iScale,
        maxMiles, miles, feet;

    if (maxFeet > 5280) {
      maxMiles = maxFeet / 5280;
      miles = this._getRoundNum(maxMiles);

      scale.style.width = this._getScaleWidth(miles / maxMiles) + 'px';
      scale.innerHTML = miles + ' mi';

    } else {
      feet = this._getRoundNum(maxFeet);

      scale.style.width = this._getScaleWidth(feet / maxFeet) + 'px';
      scale.innerHTML = feet + ' ft';
    }
  },

  _getScaleWidth: function (ratio) {
    return Math.round(this.options.maxWidth * ratio) - 10;
  },

  _getRoundNum: function (num) {
    var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
        d = num / pow10;

    d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

    return pow10 * d;
  }
});

L.control.scale = function (options) {
  return new L.Control.Scale(options);
};


/*
 * L.Control.Layers is a control to allow users to switch between different layers on the map.
 */

L.Control.Layers = L.Control.extend({
  options: {
    collapsed: true,
    position: 'topright',
    autoZIndex: true
  },

  initialize: function (baseLayers, overlays, options) {
    L.setOptions(this, options);

    this._layers = {};
    this._lastZIndex = 0;
    this._handlingClick = false;

    for (var i in baseLayers) {
      this._addLayer(baseLayers[i], i);
    }

    for (i in overlays) {
      this._addLayer(overlays[i], i, true);
    }
  },

  onAdd: function (map) {
    this._initLayout();
    this._update();

    map
        .on('layeradd', this._onLayerChange, this)
        .on('layerremove', this._onLayerChange, this);

    return this._container;
  },

  onRemove: function (map) {
    map
        .off('layeradd', this._onLayerChange)
        .off('layerremove', this._onLayerChange);
  },

  addBaseLayer: function (layer, name) {
    this._addLayer(layer, name);
    this._update();
    return this;
  },

  addOverlay: function (layer, name) {
    this._addLayer(layer, name, true);
    this._update();
    return this;
  },

  removeLayer: function (layer) {
    var id = L.stamp(layer);
    delete this._layers[id];
    this._update();
    return this;
  },

  _initLayout: function () {
    var className = 'leaflet-control-layers',
        container = this._container = L.DomUtil.create('div', className);

    //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
    container.setAttribute('aria-haspopup', true);

    if (!L.Browser.touch) {
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
    } else {
      L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
    }

    var form = this._form = L.DomUtil.create('form', className + '-list');

    if (this.options.collapsed) {
      if (!L.Browser.android) {
        L.DomEvent
            .on(container, 'mouseover', this._expand, this)
            .on(container, 'mouseout', this._collapse, this);
      }
      var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
      link.href = '#';
      link.title = 'Layers';

      if (L.Browser.touch) {
        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this._expand, this);
      }
      else {
        L.DomEvent.on(link, 'focus', this._expand, this);
      }

      this._map.on('click', this._collapse, this);
      // TODO keyboard accessibility
    } else {
      this._expand();
    }

    this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
    this._separator = L.DomUtil.create('div', className + '-separator', form);
    this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

    container.appendChild(form);
  },

  _addLayer: function (layer, name, overlay) {
    var id = L.stamp(layer);

    this._layers[id] = {
      layer: layer,
      name: name,
      overlay: overlay
    };

    if (this.options.autoZIndex && layer.setZIndex) {
      this._lastZIndex++;
      layer.setZIndex(this._lastZIndex);
    }
  },

  _update: function () {
    if (!this._container) {
      return;
    }

    this._baseLayersList.innerHTML = '';
    this._overlaysList.innerHTML = '';

    var baseLayersPresent = false,
        overlaysPresent = false,
        i, obj;

    for (i in this._layers) {
      obj = this._layers[i];
      this._addItem(obj);
      overlaysPresent = overlaysPresent || obj.overlay;
      baseLayersPresent = baseLayersPresent || !obj.overlay;
    }

    this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
  },

  _onLayerChange: function (e) {
    var obj = this._layers[L.stamp(e.layer)];

    if (!obj) { return; }

    if (!this._handlingClick) {
      this._update();
    }

    var type = obj.overlay ?
      (e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
      (e.type === 'layeradd' ? 'baselayerchange' : null);

    if (type) {
      this._map.fire(type, obj);
    }
  },

  // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
  _createRadioElement: function (name, checked) {

    var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
    if (checked) {
      radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';

    var radioFragment = document.createElement('div');
    radioFragment.innerHTML = radioHtml;

    return radioFragment.firstChild;
  },

  _addItem: function (obj) {
    var label = document.createElement('label'),
        input,
        checked = this._map.hasLayer(obj.layer);

    if (obj.overlay) {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'leaflet-control-layers-selector';
      input.defaultChecked = checked;
    } else {
      input = this._createRadioElement('leaflet-base-layers', checked);
    }

    input.layerId = L.stamp(obj.layer);

    L.DomEvent.on(input, 'click', this._onInputClick, this);

    var name = document.createElement('span');
    name.innerHTML = ' ' + obj.name;

    label.appendChild(input);
    label.appendChild(name);

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(label);

    return label;
  },

  _onInputClick: function () {
    var i, input, obj,
        inputs = this._form.getElementsByTagName('input'),
        inputsLen = inputs.length;

    this._handlingClick = true;

    for (i = 0; i < inputsLen; i++) {
      input = inputs[i];
      obj = this._layers[input.layerId];

      if (input.checked && !this._map.hasLayer(obj.layer)) {
        this._map.addLayer(obj.layer);

      } else if (!input.checked && this._map.hasLayer(obj.layer)) {
        this._map.removeLayer(obj.layer);
      }
    }

    this._handlingClick = false;
  },

  _expand: function () {
    L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
  },

  _collapse: function () {
    this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
  }
});

L.control.layers = function (baseLayers, overlays, options) {
  return new L.Control.Layers(baseLayers, overlays, options);
};


/*
 * L.PosAnimation is used by Leaflet internally for pan animations.
 */

L.PosAnimation = L.Class.extend({
  includes: L.Mixin.Events,

  run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
    this.stop();

    this._el = el;
    this._inProgress = true;
    this._newPos = newPos;

    this.fire('start');

    el.style[L.DomUtil.TRANSITION] = 'all ' + (duration || 0.25) +
            's cubic-bezier(0,0,' + (easeLinearity || 0.5) + ',1)';

    L.DomEvent.on(el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
    L.DomUtil.setPosition(el, newPos);

    // toggle reflow, Chrome flickers for some reason if you don't do this
    L.Util.falseFn(el.offsetWidth);

    // there's no native way to track value updates of transitioned properties, so we imitate this
    this._stepTimer = setInterval(L.bind(this._onStep, this), 50);
  },

  stop: function () {
    if (!this._inProgress) { return; }

    // if we just removed the transition property, the element would jump to its final position,
    // so we need to make it stay at the current position

    L.DomUtil.setPosition(this._el, this._getPos());
    this._onTransitionEnd();
    L.Util.falseFn(this._el.offsetWidth); // force reflow in case we are about to start a new animation
  },

  _onStep: function () {
    // jshint camelcase: false
    // make L.DomUtil.getPosition return intermediate position value during animation
    this._el._leaflet_pos = this._getPos();

    this.fire('step');
  },

  // you can't easily get intermediate values of properties animated with CSS3 Transitions,
  // we need to parse computed style (in case of transform it returns matrix string)

  _transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,

  _getPos: function () {
    var left, top, matches,
        el = this._el,
        style = window.getComputedStyle(el);

    if (L.Browser.any3d) {
      matches = style[L.DomUtil.TRANSFORM].match(this._transformRe);
      left = matches ? parseFloat(matches[1]) : 0;
      top  = matches ? parseFloat(matches[2]) : 0;
    } else {
      left = parseFloat(style.left);
      top  = parseFloat(style.top);
    }

    return new L.Point(left, top, true);
  },

  _onTransitionEnd: function () {
    L.DomEvent.off(this._el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);

    if (!this._inProgress) { return; }
    this._inProgress = false;

    this._el.style[L.DomUtil.TRANSITION] = '';

    // jshint camelcase: false
    // make sure L.DomUtil.getPosition returns the final position value after animation
    this._el._leaflet_pos = this._newPos;

    clearInterval(this._stepTimer);

    this.fire('step').fire('end');
  }

});


/*
 * Extends L.Map to handle panning animations.
 */

L.Map.include({

  setView: function (center, zoom, options) {

    zoom = this._limitZoom(zoom);
    center = L.latLng(center);
    options = options || {};

    if (this._panAnim) {
      this._panAnim.stop();
    }

    if (this._loaded && !options.reset && options !== true) {

      if (options.animate !== undefined) {
        options.zoom = L.extend({animate: options.animate}, options.zoom);
        options.pan = L.extend({animate: options.animate}, options.pan);
      }

      // try animating pan or zoom
      var animated = (this._zoom !== zoom) ?
        this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
        this._tryAnimatedPan(center, options.pan);

      if (animated) {
        // prevent resize handler call, the view will refresh after animation anyway
        clearTimeout(this._sizeTimer);
        return this;
      }
    }

    // animation didn't start, just reset the map view
    this._resetView(center, zoom);

    return this;
  },

  panBy: function (offset, options) {
    offset = L.point(offset).round();
    options = options || {};

    if (!offset.x && !offset.y) {
      return this;
    }

    if (!this._panAnim) {
      this._panAnim = new L.PosAnimation();

      this._panAnim.on({
        'step': this._onPanTransitionStep,
        'end': this._onPanTransitionEnd
      }, this);
    }

    // don't fire movestart if animating inertia
    if (!options.noMoveStart) {
      this.fire('movestart');
    }

    // animate pan unless animate: false specified
    if (options.animate !== false) {
      L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');

      var newPos = this._getMapPanePos().subtract(offset);
      this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
    } else {
      this._rawPanBy(offset);
      this.fire('move').fire('moveend');
    }

    return this;
  },

  _onPanTransitionStep: function () {
    this.fire('move');
  },

  _onPanTransitionEnd: function () {
    L.DomUtil.removeClass(this._mapPane, 'leaflet-pan-anim');
    this.fire('moveend');
  },

  _tryAnimatedPan: function (center, options) {
    // difference between the new and current centers in pixels
    var offset = this._getCenterOffset(center)._floor();

    // don't animate too far unless animate: true specified in options
    if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

    this.panBy(offset, options);

    return true;
  }
});


/*
 * L.PosAnimation fallback implementation that powers Leaflet pan animations
 * in browsers that don't support CSS3 Transitions.
 */

L.PosAnimation = L.DomUtil.TRANSITION ? L.PosAnimation : L.PosAnimation.extend({

  run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
    this.stop();

    this._el = el;
    this._inProgress = true;
    this._duration = duration || 0.25;
    this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

    this._startPos = L.DomUtil.getPosition(el);
    this._offset = newPos.subtract(this._startPos);
    this._startTime = +new Date();

    this.fire('start');

    this._animate();
  },

  stop: function () {
    if (!this._inProgress) { return; }

    this._step();
    this._complete();
  },

  _animate: function () {
    // animation loop
    this._animId = L.Util.requestAnimFrame(this._animate, this);
    this._step();
  },

  _step: function () {
    var elapsed = (+new Date()) - this._startTime,
        duration = this._duration * 1000;

    if (elapsed < duration) {
      this._runFrame(this._easeOut(elapsed / duration));
    } else {
      this._runFrame(1);
      this._complete();
    }
  },

  _runFrame: function (progress) {
    var pos = this._startPos.add(this._offset.multiplyBy(progress));
    L.DomUtil.setPosition(this._el, pos);

    this.fire('step');
  },

  _complete: function () {
    L.Util.cancelAnimFrame(this._animId);

    this._inProgress = false;
    this.fire('end');
  },

  _easeOut: function (t) {
    return 1 - Math.pow(1 - t, this._easeOutPower);
  }
});


/*
 * Extends L.Map to handle zoom animations.
 */

L.Map.mergeOptions({
  zoomAnimation: true,
  zoomAnimationThreshold: 4
});

if (L.DomUtil.TRANSITION) {

  L.Map.addInitHook(function () {
    // don't animate on browsers without hardware-accelerated transitions or old Android/Opera
    this._zoomAnimated = this.options.zoomAnimation && L.DomUtil.TRANSITION &&
        L.Browser.any3d && !L.Browser.android23 && !L.Browser.mobileOpera;

    // zoom transitions run with the same duration for all layers, so if one of transitionend events
    // happens after starting zoom animation (propagating to the map pane), we know that it ended globally
    if (this._zoomAnimated) {
      L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
    }
  });
}

L.Map.include(!L.DomUtil.TRANSITION ? {} : {

  _catchTransitionEnd: function () {
    if (this._animatingZoom) {
      this._onZoomTransitionEnd();
    }
  },

  _tryAnimatedZoom: function (center, zoom, options) {

    if (this._animatingZoom) { return true; }

    options = options || {};

    // don't animate if disabled, not supported or zoom difference is too large
    if (!this._zoomAnimated || options.animate === false ||
            Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

    // offset is the pixel coords of the zoom origin relative to the current center
    var scale = this.getZoomScale(zoom),
        offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale),
      origin = this._getCenterLayerPoint()._add(offset);

    // don't animate if the zoom origin isn't within one screen from the current center, unless forced
    if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

    this
        .fire('movestart')
        .fire('zoomstart');

    this._animateZoom(center, zoom, origin, scale, null, true);

    return true;
  },

  _animateZoom: function (center, zoom, origin, scale, delta, backwards) {

    this._animatingZoom = true;

    // put transform transition on all layers with leaflet-zoom-animated class
    L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');

    // remember what center/zoom to set after animation
    this._animateToCenter = center;
    this._animateToZoom = zoom;

    // disable any dragging during animation
    if (L.Draggable) {
      L.Draggable._disabled = true;
    }

    this.fire('zoomanim', {
      center: center,
      zoom: zoom,
      origin: origin,
      scale: scale,
      delta: delta,
      backwards: backwards
    });
  },

  _onZoomTransitionEnd: function () {

    this._animatingZoom = false;

    L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');

    this._resetView(this._animateToCenter, this._animateToZoom, true, true);

    if (L.Draggable) {
      L.Draggable._disabled = false;
    }
  }
});


/*
  Zoom animation logic for L.TileLayer.
*/

L.TileLayer.include({
  _animateZoom: function (e) {
    if (!this._animating) {
      this._animating = true;
      this._prepareBgBuffer();
    }

    var bg = this._bgBuffer,
        transform = L.DomUtil.TRANSFORM,
        initialTransform = e.delta ? L.DomUtil.getTranslateString(e.delta) : bg.style[transform],
        scaleStr = L.DomUtil.getScaleString(e.scale, e.origin);

    bg.style[transform] = e.backwards ?
        scaleStr + ' ' + initialTransform :
        initialTransform + ' ' + scaleStr;
  },

  _endZoomAnim: function () {
    var front = this._tileContainer,
        bg = this._bgBuffer;

    front.style.visibility = '';
    front.parentNode.appendChild(front); // Bring to fore

    // force reflow
    L.Util.falseFn(bg.offsetWidth);

    this._animating = false;
  },

  _clearBgBuffer: function () {
    var map = this._map;

    if (map && !map._animatingZoom && !map.touchZoom._zooming) {
      this._bgBuffer.innerHTML = '';
      this._bgBuffer.style[L.DomUtil.TRANSFORM] = '';
    }
  },

  _prepareBgBuffer: function () {

    var front = this._tileContainer,
        bg = this._bgBuffer;

    // if foreground layer doesn't have many tiles but bg layer does,
    // keep the existing bg layer and just zoom it some more

    var bgLoaded = this._getLoadedTilesPercentage(bg),
        frontLoaded = this._getLoadedTilesPercentage(front);

    if (bg && bgLoaded > 0.5 && frontLoaded < 0.5) {

      front.style.visibility = 'hidden';
      this._stopLoadingImages(front);
      return;
    }

    // prepare the buffer to become the front tile pane
    bg.style.visibility = 'hidden';
    bg.style[L.DomUtil.TRANSFORM] = '';

    // switch out the current layer to be the new bg layer (and vice-versa)
    this._tileContainer = bg;
    bg = this._bgBuffer = front;

    this._stopLoadingImages(bg);

    //prevent bg buffer from clearing right after zoom
    clearTimeout(this._clearBgBufferTimer);
  },

  _getLoadedTilesPercentage: function (container) {
    var tiles = container.getElementsByTagName('img'),
        i, len, count = 0;

    for (i = 0, len = tiles.length; i < len; i++) {
      if (tiles[i].complete) {
        count++;
      }
    }
    return count / len;
  },

  // stops loading all tiles in the background layer
  _stopLoadingImages: function (container) {
    var tiles = Array.prototype.slice.call(container.getElementsByTagName('img')),
        i, len, tile;

    for (i = 0, len = tiles.length; i < len; i++) {
      tile = tiles[i];

      if (!tile.complete) {
        tile.onload = L.Util.falseFn;
        tile.onerror = L.Util.falseFn;
        tile.src = L.Util.emptyImageUrl;

        tile.parentNode.removeChild(tile);
      }
    }
  }
});


/*
 * Provides L.Map with convenient shortcuts for using browser geolocation features.
 */

L.Map.include({
  _defaultLocateOptions: {
    watch: false,
    setView: false,
    maxZoom: Infinity,
    timeout: 10000,
    maximumAge: 0,
    enableHighAccuracy: false
  },

  locate: function (/*Object*/ options) {

    options = this._locateOptions = L.extend(this._defaultLocateOptions, options);

    if (!navigator.geolocation) {
      this._handleGeolocationError({
        code: 0,
        message: 'Geolocation not supported.'
      });
      return this;
    }

    var onResponse = L.bind(this._handleGeolocationResponse, this),
      onError = L.bind(this._handleGeolocationError, this);

    if (options.watch) {
      this._locationWatchId =
              navigator.geolocation.watchPosition(onResponse, onError, options);
    } else {
      navigator.geolocation.getCurrentPosition(onResponse, onError, options);
    }
    return this;
  },

  stopLocate: function () {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(this._locationWatchId);
    }
    if (this._locateOptions) {
      this._locateOptions.setView = false;
    }
    return this;
  },

  _handleGeolocationError: function (error) {
    var c = error.code,
        message = error.message ||
                (c === 1 ? 'permission denied' :
                (c === 2 ? 'position unavailable' : 'timeout'));

    if (this._locateOptions.setView && !this._loaded) {
      this.fitWorld();
    }

    this.fire('locationerror', {
      code: c,
      message: 'Geolocation error: ' + message + '.'
    });
  },

  _handleGeolocationResponse: function (pos) {
    var lat = pos.coords.latitude,
        lng = pos.coords.longitude,
        latlng = new L.LatLng(lat, lng),

        latAccuracy = 180 * pos.coords.accuracy / 40075017,
        lngAccuracy = latAccuracy / Math.cos(L.LatLng.DEG_TO_RAD * lat),

        bounds = L.latLngBounds(
                [lat - latAccuracy, lng - lngAccuracy],
                [lat + latAccuracy, lng + lngAccuracy]),

        options = this._locateOptions;

    if (options.setView) {
      var zoom = Math.min(this.getBoundsZoom(bounds), options.maxZoom);
      this.setView(latlng, zoom);
    }

    var data = {
      latlng: latlng,
      bounds: bounds,
    };

    for (var i in pos.coords) {
      if (typeof pos.coords[i] === 'number') {
        data[i] = pos.coords[i];
      }
    }

    this.fire('locationfound', data);
  }
});


}(window, document));

/*! Esri-Leaflet - v0.0.1 - 2013-09-06
*   Copyright (c) 2013 Environmental Systems Research Institute, Inc.
*   Apache License*/
(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(factory);
  }

  // Browser Global.
  if(typeof window === "object") {
    root.Terraformer = factory();
  }

}(this, function(){
  var exports = {},
      EarthRadius = 6378137,
      DegreesPerRadian = 57.295779513082320,
      RadiansPerDegree =  0.017453292519943,
      MercatorCRS = {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      },
      GeographicCRS = {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      };


  function Deferred () {
    this._thens = [];
  }

  Deferred.prototype = {

    then: function (onResolve, onReject) {
      this._thens.push({ resolve: onResolve, reject: onReject });
      return this;
    },

    resolve: function (val) {
      this._complete('resolve', val);
      return this;
    },

    reject: function (ex) {
      this._complete('reject', ex);
      return this;
    },

    _complete: function (which, arg) {
      // switch over to sync then()
      this.then = (which === 'resolve') ?
        function (resolve, reject) { resolve(arg); } :
        function (resolve, reject) { reject(arg); };
      // disallow multiple calls to resolve or reject
      this.resolve = this.reject =
        function () { throw new Error('Deferred already completed.'); };
      // complete all waiting (async) then()s
      for (var i = 0; i < this._thens.length; i++) {
        var aThen = this._thens[i];
        if(aThen[which]) {
          aThen[which](arg);
        }
      }
      delete this._thens;
    }
  };

  /*
  Internal: safe warning
  */
  function warn() {
    var args = Array.prototype.slice.apply(arguments);

    if (typeof console !== undefined && console.warn) {
      console.warn.apply(console, args);
    }
  }

  /*
  Internal: Extend one object with another.
  */
  function extend(destination, source) {
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        destination[k] = source[k];
      }
    }
    return destination;
  }

  /*
  Internal: Merge two objects together.
  */
  function mergeObjects (base, add) {
    add = add || {};

    var keys = Object.keys(add);
    for (var i in keys) {
      base[keys[i]] = add[keys[i]];
    }

    return base;
  }

  /*
  Public: Calculate an bounding box for a geojson object
  */
  function calculateBounds (geojson) {

    switch (geojson.type) {
      case 'Point':
        return [ geojson.coordinates[0], geojson.coordinates[1], geojson.coordinates[0], geojson.coordinates[1]];

      case 'MultiPoint':
        return calculateBoundsFromArray(geojson.coordinates);

      case 'LineString':
        return calculateBoundsFromArray(geojson.coordinates);

      case 'MultiLineString':
        return calculateBoundsFromNestedArrays(geojson.coordinates);

      case 'Polygon':
        return calculateBoundsFromNestedArrays(geojson.coordinates);

      case 'MultiPolygon':
        return calculateBoundsFromNestedArrayOfArrays(geojson.coordinates);

      case 'Feature':
        return calculateBounds(geojson.geometry);

      case 'FeatureCollection':
        return calculateBoundsForFeatureCollection(geojson);

      case 'GeometryCollection':
        return calculateBoundsForGeometryCollection(geojson);

      default:
        throw new Error("Unknown type: " + geojson.type);
    }
  }

  /*
  Internal: Calculate an bounding box from an nested array of positions
  */
  function calculateBoundsFromNestedArrays (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var inner = array[i];

      for (var j = 0; j < inner.length; j++) {
        var lonlat = inner[j];

        var lon = lonlat[0];
        var lat = lonlat[1];

        if (x1 === null) {
          x1 = lon;
        } else if (lon < x1) {
          x1 = lon;
        }

        if (x2 === null) {
          x2 = lon;
        } else if (lon > x2) {
          x2 = lon;
        }

        if (y1 === null) {
          y1 = lat;
        } else if (lat < y1) {
          y1 = lat;
        }

        if (y2 === null) {
          y2 = lat;
        } else if (lat > y2) {
          y2 = lat;
        }
      }
    }

    return [x1, y1, x2, y2 ];
  }

  /*
  Internal: Calculate a bounding box from an array of arrays of arrays
  */
  function calculateBoundsFromNestedArrayOfArrays (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var inner = array[i];

      for (var j = 0; j < inner.length; j++) {
        var innerinner = inner[j];
        for (var k = 0; k < innerinner.length; k++) {
          var lonlat = innerinner[k];

          var lon = lonlat[0];
          var lat = lonlat[1];

          if (x1 === null) {
            x1 = lon;
          } else if (lon < x1) {
            x1 = lon;
          }

          if (x2 === null) {
            x2 = lon;
          } else if (lon > x2) {
            x2 = lon;
          }

          if (y1 === null) {
            y1 = lat;
          } else if (lat < y1) {
            y1 = lat;
          }

          if (y2 === null) {
            y2 = lat;
          } else if (lat > y2) {
            y2 = lat;
          }
        }
      }
    }

    return [x1, y1, x2, y2];
  }

  /*
  Internal: Calculate a bounding box from an array of positions
  */
  function calculateBoundsFromArray (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var lonlat = array[i];

      var lon = lonlat[0];
      var lat = lonlat[1];

      if (x1 === null) {
        x1 = lon;
      } else if (lon < x1) {
        x1 = lon;
      }

      if (x2 === null) {
        x2 = lon;
      } else if (lon > x2) {
        x2 = lon;
      }

      if (y1 === null) {
        y1 = lat;
      } else if (lat < y1) {
        y1 = lat;
      }

      if (y2 === null) {
        y2 = lat;
      } else if (lat > y2) {
        y2 = lat;
      }
    }

    return [x1, y1, x2, y2 ];
  }

  /*
  Internal: Calculate an bounding box for a feature collection
  */
  function calculateBoundsForFeatureCollection(featureCollection){
    var extents = [], extent;
    for (var i = featureCollection.features.length - 1; i >= 0; i--) {
      extent = calculateBounds(featureCollection.features[i].geometry);
      extents.push([extent[0],extent[1]]);
      extents.push([extent[2],extent[3]]);
    }

    return calculateBoundsFromArray(extents);
  }

  /*
  Internal: Calculate an bounding box for a geometry collection
  */
  function calculateBoundsForGeometryCollection(geometryCollection){
    var extents = [], extent;

    for (var i = geometryCollection.geometries.length - 1; i >= 0; i--) {
      extent = calculateBounds(geometryCollection.geometries[i]);
      extents.push([extent[0],extent[1]]);
      extents.push([extent[2],extent[3]]);
    }

    return calculateBoundsFromArray(extents);
  }

  function calculateEnvelope(geojson){
    var bounds = calculateBounds(geojson);
    return {
      x: bounds[0],
      y: bounds[1],
      w: Math.abs(bounds[0] - bounds[2]),
      h: Math.abs(bounds[1] - bounds[3])
    };
  }

  /*
  Internal: Convert radians to degrees. Used by spatial reference converters.
  */
  function radToDeg(rad) {
    return rad * DegreesPerRadian;
  }

  /*
  Internal: Convert degrees to radians. Used by spatial reference converters.
  */
  function degToRad(deg) {
    return deg * RadiansPerDegree;
  }

  /*
  Internal: Loop over each array in a geojson object and apply a function to it. Used by spatial reference converters.
  */
  function eachPosition(coordinates, func) {
    for (var i = 0; i < coordinates.length; i++) {
      // we found a number so lets convert this pair
      if(typeof coordinates[i][0] === "number"){
        coordinates[i] = func(coordinates[i]);
      }
      // we found an coordinates array it again and run THIS function against it
      if(typeof coordinates[i] === "object"){
        coordinates[i] = eachPosition(coordinates[i], func);
      }
    }
    return coordinates;
  }

  /*
  Public: Convert a GeoJSON Position object to Geographic (4326)
  */
  function positionToGeographic(position) {
    var x = position[0];
    var y = position[1];
    return [radToDeg(x / EarthRadius) - (Math.floor((radToDeg(x / EarthRadius) + 180) / 360) * 360), radToDeg((Math.PI / 2) - (2 * Math.atan(Math.exp(-1.0 * y / EarthRadius))))];
  }

  /*
  Public: Convert a GeoJSON Position object to Web Mercator (102100)
  */
  function positionToMercator(position) {
    var lng = position[0];
    var lat = Math.max(Math.min(position[1], 89.99999), -89.99999);
    return [degToRad(lng) * EarthRadius, EarthRadius/2.0 * Math.log( (1.0 + Math.sin(degToRad(lat))) / (1.0 - Math.sin(degToRad(lat))) )];
  }

  /*
  Public: Apply a function agaist all positions in a geojson object. Used by spatial reference converters.
  */
  function applyConverter(geojson, converter, noCrs){
    if(geojson.type === "Point") {
      geojson.coordinates = converter(geojson.coordinates);
    } else if(geojson.type === "Feature") {
      geojson.geometry = applyConverter(geojson.geometry, converter, true);
    } else if(geojson.type === "FeatureCollection") {
      for (var f = 0; f < geojson.features.length; f++) {
        geojson.features[f] = applyConverter(geojson.features[f], converter, true);
      }
    } else if(geojson.type === "GeometryCollection") {
      for (var g = 0; g < geojson.geometries.length; g++) {
        geojson.geometries[g] = applyConverter(geojson.geometries[g], converter, true);
      }
    } else {
      geojson.coordinates = eachPosition(geojson.coordinates, converter);
    }

    if(!noCrs){
      if(converter === positionToMercator){
        geojson.crs = MercatorCRS;
      }
    }

    if(converter === positionToGeographic){
      delete geojson.crs;
    }

    return geojson;
  }

  /*
  Public: Convert a GeoJSON object to ESRI Web Mercator (102100)
  */
  function toMercator(geojson) {
    return applyConverter(geojson, positionToMercator);
  }

  /*
  Convert a GeoJSON object to Geographic coordinates (WSG84, 4326)
  */
  function toGeographic(geojson) {
    return applyConverter(geojson, positionToGeographic);
  }


  /*
  Internal: -1,0,1 comparison function
  */
  function cmp(a, b) {
    if(a < b) {
      return -1;
    } else if(a > b) {
      return 1;
    } else {
      return 0;
    }
  }


  /*
  Internal: used to determine turn
  */
  function turn(p, q, r) {
    // Returns -1, 0, 1 if p,q,r forms a right, straight, or left turn.
    return cmp((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]), 0);
  }

  /*
  Internal: used to determine euclidean distance between two points
  */
  function euclideanDistance(p, q) {
    // Returns the squared Euclidean distance between p and q.
    var dx = q[0] - p[0];
    var dy = q[1] - p[1];

    return dx * dx + dy * dy;
  }

  function nextHullPoint(points, p) {
    // Returns the next point on the convex hull in CCW from p.
    var q = p;
    for(var r in points) {
      var t = turn(p, q, points[r]);
      if(t === -1 || t === 0 && euclideanDistance(p, points[r]) > euclideanDistance(p, q)) {
        q = points[r];
      }
    }
    return q;
  }

  function convexHull(points) {
    // implementation of the Jarvis March algorithm
    // adapted from http://tixxit.wordpress.com/2009/12/09/jarvis-march/

    if(points.length === 0) {
      return [];
    } else if(points.length === 1) {
      return points;
    }

    function comp(p1, p2) {
      if(p1[0] - p2[0] > p1[1] - p2[1]) {
        return 1;
      } else if(p1[0] - p2[0] < p1[1] - p2[1]) {
        return -1;
      } else {
        return 0;
      }
    }

    // Returns the points on the convex hull of points in CCW order.
    var hull = [points.sort(comp)[0]];

    for(var p = 0; p < hull.length; p++) {
      var q = nextHullPoint(points, hull[p]);

      if(q !== hull[0]) {
        hull.push(q);
      }
    }

    return hull;
  }

  function coordinatesContainPoint(coordinates, point) {
    var contains = false;
    for(var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
      if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
           (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
          (point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0])) {
        contains = true;
      }
    }
    return contains;
  }

  function polygonContainsPoint(polygon, point) {
    if (polygon && polygon.length) {
      if (polygon.length === 1) { // polygon with no holes
        return coordinatesContainPoint(polygon[0], point);
      } else { // polygon with holes
        if (coordinatesContainPoint(polygon[0], point)) {
          for (var i = 1; i < polygon.length; i++) {
            if (coordinatesContainPoint(polygon[i], point)) {
              return false; // found in hole
            }
          }

          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  function vertexIntersectsVertex(a1, a2, b1, b2) {
    var ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    var ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    var u_b  = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if ( u_b !== 0 ) {
      var ua = ua_t / u_b;
      var ub = ub_t / u_b;

      if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
        return true;
      }
    }

    return false;
  }

  function arrayIntersectsArray(a, b) {
    for (var i = 0; i < a.length - 1; i++) {
      for (var j = 0; j < b.length - 1; j++) {
        if (vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
          return true;
        }
      }
    }

    return false;
  }

  function arrayIntersectsMultiArray(a, b) {
    for (var i = 0; i < b.length; i++) {
      var inner = b[i];

      for (var j = 0; j < inner.length - 1; j++) {
        for (var k = 0; k < a.length - 1; k++) {
          if (vertexIntersectsVertex(inner[j], inner[j + 1], a[k], a[k + 1])) {
            return true;
          }
        }
      }
    }

    return false;
  }

  function multiArrayIntersectsMultiArray(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (arrayIntersectsMultiArray(a[i], b)) {
        return true;
      }
    }

    return false;
  }

  function arrayIntersectsMultiMultiArray(a, b) {
    for (var i = 0; i < b.length; i++) {
      if (arrayIntersectsMultiArray(a, b[i])) {
        return true;
      }

      return false;
    }
  }

  function multiArrayIntersectsMultiMultiArray(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (arrayIntersectsMultiMultiArray(a[i], b)) {
        return true;
      }

      return false;
    }
  }

  function multiMultiArrayIntersectsMultiMultiArray(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (multiArrayIntersectsMultiMultiArray(a[i], b)) {
        return true;
      }

      return false;
    }
  }

  /*
  Internal: Returns a copy of coordinates for s closed polygon
  */
  function closedPolygon(coordinates) {
    var outer = [ ];

    for (var i = 0; i < coordinates.length; i++) {
      var inner = coordinates[i].slice();

      if (pointsEqual(inner[0], inner[inner.length - 1]) === false) {
        inner.push(inner[0]);
      }

      outer.push(inner);
    }

    return outer;
  }

  function pointsEqual(a, b) {
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        if (a[i] !== b[j]) {
          return false;
        }
      }
    }

    return true;
  }

  /*
  Internal: An array of variables that will be excluded form JSON objects.
  */
  var excludeFromJSON = ["length"];

  /*
  Internal: Base GeoJSON Primitive
  */
  function Primitive(geojson){
    if(geojson){
      switch (geojson.type) {
      case 'Point':
        return new Point(geojson);

      case 'MultiPoint':
        return new MultiPoint(geojson);

      case 'LineString':
        return new LineString(geojson);

      case 'MultiLineString':
        return new MultiLineString(geojson);

      case 'Polygon':
        return new Polygon(geojson);

      case 'MultiPolygon':
        return new MultiPolygon(geojson);

      case 'Feature':
        return new Feature(geojson);

      case 'FeatureCollection':
        return new FeatureCollection(geojson);

      case 'GeometryCollection':
        return new GeometryCollection(geojson);

      default:
        throw new Error("Unknown type: " + geojson.type);
      }
    }
  }

  Primitive.prototype = {
    toMercator: function(){
      return toMercator(this);
    },
    toGeographic: function(){
      return toGeographic(this);
    },
    envelope: function(){
      var bounds = calculateBounds(this);
      return {
        x: bounds[0],
        y: bounds[1],
        w: Math.abs(bounds[0] - bounds[2]),
        h: Math.abs(bounds[1] - bounds[3])
      };
    },
    bbox: function(){
      return calculateBounds(this);
    },
    convexHull: function(){
      var coordinates = [ ], i, j;
      if (this.type === 'Point') {
        if (this.coordinates && this.coordinates.length > 0) {
          return [ this.coordinates ];
        } else {
          return [ ];
        }
      } else if (this.type === 'LineString' || this.type === 'MultiPoint') {
        if (this.coordinates && this.coordinates.length > 0) {
          coordinates = this.coordinates;
        } else {
          return [ ];
        }
      } else if (this.type === 'Polygon' || this.type === 'MultiLineString') {
        if (this.coordinates && this.coordinates.length > 0) {
          for (i = 0; i < this.coordinates.length; i++) {
            coordinates = coordinates.concat(this.coordinates[i]);
          }
        } else {
          return [ ];
        }
      } else if (this.type === 'MultiPolygon') {
        if (this.coordinates && this.coordinates.length > 0) {
          for (i = 0; i < this.coordinates.length; i++) {
            for (j = 0; j < this.coordinates[i].length; j++) {
              coordinates = coordinates.concat(this.coordinates[i][j]);
            }
          }
        } else {
          return [ ];
        }
      } else {
        throw new Error("Unable to get convex hull of " + this.type);
      }

      return convexHull(coordinates);
    },
    toJSON: function(){
      var obj = {};
      for (var key in this) {
        if (this.hasOwnProperty(key) && this[key] && excludeFromJSON.indexOf(key)) {
          obj[key] = this[key];
        }
      }
      obj.bbox = calculateBounds(this);
      return obj;
    },
    intersects: function(primitive) {
      // if we are passed a feature, use the polygon inside instead
      if (primitive.type === 'Feature') {
        primitive = primitive.geometry;
      }

      if (this.type === 'LineString') {
        if (primitive.type === 'LineString') {
          return arrayIntersectsArray(this.coordinates, primitive.coordinates);
        } else if (primitive.type === 'MultiLineString') {
          return arrayIntersectsMultiArray(this.coordinates, primitive.coordinates);
        } else if (primitive.type === 'Polygon') {
          return arrayIntersectsMultiArray(this.coordinates, closedPolygon(primitive.coordinates));
        } else if (primitive.type === 'MultiPolygon') {
          return arrayIntersectsMultiMultiArray(this.coordinates, primitive.coordinates);
        }
      } else if (this.type === 'MultiLineString') {
        if (primitive.type === 'LineString') {
          return arrayIntersectsMultiArray(primitive.coordinates, this.coordinates);
        } else if (primitive.type === 'Polygon' || primitive.type === 'MultiLineString') {
          return multiArrayIntersectsMultiArray(this.coordinates, primitive.coordinates);
        } else if (primitive.type === 'MultiPolygon') {
          return multiArrayIntersectsMultiMultiArray(this.coordinates, primitive.coordinates);
        }
      } else if (this.type === 'Polygon') {
        if (primitive.type === 'LineString') {
          return arrayIntersectsMultiArray(primitive.coordinates, closedPolygon(this.coordinates));
        } else if (primitive.type === 'MultiLineString') {
          return multiArrayIntersectsMultiArray(closedPolygon(this.coordinates), primitive.coordinates);
        } else if (primitive.type === 'Polygon') {
          return multiArrayIntersectsMultiArray(closedPolygon(this.coordinates), closedPolygon(primitive.coordinates));
        } else if (primitive.type === 'MultiPolygon') {
          return multiArrayIntersectsMultiMultiArray(closedPolygon(this.coordinates), primitive.coordinates);
        }
      } else if (this.type === 'MultiPolygon') {
        if (primitive.type === 'LineString') {
          return arrayIntersectsMultiMultiArray(primitive.coordinates, this.coordinates);
        } else if (primitive.type === 'Polygon' || primitive.type === 'MultiLineString') {
          return multiArrayIntersectsMultiMultiArray(closedPolygon(primitive.coordinates), this.coordinates);
        } else if (primitive.type === 'MultiPolygon') {
          return multiMultiArrayIntersectsMultiMultiArray(this.coordinates, primitive.coordinates);
        }
      } else if (this.type === 'Feature') {
        // in the case of a Feature, use the internal primitive for intersection
        var inner = new Primitive(this.geometry);
        return inner.intersects(primitive);
      }

      warn("Type " + this.type + " to " + primitive.type + " intersection is not supported by intersects");
      return false;
    }
  };


  /*
  GeoJSON Point Class
    new Point();
    new Point(x,y,z,wtf);
    new Point([x,y,z,wtf]);
    new Point([x,y]);
    new Point({
      type: "Point",
      coordinates: [x,y]
    });
  */
  function Point(input){
    var args = Array.prototype.slice.call(arguments);

    if(input && input.type === "Point" && input.coordinates){
      extend(this, input);
    } else if(input && Array.isArray(input)) {
      this.coordinates = input;
    } else if(args.length >= 2) {
      this.coordinates = args;
    } else {
      throw "Terraformer: invalid input for Terraformer.Point";
    }

    this.type = "Point";
  }

  Point.prototype = new Primitive();
  Point.prototype.constructor = Point;

  /*
  GeoJSON MultiPoint Class
      new MultiPoint();
      new MultiPoint([[x,y], [x1,y1]]);
      new MultiPoint({
        type: "MultiPoint",
        coordinates: [x,y]
      });
  */
  function MultiPoint(input){
    if(input && input.type === "MultiPoint" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.MultiPoint";
    }

    this.type = "MultiPoint";
  }

  MultiPoint.prototype = new Primitive();
  MultiPoint.prototype.constructor = MultiPoint;
  MultiPoint.prototype.forEach = function(func){
    for (var i = 0; i < this.coordinates.length; i++) {
      func.apply(this, [this.coordinates[i], i, this.coordinates]);
    }
    return this;
  };
  MultiPoint.prototype.addPoint = function(point){
    this.coordinates.push(point);
    return this;
  };
  MultiPoint.prototype.insertPoint = function(point, index){
    this.coordinates.splice(index, 0, point);
    return this;
  };
  MultiPoint.prototype.removePoint = function(remove){
    if(typeof remove === "number"){
      this.coordinates.splice(remove, 1);
    } else {
      this.coordinates.splice(this.coordinates.indexOf(remove), 1);
    }
    return this;
  };
  MultiPoint.prototype.get = function(i){
    return new Point(this.coordinates[i]);
  };

  /*
  GeoJSON LineString Class
      new LineString();
      new LineString([[x,y], [x1,y1]]);
      new LineString({
        type: "LineString",
        coordinates: [x,y]
      });
  */
  function LineString(input){
    if(input && input.type === "LineString" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.LineString";
    }

    this.type = "LineString";
  }

  LineString.prototype = new Primitive();
  LineString.prototype.constructor = LineString;
  LineString.prototype.addVertex = function(point){
    this.coordinates.push(point);
    return this;
  };
  LineString.prototype.insertVertex = function(point, index){
    this.coordinates.splice(index, 0, point);
    return this;
  };
  LineString.prototype.removeVertex = function(remove){
    this.coordinates.splice(remove, 1);
    return this;
  };

  /*
  GeoJSON MultiLineString Class
      new MultiLineString();
      new MultiLineString([ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ]);
      new MultiLineString({
        type: "MultiLineString",
        coordinates: [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ]
      });
  */
  function MultiLineString(input){
    if(input && input.type === "MultiLineString" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.MultiLineString";
    }

    this.type = "MultiLineString";
  }

  MultiLineString.prototype = new Primitive();
  MultiLineString.prototype.constructor = MultiLineString;
  MultiLineString.prototype.forEach = function(func){
    for (var i = 0; i < this.coordinates.length; i++) {
      func.apply(this, [this.coordinates[i], i, this.coordinates ]);
    }
  };
  MultiLineString.prototype.get = function(i){
    return new LineString(this.coordinates[i]);
  };

  /*
  GeoJSON Polygon Class
      new Polygon();
      new Polygon([ [[x,y], [x1,y1], [x2,y2]] ]);
      new Polygon({
        type: "Polygon",
        coordinates: [ [[x,y], [x1,y1], [x2,y2]] ]
      });
  */
  function Polygon(input){
    if(input && input.type === "Polygon" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.Polygon";
    }

    this.type = "Polygon";
  }

  Polygon.prototype = new Primitive();
  Polygon.prototype.constructor = Polygon;
  Polygon.prototype.addVertex = function(point){
    this.coordinates[0].push(point);
    return this;
  };
  Polygon.prototype.insertVertex = function(point, index){
    this.coordinates[0].splice(index, 0, point);
    return this;
  };
  Polygon.prototype.removeVertex = function(remove){
    this.coordinates[0].splice(remove, 1);
    return this;
  };
  Polygon.prototype.contains = function(primitive) {
    if (primitive.type === "Point") {
      return polygonContainsPoint(this.coordinates, primitive.coordinates);
    } else if (primitive.type === "Polygon") {
      if (primitive.coordinates.length > 0 && primitive.coordinates[0].length > 0) {
        // naive assertion - contains a point and does not intersect
        if (polygonContainsPoint(this.coordinates, primitive.coordinates[0][0]) === true &&
            this.intersects(primitive) === false) {
          return true;
        }
      }
    } else if (primitive.type === "MultiPolygon") {
      if (primitive.coordinates.length > 0) {
        // same naive assertion, but loop through all of the inner polygons
        for (var i = 0; i < primitive.coordinates.length; i++) {
          if (primitive.coordinates[i][0].length > 0) {
            if (polygonContainsPoint(this.coordinates, primitive.coordinates[i][0][0]) === true &&
                this.intersects({ type: "Polygon", coordinates: primitive.coordinates[i] }) === false) {
              return true;
            }
          }
        }
      }
    }

    return false;
  };

  /*
  GeoJSON MultiPolygon Class
      new MultiPolygon();
      new MultiPolygon([ [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ] ]);
      new MultiPolygon({
        type: "MultiPolygon",
        coordinates: [ [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ] ]
      });
  */
  function MultiPolygon(input){
    if(input && input.type === "MultiPolygon" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.MultiPolygon";
    }

    this.type = "MultiPolygon";
  }

  MultiPolygon.prototype = new Primitive();
  MultiPolygon.prototype.constructor = MultiPolygon;
  MultiPolygon.prototype.forEach = function(func){
    for (var i = 0; i < this.coordinates.length; i++) {
      func.apply(this, [this.coordinates[i], i, this.coordinates ]);
    }
  };
  MultiPolygon.prototype.contains = function(primitive) {
    if (primitive.type !== "Point") {
      throw new Error("Only points are supported");
    }

    for (var i = 0; i < this.coordinates.length; i++) {
      if (polygonContainsPoint(this.coordinates[i], primitive.coordinates)) {
        return true;
      }
    }

    return false;
  };
  MultiPolygon.prototype.get = function(i){
    return new Polygon(this.coordinates[i]);
  };

  /*
  GeoJSON Feature Class
      new Feature();
      new Feature({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [ [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ] ]
        }
      });
      new Feature({
        type: "Polygon",
        coordinates: [ [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ] ]
      });
  */
  function Feature(input){
    if(input && input.type === "Feature" && input.geometry){
      extend(this, input);
    } else if(input && input.type && input.coordinates) {
      this.geometry = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.Feature";
    }

    this.type = "Feature";
  }

  Feature.prototype = new Primitive();
  Feature.prototype.constructor = Feature;
  Feature.prototype.contains = function(primitive) {
    if (primitive.type !== "Point") {
      throw new Error("Only points are supported");
    }

    if (!this.geometry.type.match(/Polygon/)) {
      throw new Error("Only features containing Polygons and MultiPolygons are supported");
    }
    if(this.geometry.type === "MultiPolygon"){
      for (var i = 0; i < this.geometry.coordinates.length; i++) {
        if (polygonContainsPoint(this.geometry.coordinates[i], primitive.coordinates)) {
          return true;
        }
      }
    }
    if(this.geometry.type === "Polygon"){
      return polygonContainsPoint(this.geometry.coordinates, primitive.coordinates);
    }
    return false;
  };


  /*
  GeoJSON FeatureCollection Class
      new FeatureCollection();
      new FeatureCollection([feature, feature1]);
      new FeatureCollection({
        type: "FeatureCollection",
        coordinates: [feature, feature1]
      });
  */
  function FeatureCollection(input){
    if(input && input.type === "FeatureCollection" && input.features){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.features = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.FeatureCollection";
    }

    this.type = "FeatureCollection";
  }

  FeatureCollection.prototype = new Primitive();
  FeatureCollection.prototype.constructor = FeatureCollection;
  FeatureCollection.prototype.forEach = function(func){
    for (var i = 0; i < this.features.length; i++) {
      func.apply(this, [this.features[i], i, this.features]);
    }
  };
  FeatureCollection.prototype.get = function(id){
    var found;
    this.forEach(function(feature){
      if(feature.id === id){
        found = feature;
      }
    });
    return new Feature(found);
  };

  /*
  GeoJSON GeometryCollection Class
      new GeometryCollection();
      new GeometryCollection([geometry, geometry1]);
      new GeometryCollection({
        type: "GeometryCollection",
        coordinates: [geometry, geometry1]
      });
  */
  function GeometryCollection(input){
    if(input && input.type === "GeometryCollection" && input.geometries){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.geometries = input;
    } else if(input.coordinates && input.type){
      this.type = "GeometryCollection";
      this.geometries = [input];
    } else {
      throw "Terraformer: invalid input for Terraformer.GeometryCollection";
    }

    this.type = "GeometryCollection";
  }

  GeometryCollection.prototype = new Primitive();
  GeometryCollection.prototype.constructor = GeometryCollection;
  GeometryCollection.prototype.forEach = function(func){
    for (var i = 0; i < this.geometries.length; i++) {
      func.apply(this, [this.geometries[i], i, this.geometries]);
    }
  };
  GeometryCollection.prototype.get = function(i){
    return new Primitive(this.geometries[i]);
  };

  function createCircle(center, rad, interpolate){
    var mercatorPosition = positionToMercator(center);
    var steps = interpolate || 64;
    var radius = rad || 250;
    var polygon = {
      type: "Polygon",
      coordinates: [[]]
    };
    for(var i=1; i<=steps; i++) {
      var radians = i * (360/steps) * Math.PI / 180;
      polygon.coordinates[0].push([mercatorPosition[0] + radius * Math.cos(radians), mercatorPosition[1] + radius * Math.sin(radians)]);
    }
    return toGeographic(polygon);
  }

  function Circle (center, rad, interpolate) {
    var steps = interpolate || 64;
    var radius = rad || 250;

    if(!center || center.length < 2 || !radius || !steps) {
      throw new Error("Terraformer: missing parameter for Terraformer.Circle");
    }

    extend(this, new Feature({
      type: "Feature",
      geometry: createCircle(center, radius, steps),
      properties: {
        radius: radius,
        center: center,
        steps: steps
      }
    }));
  }

  Circle.prototype = new Primitive();
  Circle.prototype.constructor = Circle;
  Circle.prototype.recalculate = function(){
    this.geometry = createCircle(this.properties.center, this.properties.radius, this.properties.steps);
    return this;
  };
  Circle.prototype.center = function(coordinates){
    if(coordinates){
      this.properties.center = coordinates;
      this.recalculate();
    }
    return this.properties.center;
  };
  Circle.prototype.radius = function(radius){
    if(radius){
      this.properties.radius = radius;
      this.recalculate();
    }
    return this.properties.radius;
  };
  Circle.prototype.steps = function(steps){
    if(steps){
      this.properties.steps = steps;
      this.recalculate();
    }
    return this.properties.steps;
  };
  Circle.prototype.contains = function(primitive) {
    if (primitive.type !== "Point") {
      throw new Error("Only points are supported");
    }
    return polygonContainsPoint(this.geometry.coordinates, primitive.coordinates);
  };

  Circle.prototype.toJSON = function() {
    var output = Primitive.prototype.toJSON.call(this);
    return output;
  };

  exports.Primitive = Primitive;
  exports.Point = Point;
  exports.MultiPoint = MultiPoint;
  exports.LineString = LineString;
  exports.MultiLineString = MultiLineString;
  exports.Polygon = Polygon;
  exports.MultiPolygon = MultiPolygon;
  exports.Feature = Feature;
  exports.FeatureCollection = FeatureCollection;
  exports.GeometryCollection = GeometryCollection;
  exports.Circle = Circle;

  exports.toMercator = toMercator;
  exports.toGeographic = toGeographic;

  exports.Tools = {};
  exports.Tools.positionToMercator = positionToMercator;
  exports.Tools.positionToGeographic = positionToGeographic;
  exports.Tools.applyConverter = applyConverter;
  exports.Tools.toMercator = toMercator;
  exports.Tools.toGeographic = toGeographic;
  exports.Tools.createCircle = createCircle;

  exports.Tools.calculateBounds = calculateBounds;
  exports.Tools.calculateEnvelope = calculateEnvelope;
  exports.Tools.coordinatesContainPoint = coordinatesContainPoint;
  exports.Tools.polygonContainsPoint = polygonContainsPoint;
  exports.Tools.arrayIntersectsArray = arrayIntersectsArray;
  exports.Tools.coordinatesContainPoint = coordinatesContainPoint;
  exports.Tools.convexHull = convexHull;

  exports.MercatorCRS = MercatorCRS;
  exports.GeographicCRS = GeographicCRS;

  exports.Deferred = Deferred;

  return exports;
}));
(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(["terraformer/terraformer"],factory);
  }

  // Browser Global.
  if (typeof root.Terraformer === "undefined"){
    root.Terraformer = {};
  }
  root.Terraformer.RTree = factory().RTree;

}(this, function() {
  var exports = { };
  var Terraformer;

  // Local Reference To Browser Global
  if(typeof this.navigator === "object") {
    Terraformer = this.Terraformer;
  }

  // Setup Node Dependencies
  if(typeof module === 'object' && typeof module.exports === 'object') {
    Terraformer = require('terraformer');
  }

  // Setup AMD Dependencies
  if(arguments[0] && typeof define === 'function' && define.amd) {
    Terraformer = arguments[0];
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  /******************************************************************************
 rtree.js - General-Purpose Non-Recursive Javascript R-Tree Library
 Version 0.6.2, December 5st 2009
 Copyright (c) 2009 Jon-Carlos Rivera
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 Jon-Carlos Rivera - imbcmdth@hotmail.com
 ******************************************************************************/

/*
 * RTree - A simple r-tree structure for great results.
 * @constructor
 */
var RTree = function (width) {
    // Variables to control tree-dimensions
    var _Min_Width = 3; // Minimum width of any node before a merge
    var _Max_Width = 6; // Maximum width of any node before a split
    if (!isNaN(width)) {
      _Min_Width = Math.floor(width / 2.0);
      _Max_Width = width;
    }

    this.min_width = _Min_Width;
    this.max_width = _Max_Width;

    // Start with an empty root-tree
    var _T = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      id: "root",
      nodes: []
    };

   /* @function
    * @description Function to generate unique strings for element IDs
    * @param {String} n      The prefix to use for the IDs generated.
    * @return {String}        A guarenteed unique ID.
    */
    var _name_to_id = (function() {
      // hide our idCache inside this closure
      var idCache = {};

      // return the api: our function that returns a unique string with incrementing number appended to given idPrefix
      return function(idPrefix) {
        var idVal = 0;
        if (idPrefix in idCache) {
          idVal = idCache[idPrefix]++;
        } else {
          idCache[idPrefix] = 0;
        }
        return idPrefix + "_" + idVal;
      };
    })();

    // This is my special addition to the world of r-trees
    // every other (simple) method I found produced crap trees
    // this skews insertions to prefering squarer and emptier nodes
    RTree.Rectangle.squarified_ratio = function(l, w, fill) {
      // Area of new enlarged rectangle
      var lperi = (l + w) / 2.0; // Average size of a side of the new rectangle
      var larea = l * w; // Area of new rectangle
      // return the ratio of the perimeter to the area - the closer to 1 we are,
      // the more "square" a rectangle is. conversly, when approaching zero the
      // more elongated a rectangle is
      var lgeo = larea / (lperi * lperi);
      return (larea * fill / lgeo);
    };

   /* find the best specific node(s) for object to be deleted from
    * [ leaf node parent ] = _remove_subtree(rectangle, object, root)
    * @private
    */
    var _remove_subtree = function(rect, obj, root) {
        var hit_stack = []; // Contains the elements that overlap
        var count_stack = []; // Contains the elements that overlap
        var ret_array = [];
        var current_depth = 1;

        if (!rect || !RTree.Rectangle.overlap_rectangle(rect, root)) {
          return ret_array;
        }

        var ret_obj = {
          x: rect.x,
          y: rect.y,
          w: rect.w,
          h: rect.h,
          target: obj
        };

        count_stack.push(root.nodes.length);
        hit_stack.push(root);

        do {
          var tree = hit_stack.pop();
          var i = count_stack.pop() - 1;

          if ("target" in ret_obj) { // We are searching for a target
            while (i >= 0) {
              var ltree = tree.nodes[i];
              if (RTree.Rectangle.overlap_rectangle(ret_obj, ltree)) {
                if ((ret_obj.target && "leaf" in ltree && ltree.leaf === ret_obj.target) || (!ret_obj.target && ("leaf" in ltree || RTree.Rectangle.contains_rectangle(ltree, ret_obj)))) { // A Match !!
                  // Yup we found a match...
                  // we can cancel search and start walking up the list
                  if ("nodes" in ltree) { // If we are deleting a node not a leaf...
                    ret_array = _search_subtree(ltree, true, [], ltree);
                    tree.nodes.splice(i, 1);
                  } else {
                    ret_array = tree.nodes.splice(i, 1);
                  }
                  // Resize MBR down...
                  RTree.Rectangle.make_MBR(tree.nodes, tree);
                  delete ret_obj.target;
                  if (tree.nodes.length < _Min_Width) { // Underflow
                    ret_obj.nodes = _search_subtree(tree, true, [], tree);
                  }
                  break;
                }
                /*  else if("load" in ltree) { // A load
                }*/
                else if ("nodes" in ltree) { // Not a Leaf
                  current_depth += 1;
                  count_stack.push(i);
                  hit_stack.push(tree);
                  tree = ltree;
                  i = ltree.nodes.length;
                }
              }
              i -= 1;
            }
          } else if ("nodes" in ret_obj) { // We are unsplitting
            tree.nodes.splice(i + 1, 1); // Remove unsplit node
            // ret_obj.nodes contains a list of elements removed from the tree so far
            if (tree.nodes.length > 0) {
              RTree.Rectangle.make_MBR(tree.nodes, tree);
            }
            for (var t = 0; t < ret_obj.nodes.length; t++) {
              _insert_subtree(ret_obj.nodes[t], tree);
            }
            ret_obj.nodes.length = 0;
            if (hit_stack.length === 0 && tree.nodes.length <= 1) { // Underflow..on root!
              ret_obj.nodes = _search_subtree(tree, true, ret_obj.nodes, tree);
              tree.nodes.length = 0;
              hit_stack.push(tree);
              count_stack.push(1);
            } else if (hit_stack.length > 0 && tree.nodes.length < _Min_Width) { // Underflow..AGAIN!
              ret_obj.nodes = _search_subtree(tree, true, ret_obj.nodes, tree);
              tree.nodes.length = 0;
            } else {
              delete ret_obj.nodes; // Just start resizing
            }
          } else { // we are just resizing
            RTree.Rectangle.make_MBR(tree.nodes, tree);
          }
          current_depth -= 1;
        } while (hit_stack.length > 0);

        return (ret_array);
        };

   /* choose the best damn node for rectangle to be inserted into
    * [ leaf node parent ] = _choose_leaf_subtree(rectangle, root to start search at)
    * @private
    */
    var _choose_leaf_subtree = function(rect, root) {
        var best_choice_index = -1;
        var best_choice_stack = [];
        var best_choice_area;

        var load_callback = function(local_tree, local_node) {
            return function(data) {
              local_tree._attach_data(local_node, data);
            };
        };

        best_choice_stack.push(root);
        var nodes = root.nodes;

        do {
          if (best_choice_index !== -1) {
            best_choice_stack.push(nodes[best_choice_index]);
            nodes = nodes[best_choice_index].nodes;
            best_choice_index = -1;
          }

          for (var i = nodes.length - 1; i >= 0; i--) {
            var ltree = nodes[i];
            if ("leaf" in ltree) {
              // Bail out of everything and start inserting
              best_choice_index = -1;
              break;
            }

            // Area of new enlarged rectangle
            var old_lratio = RTree.Rectangle.squarified_ratio(ltree.w, ltree.h, ltree.nodes.length + 1);

            // Enlarge rectangle to fit new rectangle
            var nw = Math.max(ltree.x + ltree.w, rect.x + rect.w) - Math.min(ltree.x, rect.x);
            var nh = Math.max(ltree.y + ltree.h, rect.y + rect.h) - Math.min(ltree.y, rect.y);

            // Area of new enlarged rectangle
            var lratio = RTree.Rectangle.squarified_ratio(nw, nh, ltree.nodes.length + 2);

            if (best_choice_index < 0 || Math.abs(lratio - old_lratio) < best_choice_area) {
              best_choice_area = Math.abs(lratio - old_lratio);
              best_choice_index = i;
            }
          }
        } while (best_choice_index !== -1);

        return (best_choice_stack);
        };

   /* split a set of nodes into two roughly equally-filled nodes
    * [ an array of two new arrays of nodes ] = linear_split(array of nodes)
    * @private
    */
    var _linear_split = function(nodes) {
        var n = _pick_linear(nodes);
        while (nodes.length > 0) {
          _pick_next(nodes, n[0], n[1]);
        }
        return (n);
        };

   /* insert the best source rectangle into the best fitting parent node: a or b
    * [] = pick_next(array of source nodes, target node array a, target node array b)
    * @private
    */
    var _pick_next = function(nodes, a, b) {
        // Area of new enlarged rectangle
        var area_a = RTree.Rectangle.squarified_ratio(a.w, a.h, a.nodes.length + 1);
        var area_b = RTree.Rectangle.squarified_ratio(b.w, b.h, b.nodes.length + 1);
        var high_area_delta;
        var high_area_node;
        var lowest_growth_group;

        for (var i = nodes.length - 1; i >= 0; i--) {
          var l = nodes[i];
          var new_area_a = {};
          new_area_a.x = Math.min(a.x, l.x);
          new_area_a.y = Math.min(a.y, l.y);
          new_area_a.w = Math.max(a.x + a.w, l.x + l.w) - new_area_a.x;
          new_area_a.h = Math.max(a.y + a.h, l.y + l.h) - new_area_a.y;
          var change_new_area_a = Math.abs(RTree.Rectangle.squarified_ratio(new_area_a.w, new_area_a.h, a.nodes.length + 2) - area_a);

          var new_area_b = {};
          new_area_b.x = Math.min(b.x, l.x);
          new_area_b.y = Math.min(b.y, l.y);
          new_area_b.w = Math.max(b.x + b.w, l.x + l.w) - new_area_b.x;
          new_area_b.h = Math.max(b.y + b.h, l.y + l.h) - new_area_b.y;
          var change_new_area_b = Math.abs(RTree.Rectangle.squarified_ratio(new_area_b.w, new_area_b.h, b.nodes.length + 2) - area_b);

          if (!high_area_node || !high_area_delta || Math.abs(change_new_area_b - change_new_area_a) < high_area_delta) {
            high_area_node = i;
            high_area_delta = Math.abs(change_new_area_b - change_new_area_a);
            lowest_growth_group = change_new_area_b < change_new_area_a ? b : a;
          }
        }
        var temp_node = nodes.splice(high_area_node, 1)[0];
        if (a.nodes.length + nodes.length + 1 <= _Min_Width) {
          a.nodes.push(temp_node);
          RTree.Rectangle.expand_rectangle(a, temp_node);
        } else if (b.nodes.length + nodes.length + 1 <= _Min_Width) {
          b.nodes.push(temp_node);
          RTree.Rectangle.expand_rectangle(b, temp_node);
        } else {
          lowest_growth_group.nodes.push(temp_node);
          RTree.Rectangle.expand_rectangle(lowest_growth_group, temp_node);
        }
        };

   /* pick the "best" two starter nodes to use as seeds using the "linear" criteria
    * [ an array of two new arrays of nodes ] = pick_linear(array of source nodes)
    * @private
    */
    var _pick_linear = function(nodes) {
        var lowest_high_x = nodes.length - 1;
        var highest_low_x = 0;
        var lowest_high_y = nodes.length - 1;
        var highest_low_y = 0;
        var t1, t2;

        for (var i = nodes.length - 2; i >= 0; i--) {
          var l = nodes[i];
          if (l.x > nodes[highest_low_x].x) {
            highest_low_x = i;
          } else if (l.x + l.w < nodes[lowest_high_x].x + nodes[lowest_high_x].w) {
            lowest_high_x = i;
          }
          if (l.y > nodes[highest_low_y].y) {
            highest_low_y = i;
          } else if (l.y + l.h < nodes[lowest_high_y].y + nodes[lowest_high_y].h) {
            lowest_high_y = i;
          }
        }
        var dx = Math.abs((nodes[lowest_high_x].x + nodes[lowest_high_x].w) - nodes[highest_low_x].x);
        var dy = Math.abs((nodes[lowest_high_y].y + nodes[lowest_high_y].h) - nodes[highest_low_y].y);
        if (dx > dy) {
          if (lowest_high_x > highest_low_x) {
            t1 = nodes.splice(lowest_high_x, 1)[0];
            t2 = nodes.splice(highest_low_x, 1)[0];
          } else {
            t2 = nodes.splice(highest_low_x, 1)[0];
            t1 = nodes.splice(lowest_high_x, 1)[0];
          }
        } else {
          if (lowest_high_y > highest_low_y) {
            t1 = nodes.splice(lowest_high_y, 1)[0];
            t2 = nodes.splice(highest_low_y, 1)[0];
          } else {
            t2 = nodes.splice(highest_low_y, 1)[0];
            t1 = nodes.splice(lowest_high_y, 1)[0];
          }
        }
        return ([{
          x: t1.x,
          y: t1.y,
          w: t1.w,
          h: t1.h,
          nodes: [t1]
        }, {
          x: t2.x,
          y: t2.y,
          w: t2.w,
          h: t2.h,
          nodes: [t2]
        }]);
        };

    var _attach_data = function(node, more_tree) {
        node.nodes = more_tree.nodes;
        node.x = more_tree.x;
        node.y = more_tree.y;
        node.w = more_tree.w;
        node.h = more_tree.h;
        return (node);
    };

   /* non-recursive internal search function
    * [ nodes | objects ] = _search_subtree(rectangle, [return node data], [array to fill], root to begin search at)
    * @private
    */
    var _search_subtree = function(rect, return_node, return_array, root) {
      var hit_stack = []; // Contains the elements that overlap
      if (!RTree.Rectangle.overlap_rectangle(rect, root)) {
        return return_array;
      }

      var load_callback = function(local_tree, local_node) {
          return function(data) {
            local_tree._attach_data(local_node, data);
          };
      };

      hit_stack.push(root.nodes);

      do {
        var nodes = hit_stack.pop();

        for (var i = nodes.length - 1; i >= 0; i--) {
          var ltree = nodes[i];
          if (RTree.Rectangle.overlap_rectangle(rect, ltree)) {
            if ("nodes" in ltree) { // Not a Leaf
              hit_stack.push(ltree.nodes);
            } else if ("leaf" in ltree) { // A Leaf !!
              if (!return_node) {
                return_array.push(ltree.leaf);
              } else {
                return_array.push(ltree);
              }
            }
          }
        }
      } while (hit_stack.length > 0);

      return return_array;
    };

   /* non-recursive internal insert function
    * [] = _insert_subtree(rectangle, object to insert, root to begin insertion at)
    * @private
    */
    var _insert_subtree = function(node, root) {
      var bc; // Best Current node
      // Initial insertion is special because we resize the Tree and we don't
      // care about any overflow (seriously, how can the first object overflow?)
      if (root.nodes.length === 0) {
        root.x = node.x;
        root.y = node.y;
        root.w = node.w;
        root.h = node.h;
        root.nodes.push(node);
        return;
      }

      // Find the best fitting leaf node
      // choose_leaf returns an array of all tree levels (including root)
      // that were traversed while trying to find the leaf
      var tree_stack = _choose_leaf_subtree(node, root);
      var ret_obj = node; //{x:rect.x,y:rect.y,w:rect.w,h:rect.h, leaf:obj};
      // Walk back up the tree resizing and inserting as needed
      do {
        //handle the case of an empty node (from a split)
        if (bc && "nodes" in bc && bc.nodes.length === 0) {
          var pbc = bc; // Past bc
          bc = tree_stack.pop();
          for (var t = 0; t < bc.nodes.length; t++) {
            if (bc.nodes[t] === pbc || bc.nodes[t].nodes.length === 0) {
              bc.nodes.splice(t, 1);
              break;
            }
          }
        } else {
          bc = tree_stack.pop();
        }

        // If there is data attached to this ret_obj
        if ("leaf" in ret_obj || "nodes" in ret_obj || isArray(ret_obj)) {
          // Do Insert
          if (isArray(ret_obj)) {
            for (var ai = 0; ai < ret_obj.length; ai++) {
              RTree.Rectangle.expand_rectangle(bc, ret_obj[ai]);
            }
            bc.nodes = bc.nodes.concat(ret_obj);
          } else {
            RTree.Rectangle.expand_rectangle(bc, ret_obj);
            bc.nodes.push(ret_obj); // Do Insert
          }

          if (bc.nodes.length <= _Max_Width) { // Start Resizeing Up the Tree
            ret_obj = {
              x: bc.x,
              y: bc.y,
              w: bc.w,
              h: bc.h
            };
          } else { // Otherwise Split this Node
            // linear_split() returns an array containing two new nodes
            // formed from the split of the previous node's overflow
            var a = _linear_split(bc.nodes);
            ret_obj = a; //[1];
            if (tree_stack.length < 1) { // If are splitting the root..
              bc.nodes.push(a[0]);
              tree_stack.push(bc); // Reconsider the root element
              ret_obj = a[1];
            }
          }
        } else { // Otherwise Do Resize
          //Just keep applying the new bounding rectangle to the parents..
          RTree.Rectangle.expand_rectangle(bc, ret_obj);
          ret_obj = {
            x: bc.x,
            y: bc.y,
            w: bc.w,
            h: bc.h
          };
        }
      } while (tree_stack.length > 0);
    };

   /* returns a JSON representation of the tree
    * @public
    */
    this.serialize = function(callback) {
      var dfd = new Terraformer.Deferred();
      if(callback){
        dfd.then(function(result){
          callback(null, result);
        }, function(error){
          callback(error, null);
        });
      }
      dfd.resolve(_T);
      return dfd;
    };

   /* accepts a JSON representation of the tree and inserts it
    * @public
    */
    this.deserialize = function(new_tree, where, callback) {

      var args = Array.prototype.slice.call(arguments);
      var dfd = new Terraformer.Deferred();

      switch (args.length) {
      case 1:
        where = _T;
        break;
      case 2:
        if(typeof args[1] === "function"){
          where = _T;
          callback = args[1];
        }
        break;
      }

      if(callback){
        dfd.then(function(result){
          callback(null, result);
        }, function(error){
          callback(error, null);
        });
      }

      dfd.resolve(_attach_data(where, new_tree));

      return dfd;
    };

   /* non-recursive search function
    * [ nodes | objects ] = RTree.search(rectangle, [return node data], [array to fill])
    * @public
    */

    this.search = function(shape, callback) {
      var rect;
      if(shape.type){
        var b = Terraformer.Tools.calculateBounds(shape);
        rect = {
          x: b[0],
          y: b[1],
          w: Math.abs(b[0] - b[2]),
          h: Math.abs(b[1] - b[3])
        };
      } else {
        rect = shape;
      }

      var dfd = new Terraformer.Deferred();

      var args = [ rect, false, [ ], _T ];

      if (rect === undefined) {
        throw "Wrong number of arguments. RT.Search requires at least a bounding rectangle.";
      }

      if(callback){
        dfd.then(function(result){
          callback(null, result);
        }, function(error){
          callback(error, null);
        });
      }

      dfd.resolve(_search_subtree.apply(this, args));

      return dfd;
    };


   /* non-recursive function that deletes a specific
    * [ number ] = RTree.remove(rectangle, obj)
    */
    this.remove = function(shape, obj, callback) {
      var args = Array.prototype.slice.call(arguments);
      var dfd = new Terraformer.Deferred();

      // you only passed shape
      if(args.length === 1){
        // so make the args (shape, false)
        args.push(false);
      }

      // you passed (shape, obj, callback)
      // pop the callback off the args list
      if(args.length === 3){
        callback = args.pop();
        dfd.then(function(result){
          callback(null, result);
        }, function(error){
          callback(error, null);
        });
      }

      // convert shape (the first arg) to a bbox if its geojson
      if(args[0].type){
        var b = Terraformer.Tools.calculateBounds(shape);
        args[0] = {
          x: b[0],
          y: b[1],
          w: Math.abs(b[0] - b[2]),
          h: Math.abs(b[1] - b[3])
        };
      }

      // push a new root node onto the args stack
      args.push(_T);

      if(obj === false) { // Do area-wide delete
        var numberdeleted = 0;
        var ret_array = [];
        do {
          numberdeleted = ret_array.length;
          ret_array = ret_array.concat(_remove_subtree.apply(this, args));
        } while( numberdeleted !==  ret_array.length);
        return ret_array;
      } else { // Delete a specific item
        return(_remove_subtree.apply(this, args));
      }
    };

   /* non-recursive insert function
    * [] = RTree.insert(rectangle, object to insert)
    */
    this.insert = function(shape, obj, callback) {
      var rect;
      if(shape.type){
        var b = Terraformer.Tools.calculateBounds(shape);
        rect = {
          x: b[0],
          y: b[1],
          w: Math.abs(b[0] - b[2]),
          h: Math.abs(b[1] - b[3])
        };
      } else {
        rect = shape;
      }

      var dfd = new Terraformer.Deferred();

      if (arguments.length < 2) {
        throw "Wrong number of arguments. RT.Insert requires at least a bounding rectangle or GeoJSON and an object.";
      }

      if(callback){
        dfd.then(function(result){
          callback(null, result);
        }, function(error){
          callback(error, null);
        });
      }

      dfd.resolve(_insert_subtree({
        x: rect.x,
        y: rect.y,
        w: rect.w,
        h: rect.h,
        leaf: obj
      }, _T));

      return dfd;
    };

   /* non-recursive delete function
    * [deleted object] = RTree.remove(rectangle, [object to delete])
    */

    //End of RTree
    };

/* Rectangle - Generic rectangle object - Not yet used */
RTree.Rectangle = function(ix, iy, iw, ih) { // new Rectangle(bounds) or new Rectangle(x, y, w, h)
  var x, x2, y, y2, w, h;

  if (ix.x) {
    x = ix.x;
    y = ix.y;
    if (ix.w !== 0 && !ix.w && ix.x2) {
      w = ix.x2 - ix.x;
      h = ix.y2 - ix.y;
    } else {
      w = ix.w;
      h = ix.h;
    }
    x2 = x + w;
    y2 = y + h; // For extra fastitude
  } else {
    x = ix;
    y = iy;
    w = iw;
    h = ih;
    x2 = x + w;
    y2 = y + h; // For extra fastitude
  }

  this.x1 = this.x = function() {
    return x;
  };
  this.y1 = this.y = function() {
    return y;
  };
  this.x2 = function() {
    return x2;
  };
  this.y2 = function() {
    return y2;
  };
  this.w = function() {
    return w;
  };
  this.h = function() {
    return h;
  };

  this.toJSON = function() {
    return ('{"x":' + x.toString() + ', "y":' + y.toString() + ', "w":' + w.toString() + ', "h":' + h.toString() + '}');
  };

  this.overlap = function(a) {
    return (this.x() < a.x2() && this.x2() > a.x() && this.y() < a.y2() && this.y2() > a.y());
  };

  this.expand = function(a) {
    var nx = Math.min(this.x(), a.x());
    var ny = Math.min(this.y(), a.y());
    w = Math.max(this.x2(), a.x2()) - nx;
    h = Math.max(this.y2(), a.y2()) - ny;
    x = nx;
    y = ny;
    return (this);
  };

  this.setRect = function(ix, iy, iw, ih) {
    var x, x2, y, y2, w, h;
    if (ix.x) {
      x = ix.x;
      y = ix.y;
      if (ix.w !== 0 && !ix.w && ix.x2) {
        w = ix.x2 - ix.x;
        h = ix.y2 - ix.y;
      } else {
        w = ix.w;
        h = ix.h;
      }
      x2 = x + w;
      y2 = y + h; // For extra fastitude
    } else {
      x = ix;
      y = iy;
      w = iw;
      h = ih;
      x2 = x + w;
      y2 = y + h; // For extra fastitude
    }
  };
  //End of RTree.Rectangle
};

/* returns true if rectangle 1 overlaps rectangle 2
 * [ boolean ] = overlap_rectangle(rectangle a, rectangle b)
 * @static function
 */
RTree.Rectangle.overlap_rectangle = function(a, b) {
  return (a.x < (b.x + b.w) && (a.x + a.w) > b.x && a.y < (b.y + b.h) && (a.y + a.h) > b.y);
};

/* returns true if rectangle a is contained in rectangle b
 * [ boolean ] = contains_rectangle(rectangle a, rectangle b)
 * @static function
 */
RTree.Rectangle.contains_rectangle = function(a, b) {
  return ((a.x + a.w) <= (b.x + b.w) && a.x >= b.x && (a.y + a.h) <= (b.y + b.h) && a.y >= b.y);
};

/* expands rectangle A to include rectangle B, rectangle B is untouched
 * [ rectangle a ] = expand_rectangle(rectangle a, rectangle b)
 * @static function
 */
RTree.Rectangle.expand_rectangle = function(a, b) {
  var nx, ny;

  // unintuitively, this is way way faster than max/min
  if (a.x < b.x) {
    nx = a.x;
  } else {
    nx = b.x;
  }

  if (a.y < b.y) {
    ny = a.y;
  } else {
    ny = b.y;
  }

  if (a.x + a.w > b.x + b.w) {
    a.w = (a.x + a.w) - nx;
  } else {
    a.w = (b.x + b.w) - nx;
  }

  if (a.y + a.h > b.y + b.h) {
    a.h = (a.y + a.h) - ny;
  } else {
    a.h = (b.y + b.h) - ny;
  }

  a.x = nx;
  a.y = ny;

  return (a);
};

/* generates a minimally bounding rectangle for all rectangles in
 * array "nodes". If rect is set, it is modified into the MBR. Otherwise,
 * a new rectangle is generated and returned.
 * [ rectangle a ] = make_MBR(rectangle array nodes, rectangle rect)
 * @static function
 */
RTree.Rectangle.make_MBR = function(nodes, rect) {
  if (nodes.length < 1) {
    return ({
      x: 0,
      y: 0,
      w: 0,
      h: 0
    });
  }
  //throw "make_MBR: nodes must contain at least one rectangle!";
  if (!rect) {
    rect = {
      x: nodes[0].x,
      y: nodes[0].y,
      w: nodes[0].w,
      h: nodes[0].h
    };
  } else {
    rect.x = nodes[0].x;
    rect.y = nodes[0].y;
    rect.w = nodes[0].w;
    rect.h = nodes[0].h;
  }

  for (var i = nodes.length - 1; i > 0; i--) {
    RTree.Rectangle.expand_rectangle(rect, nodes[i]);
  }

  return (rect);
};


  exports.RTree = RTree;

  return exports;
}));
/* globals Terraformer */
(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(["terraformer/terraformer"],factory);
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = {};
    }
    root.Terraformer.ArcGIS = factory();
  }

}(this, function() {
  var exports = {};
  var Terraformer;

  // Local Reference To Browser Global
  if(typeof this.navigator === "object") {
    Terraformer = this.Terraformer;
  }

  // Setup Node Dependencies
  if(typeof module === 'object' && typeof module.exports === 'object') {
    Terraformer = require('terraformer');
  }

  // Setup AMD Dependencies
  if(arguments[0] && typeof define === 'function' && define.amd) {
    Terraformer = arguments[0];
  }

  // determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
  // or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
  // points-are-in-clockwise-order
  function ringIsClockwise(ringToTest) {
    var total = 0,i = 0;
    var rLength = ringToTest.length;
    var pt1 = ringToTest[i];
    var pt2;
    for (i; i < rLength - 1; i++) {
      pt2 = ringToTest[i + 1];
      total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
      pt1 = pt2;
    }
    return (total >= 0);
  }

  // This function flattens holes in polygons to one array of rings
  //
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  // becomes
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  function flattenPolygonRings(polygon){
    var output = [];
    var outerRing = polygon.shift();

    if(!ringIsClockwise(outerRing)){
      outerRing.reverse();
    }

    output.push(outerRing);

    for (var i = 0; i < polygon.length; i++) {
      var hole = polygon[i];
      if(ringIsClockwise(hole)){
        outerRing.reverse();
      }
      output.push(polygon[i]);
    }

    return output;
  }

  // This function flattens holes in multipolygons to one array of polygons
  // so
  // [
  //   [
  //     [ array of outer coordinates ]
  //     [ hole coordinates ]
  //     [ hole coordinates ]
  //   ],
  //   [
  //     [ array of outer coordinates ]
  //     [ hole coordinates ]
  //     [ hole coordinates ]
  //   ],
  // ]
  // becomes
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  function flattenMultiPolygonRings(rings){
    var output = [];
    for (var i = 0; i < rings.length; i++) {
      var polygon = flattenPolygonRings(rings[i]);
      for (var x = polygon.length - 1; x >= 0; x--) {
        var ring = polygon[x];
        output.push(ring);
      }
      output.push();
    }
    return output;
  }

  function coordinatesContainCoordinates(outer, inner){
    var intersects = Terraformer.Tools.arrayIntersectsArray(outer, inner);
    var contains = Terraformer.Tools.coordinatesContainPoint(outer, inner[0]);
    if(!intersects && contains){
      return true;
    }
    return false;
  }

  // do any polygons in this array contain any other polygons in this array?
  // used for checking for holes in arcgis rings
  function convertRingsToGeoJSON(rings){
    var outerRings = [];
    var holes = [];

    // for each ring
    for (var r = 0; r < rings.length; r++) {
      var ring = rings[r];

      // is this ring an outer ring? is it clockwise?
      if(ringIsClockwise(ring)){
        var polygon = [ ring ];
        outerRings.push(polygon); // push to outer rings
      } else {
        holes.push(ring); // counterclockwise push to holes
      }
    }

    // while there are holes left...
    while(holes.length){
      // pop a hole off out stack
      var hole = holes.pop();
      var matched = false;

      // loop over all outer rings and see if they contain our hole.
      for (var x = outerRings.length - 1; x >= 0; x--) {
        var outerRing = outerRings[x][0];
        if(coordinatesContainCoordinates(outerRing, hole)){
          // the hole is contained push it into our polygon
          outerRings[x].push(hole);

          // we matched the hole
          matched = true;

          // stop checking to see if other outer rings contian this hole
          break;
        }
      }

      // no outer rings contain this hole turn it into and outer ring (reverse it)
      if(!matched){
        outerRings.push([ hole.reverse() ]);
      }
    }

    if(outerRings.length === 1){
      return {
        type: "Polygon",
        coordinates: outerRings[0]
      };
    } else {
      return {
        type: "MultiPolygon",
        coordinates: outerRings
      };
    }
  }

  // ArcGIS -> GeoJSON
  function parse(input){
    var arcgis = JSON.parse(JSON.stringify(input));
    var geojson = {};

    if(arcgis.x && arcgis.y){
      geojson.type = "Point";
      geojson.coordinates = [arcgis.x, arcgis.y];
    }

    if(arcgis.points){
      geojson.type = "MultiPoint";
      geojson.coordinates = arcgis.points;
    }

    if(arcgis.paths) {
      if(arcgis.paths.length === 1){
        geojson.type = "LineString";
        geojson.coordinates = arcgis.paths[0];
      } else {
        geojson.type = "MultiLineString";
        geojson.coordinates = arcgis.paths;
      }
    }

    if(arcgis.rings) {
      geojson = convertRingsToGeoJSON(arcgis.rings);
    }

    if(arcgis.geometry) {
      geojson.type = "Feature";
      geojson.geometry = parse(arcgis.geometry);
      geojson.properties = arcgis.attributes || {};
    }

    var inputSpatialReference = (arcgis.geometry) ? arcgis.geometry.spatialReference : arcgis.spatialReference;

    //convert spatial ref if needed
    if(inputSpatialReference && inputSpatialReference.wkid === 102100){
      geojson = Terraformer.toGeographic(geojson);
    }

    return new Terraformer.Primitive(geojson);
  }

  // GeoJSON -> ArcGIS
  function convert(input){
    var geojson = JSON.parse(JSON.stringify(input));
    var spatialReference = { wkid: 4326 };
    var result = {};
    var i;

    switch(geojson.type){
    case "Point":
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      result.spatialReference = spatialReference;
      break;
    case "MultiPoint":
      result.points = geojson.coordinates;
      result.spatialReference = spatialReference;
      break;
    case "LineString":
      result.paths = [geojson.coordinates];
      result.spatialReference = spatialReference;
      break;
    case "MultiLineString":
      result.paths = geojson.coordinates;
      result.spatialReference = spatialReference;
      break;
    case "Polygon":
      result.rings = flattenPolygonRings(geojson.coordinates);
      result.spatialReference = spatialReference;
      break;
    case "MultiPolygon":
      result.rings = flattenMultiPolygonRings(geojson.coordinates);
      result.spatialReference = spatialReference;
      break;
    case "Feature":
      result.geometry = convert(geojson.geometry);
      result.attributes = geojson.properties;
      break;
    case "FeatureCollection":
      result = [];
      for (i = 0; i < geojson.features.length; i++){
        result.push(convert(geojson.features[i]));
      }
      break;
    case "GeometryCollection":
      result = [];
      for (i = 0; i < geojson.geometries.length; i++){
        result.push(convert(geojson.geometries[i]));
      }
      break;
    }

    return result;
  }

  exports.parse   = parse;
  exports.convert = convert;

  return exports;
}));
/* globals L */

L.esri = {
  _callback: {}
};

// Namespace for various support variables we need to track
L.esri.Support = {
  // from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js#L20
  CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest())
};

// AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
L.esri.RequestHandlers = {
  CORS: function(url, params, callback, context){
    var httpRequest = new XMLHttpRequest();

    params.f="json";

    httpRequest.onreadystatechange = function(){
      var response;
      if (httpRequest.readyState === 4) {
        try {
          response = JSON.parse(httpRequest.responseText);
        } catch(e) {
          response = {
            error: "Could not parse response as JSON."
          };
        }
        if(context){
          callback.call(context, response);
        } else {
          callback(response);
        }
      }
    };

    httpRequest.open('GET', url + L.esri.Util.serialize(params), true);
    httpRequest.send(null);
  },
  JSONP: function(url, params, callback, context){
    var callbackId = "c"+(Math.random() * 1e9).toString(36).replace(".", "_");

    params.f="json";
    params.callback="L.esri._callback."+callbackId;

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + L.esri.Util.serialize(params);
    script.id = callbackId;

    L.esri._callback[callbackId] = function(response){
      if(context){
        callback.call(context, response);
      } else {
        callback(response);
      }
      document.body.removeChild(script);
      delete L.esri._callback[callbackId];
    };

    document.body.appendChild(script);
  }
};

// Choose the correct AJAX handler depending on CORS support
L.esri.get = (L.esri.Support.CORS) ? L.esri.RequestHandlers.CORS : L.esri.RequestHandlers.JSONP;

// General utility namespace
L.esri.Util = {
  // make it so that passed `function` never gets called
  // twice within `delay` milliseconds. Used to throttle
  // `move` events on the layer.
  // http://remysharp.com/2010/07/21/throttling-function-calls/
  debounce: function (fn, delay, context) {
    var timer = null;
    return function() {
      var context = this||context, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  },
  // round a number away from zero used to snap
  // row/columns away from the origin of the grid
  roundAwayFromZero: function (num){
    return (num > 0) ? Math.ceil(num) : Math.floor(num);
  },
  trim: function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },
  cleanUrl: function(url){
    url = L.esri.Util.trim(url);

    //add a trailing slash to the url if the user omitted it
    if(url[url.length-1] !== "/"){
      url += "/";
    }

    return url;
  },
  // quick and dirty serialization
  serialize: function(params){
    var qs="?";

    for(var param in params){
      if(params.hasOwnProperty(param)){
        var key = param;
        var value = params[param];
        qs+=encodeURIComponent(key);
        qs+="=";
        qs+=encodeURIComponent(value);
        qs+="&";
      }
    }

    return qs.substring(0, qs.length - 1);
  },

  // index of polyfill, needed for IE 8
  indexOf: function(arr, obj, start){
    start = start || 0;
    if(arr.indexOf){
      return arr.indexOf(obj, start);
    }
    for (var i = start, j = arr.length; i < j; i++) {
      if (arr[i] === obj) { return i; }
    }
    return -1;
  },

  // convert an extent (ArcGIS) to LatLngBounds (Leaflet)
  extentToBounds: function(extent){
    var southWest = new L.LatLng(extent.ymin, extent.xmin);
    var northEast = new L.LatLng(extent.ymax, extent.xmax);
    return new L.LatLngBounds(southWest, northEast);
  },

  // convert an LatLngBounds (Leaflet) to extent (ArcGIS)
  boundsToExtent: function(bounds) {
    return {
      "xmin": bounds.getSouthWest().lng,
      "ymin": bounds.getSouthWest().lat,
      "xmax": bounds.getNorthEast().lng,
      "ymax": bounds.getNorthEast().lat,
      "spatialReference": {
        "wkid" : 4326
      }
    };
  },

  // convert a LatLngBounds (Leaflet) to a Envelope (Terraformer.Rtree)
  boundsToEnvelope: function(bounds){
    var extent = L.esri.Util.boundsToExtent(bounds);
    return {
      x: extent.xmin,
      y: extent.ymin,
      w: Math.abs(extent.xmin - extent.xmax),
      h: Math.abs(extent.ymin - extent.ymax)
    };
  }
};

L.esri.Mixins = {};

L.esri.Mixins.featureGrid = {
  _activeRequests: 0,
  _initializeFeatureGrid: function(map){
    this._map = map;
    this._previousCells = [];
    this.center = this._map.getCenter();
    this.origin = this._map.project(this.center);

    this._moveHandler = L.esri.Util.debounce(function(e){
      if(e.type === "zoomend"){
        this.origin = this._map.project(this.center);
        this._previousCells = [];
      }
      this._requestFeatures(e.target.getBounds());
    }, this.options.debounce, this);

    map.on("zoomend resize move", this._moveHandler, this);

    this._requestFeatures(map.getBounds());
  },
  _destroyFeatureGrid: function(map){
    map.off("zoomend resize move", this._moveHandler, this);
  },
  _requestFeatures: function(bounds){
    var cells = this._cellsWithin(bounds);

    if(cells) {
      this.fire("loading", { bounds: bounds });
    }

    for (var i = 0; i < cells.length; i++) {
      this._makeRequest(cells[i], cells, bounds);
    }
  },
  _makeRequest: function(cell, cells, bounds){
    this._activeRequests++;

    L.esri.get(this.url+"query", {
      geometryType: "esriGeometryEnvelope",
      geometry: JSON.stringify(L.esri.Util.boundsToExtent(cell.bounds)),
      outFields:"*",
      outSr: 4326
    }, function(response){

      //deincriment the request counter
      this._activeRequests--;

      // if there are no more active requests fire a load event for this view
      if(this._activeRequests <= 0){
        this.fire("load", {
          bounds: bounds,
          cells: cells
        });
      }

      // call the render method to render features
      this._render(response);
    }, this);
  },
  _cellsWithin: function(mapBounds){
    var size = this._map.getSize();
    var offset = this._map.project(this._map.getCenter());
    var padding = Math.min(this.options.cellSize/size.x, this.options.cellSize/size.y);
    var bounds = mapBounds.pad(0.1);
    var cells = [];

    var topLeftPoint = this._map.project(bounds.getNorthWest());
    var bottomRightPoint = this._map.project(bounds.getSouthEast());

    var topLeft = topLeftPoint.subtract(offset).divideBy(this.options.cellSize);
    var bottomRight = bottomRightPoint.subtract(offset).divideBy(this.options.cellSize);

    var offsetRows = Math.round((this.origin.x - offset.x) / this.options.cellSize);
    var offsetCols = Math.round((this.origin.y - offset.y) / this.options.cellSize);

    var minRow = L.esri.Util.roundAwayFromZero(topLeft.x)-offsetRows;
    var maxRow = L.esri.Util.roundAwayFromZero(bottomRight.x)-offsetRows;
    var minCol = L.esri.Util.roundAwayFromZero(topLeft.y)-offsetCols;
    var maxCol = L.esri.Util.roundAwayFromZero(bottomRight.y)-offsetCols;

    for (var row = minRow; row < maxRow; row++) {
      for (var col = minCol; col < maxCol; col++) {
        var cellId = "cell:"+row+":"+col;
        var duplicate = L.esri.Util.indexOf(this._previousCells, cellId) >= 0;

        if(!duplicate || !this.options.deduplicate){
          var cellBounds = this._cellExtent(row, col);
          var cellCenter = cellBounds.getCenter();
          var radius = cellCenter.distanceTo(cellBounds.getNorthWest());
          var distance = cellCenter.distanceTo(this.center);
          var cell = {
            row: row,
            col: col,
            id: cellId,
            center: cellCenter,
            bounds: cellBounds,
            distance:distance,
            radius: radius
          };
          cells.push(cell);
          this._previousCells.push(cellId);
        }
      }
    }

    cells.sort(function (a, b) {
      return a.distance - b.distance;
    });

    return cells;
  },
  _cellExtent: function(row, col){
    var swPoint = this._cellPoint(row, col);
    var nePoint = this._cellPoint(row+1, col+1);
    var sw = this._map.unproject(swPoint);
    var ne = this._map.unproject(nePoint);
    return L.latLngBounds(sw, ne);
  },
  _cellPoint:function(row, col){
    var x = this.origin.x + (row*this.options.cellSize);
    var y = this.origin.y + (col*this.options.cellSize);
    return [x, y];
  }
};

L.esri.Mixins.identifiableLayer = {
  identify:function(latLng, options, callback){
    var defaults = {
      sr: '4265',
      mapExtent: JSON.stringify(L.esri.Util.boundsToExtent(this._map.getBounds())),
      tolerance: 3,
      geometryType: 'esriGeometryPoint',
      imageDisplay: '800,600,96',
      geometry: JSON.stringify({
        x: latLng.lng,
        y: latLng.lat,
        spatialReference: {
          wkid: 4265
        }
      })
    };

    var params;

    if (typeof options === 'function' && typeof callback === 'undefined') {
      callback = options;
      params = defaults;
    } else if (typeof options === 'object') {
      if (options.layerDefs) {
        options.layerDefs = this.parseLayerDefs(options.layerDefs);
      }

      params = L.Util.extend(defaults, options);
    }

    L.esri.get(this._url + '/identify', params, callback);
  },
  parseLayerDefs: function (layerDefs) {
    if (layerDefs instanceof Array) {
      //throw 'must be object or string';
      return '';
    }

    if (typeof layerDefs === 'object') {
      return JSON.stringify(layerDefs);
    }

    return layerDefs;
  }
};

(function(L){

  var tileProtocol = (window.location.protocol !== "https:") ? "http:" : "https:";
  var attributionStyles = "line-height:9px; text-overflow:ellipsis; white-space:nowrap;overflow:hidden; display:inline-block;";
  var logoStyles = "position:absolute; top:-38px; right:2px;";
  var attributionLogo = "<img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+logoStyles+"'>";
  var formatTextAttributions = function formatTextAttributions(text){
    return "<span class='esri-attributions' style='"+attributionStyles+"'>" + text + "</span>";
  };

  L.esri.BasemapLayer = L.TileLayer.extend({
    statics: {
      TILES: {
        Streets: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map?f=json",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Topographic: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map?f=json",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Oceans: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap?f=json",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        NationalGeographic: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Gray: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, NAVTEQ, DeLorme") + attributionLogo
          }
        },
        GrayLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"]
          }
        },
        Imagery: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community") + attributionLogo
          }
        },
        ImageryLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryTransportation: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryAlternateLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 12,
            subdomains: ["server", "services"]
          }
        },
        ShadedRelief: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("ESRI, NAVTEQ, DeLorme") + attributionLogo
          }
        }

      }
    },
    initialize: function(key, options){
      var config;
      // set the config variable with the appropriate config object
      if (typeof key === "object" && key.urlTemplate && key.options){
        config = key;
      } else if(typeof key === "string" && L.esri.BasemapLayer.TILES[key]){
        config = L.esri.BasemapLayer.TILES[key];
      } else {
        throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ImageryAlternateLabels' or 'ShadedRelief'");
      }

      // merge passed options into the config options
      var mergedOptions = L.Util.extend(config.options, options);

      // clean up our input url
      var url = L.esri.Util.cleanUrl(config.urlTemplate);

      // call the initialize method on L.TileLayer to set everything up
      L.TileLayer.prototype.initialize.call(this, url, L.Util.setOptions(this, mergedOptions));

      // if this basemap requires dynamic attribution set it up
      if(config.attributionUrl){
        var attributionUrl = L.esri.Util.cleanUrl(config.attributionUrl);
        this._dynamicAttribution = true;
        this._getAttributionData(attributionUrl);
      }
    },
    _dynamicAttribution: false,
    bounds: null,
    zoom: null,
    onAdd: function(map){
      L.TileLayer.prototype.onAdd.call(this, map);
      if(this._dynamicAttribution){
        this.on("load", this._handleTileUpdates, this);
        this._map.on("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      this._map.on("resize", this._resizeAttribution, this);
    },
    onRemove: function(map){
      if(this._dynamicAttribution){
        this.off("load", this._handleTileUpdates, this);
        this._map.off("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      this._map.off("resize", this._resizeAttribution, this);
      L.TileLayer.prototype.onRemove.call(this, map);
    },
    _handleTileUpdates: function(e){
      var newBounds;
      var newZoom;

      if(e.type === "load"){
        newBounds = this._map.getBounds();
        newZoom = this._map.getZoom();
      }

      if(e.type === "viewreset" || e.type === "dragend" || e.type ==="zoomend"){
        newBounds = e.target.getBounds();
        newZoom = e.target.getZoom();
      }

      if(this.attributionBoundingBoxes && newBounds && newZoom){
        if(!newBounds.equals(this.bounds) || newZoom !== this.zoom){
          this.bounds = newBounds;
          this.zoom = newZoom;
          this._updateMapAttribution();
        }
      }
    },
    _resizeAttribution: function(){
      var mapWidth = this._map.getSize().x;
      this._getAttributionLogo().style.display = (mapWidth < 600) ? "none":"block";
      this._getAttributionSpan().style.maxWidth =  (mapWidth* 0.75) + "px";
    },
    _getAttributionData: function(url){
      this.attributionBoundingBoxes = [];
      L.esri.get(url, {}, this._processAttributionData, this);
    },
    _processAttributionData: function(attributionData){
      for (var c = 0; c < attributionData.contributors.length; c++) {
        var contributor = attributionData.contributors[c];
        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = new L.LatLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = new L.LatLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          this.attributionBoundingBoxes.push({
            attribution: contributor.attribution,
            score: coverageArea.score,
            bounds: new L.LatLngBounds(southWest, northEast),
            minZoom: coverageArea.zoomMin,
            maxZoom: coverageArea.zoomMax
          });
        }
      }
      this.attributionBoundingBoxes.sort(function(a,b){
        if (a.score < b.score){ return -1; }
        if (a.score > b.score){ return 1; }
        return 0;
      });
      if(this.bounds){
        this._updateMapAttribution();
      }
    },
    _getAttributionSpan:function(){
      return this._map._container.querySelectorAll('.esri-attributions')[0];
    },
    _getAttributionLogo:function(){
      return this._map._container.querySelectorAll('.esri-attribution-logo')[0];
    },
    _updateMapAttribution: function(){
      var newAttributions = '';
      for (var i = 0; i < this.attributionBoundingBoxes.length; i++) {
        var attr = this.attributionBoundingBoxes[i];
        if(this.bounds.intersects(attr.bounds) && this.zoom >= attr.minZoom && this.zoom <= attr.maxZoom) {
          var attribution = this.attributionBoundingBoxes[i].attribution;
          if(newAttributions.indexOf(attribution) === -1){
            if(newAttributions.length > 0){
              newAttributions += ', ';
            }
            newAttributions += attribution;
          }
        }
      }
      this._getAttributionSpan().innerHTML = newAttributions;
      this._resizeAttribution();
    }
  });

  L.esri.basemapLayer = function(key, options){
    return new L.esri.BasemapLayer(key, options);
  };

})(L);
/* globals Terraformer, L */
(function(L){

  // toggles the visibility of a layer. Used to
  // show or hide layers that move in or out of
  // the map bounds
  function setLayerVisibility(layer, visible){
    var style = (visible) ? "block" : "none";

    if(layer._icon){
      layer._icon.style.display = style;
    }

    if(layer._shadow){
      layer._shadow.style.display = style;
    }

    if(layer._layers){
      for(var layerid in layer._layers){
        if(layer._layers.hasOwnProperty(layerid)){
          layer._layers[layerid]._container.style.display = style;
        }
      }
    }
  }

  L.esri.FeatureLayer = L.GeoJSON.extend({
    includes: L.esri.Mixins.featureGrid,
    options: {
      cellSize: 512,
      debounce: 100,
      deduplicate: true
    },
    initialize: function(url, options){
      this.index = new Terraformer.RTree();
      this.url = L.esri.Util.cleanUrl(url);
      L.Util.setOptions(this, options);

      L.esri.get(this.url, {}, function(response){
        this.fire("metadata", { metadata: response });
      }, this);

      L.GeoJSON.prototype.initialize.call(this, [], options);
    },
    onAdd: function(map){
      L.LayerGroup.prototype.onAdd.call(this, map);
      map.on("zoomend resize move", this._update, this);
      this._initializeFeatureGrid(map);
    },
    onRemove: function(map){
      map.off("zoomend resize move", this._update, this);
      L.LayerGroup.prototype.onRemove.call(this, map);
      this._destroyFeatureGrid(map);
    },
    getLayerId: function(layer){
      return layer.feature.id;
    },
    _update: function(e){
      var envelope = L.esri.Util.boundsToEnvelope(e.target.getBounds());
      this.index.search(envelope).then(L.Util.bind(function(results){
        this.eachLayer(L.Util.bind(function(layer){
          var id = layer.feature.id;
          setLayerVisibility(layer, L.esri.Util.indexOf(results, id) >= 0);
        }, this));
      }, this));
    },
    _render: function(response){
      if(response.objectIdFieldName && response.features.length && !response.error){
        var idKey = response.objectIdFieldName;
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[idKey];
          if(!this._layers[id]){
            var geojson = Terraformer.ArcGIS.parse(feature);
            geojson.id = id;
            this.index.insert(geojson,id);
            this.addData(geojson);
            var layer = this._layers[id];
            this.fire("render", {
              feature: layer,
              geojson: geojson
            });
          }
        }
      }
    }
  });

  L.esri.featureLayer = function(url, options){
    return new L.esri.FeatureLayer(url, options);
  };

})(L);
/* globals L */

L.esri.TiledMapLayer = L.TileLayer.extend({
  includes: L.esri.Mixins.identifiableLayer,
  initialize: function(url, options){
    options = options || {};

    // set the urls
    this.serviceUrl = L.esri.Util.cleanUrl(url);
    this.tileUrl = this.serviceUrl + "tile/{z}/{y}/{x}";

    //if this is looking at the AGO tiles subdomain insert the subdomain placeholder
    if(this.tileUrl.match("://tiles.arcgis.com")){
      this.tileUrl = this.tileUrl.replace("://tiles.arcgis.com", "://tiles{s}.arcgis.com");
      options.subdomains = ["1", "2", "3", "4"];
    }

    L.esri.get(this.serviceUrl, {}, function(response){
      this.fire("metadata", { metadata: response });
    }, this);

    // init layer by calling TileLayers initialize method
    L.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
  }
});

L.esri.tiledMapLayer = function(key, options){
  return new L.esri.TiledMapLayer(key, options);
};
/* globals L */

/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Sanborn Map Company, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

L.esri.DynamicMapLayer = L.ImageOverlay.extend({
  includes: L.esri.Mixins.identifiableLayer,

  defaultParams: {
    format: 'png8',
    transparent: true,
    f: 'image',
    bboxSR: 102100,
    imageSR: 102100,
    layers: '',
    opacity: 1
  },

  initialize: function (url, options) {
    this._url = L.esri.Util.cleanUrl(url);
    this._layerParams = L.Util.extend({}, this.defaultParams);

    for (var opt in options) {
      if (!this.options.hasOwnProperty(opt)) {
        this._layerParams[opt] = options[opt];
      }
    }

    delete this._layerParams.token;

    this._parseLayers();
    this._parseLayerDefs();

    L.esri.get(this._url, {}, function(response){
      this.fire("metadata", { metadata: response });
    }, this);

    L.Util.setOptions(this, options);
  },

  onAdd: function (map) {
    this._map = map;

    if (!this._image) {
      this._initImage();
    }

    map._panes.overlayPane.appendChild(this._image);

    map.on({
      'viewreset': this._reset,
      'moveend': this._update,
      'zoomend': this._zoomUpdate
    }, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    if (map.options.crs && map.options.crs.code) {
      var sr = map.options.crs.code.split(":")[1];
      this._layerParams.bboxSR = sr;
      this._layerParams.imageSR = sr;
    }

    this._reset();
    //this._update();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._image);

    map.off({
      'viewreset': this._reset,
      'moveend': this._update
    }, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  },

  _animateZoom: function (e) {
    var map = this._map,
        image = this._image,
        scale = map.getZoomScale(e.zoom),

        nw = this._map.getBounds().getNorthWest(),
        se = this._map.getBounds().getSouthEast(),

        topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
        size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
        origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

    image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
  },

  _parseLayers: function () {
    if (typeof this._layerParams.layers === 'undefined') {
      delete this._layerParams.layerOption;
      return;
    }

    var action = this._layerParams.layerOption || null,
        layers = this._layerParams.layers || null,
        verb = 'show',
        verbs = ['show', 'hide', 'include', 'exclude'];

    delete this._layerParams.layerOption;

    if (!action) {
      if (layers instanceof Array) {
        this._layerParams.layers = verb + ':' + layers.join(',');
      } else if (typeof layers === 'string') {
        var match = layers.match(':');

        if (match) {
          layers = layers.split(match[0]);
          if (Number(layers[1].split(',')[0])) {
            if (verbs.indexOf(layers[0]) !== -1) {
              verb = layers[0];
            }

            layers = layers[1];
          }
        }
        this._layerParams.layers = verb + ':' + layers;
      }
    } else {
      if (verbs.indexOf(action) !== -1) {
        verb = action;
      }

      this._layerParams.layers = verb + ':' + layers;
    }
  },

  _parseLayerDefs: function () {
    if (typeof this._layerParams.layerDefs === 'undefined') {
      return;
    }

    var layerDefs = this._layerParams.layerDefs;

    var defs = [];

    if (layerDefs instanceof Array) {
      var len = layerDefs.length;
      for (var i = 0; i < len; i++) {
        if (layerDefs[i]) {
          defs.push(i + ':' + layerDefs[i]);
        }
      }
    } else if (typeof layerDefs === 'object') {
      for (var layer in layerDefs) {
        if(layerDefs.hasOwnProperty(layer)){
          defs.push(layer + ':' + layerDefs[layer]);
        }
      }
    } else {
      delete this._layerParams.layerDefs;
      return;
    }
    this._layerParams.layerDefs = defs.join(';');
  },

  _initImage: function () {
    this._image = L.DomUtil.create('img', 'leaflet-image-layer');

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    L.Util.extend(this._image, {
      galleryimg: 'no',
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.Util.bind(this._onImageLoad, this),
      src: this._getImageUrl()
    });
  },

  _getImageUrl: function () {
    var bounds = this._map.getBounds(),
        size = this._map.getSize(),
        ne = this._map.options.crs.project(bounds._northEast),
        sw = this._map.options.crs.project(bounds._southWest);

    this._layerParams.bbox = [sw.x, sw.y, ne.x, ne.y].join(',');
    this._layerParams.size = size.x + ',' + size.y;

    var url = this._url + 'export' + L.Util.getParamString(this._layerParams);

    if (typeof this.options.token !== 'undefined'){
      url = url + '&token=' + this.options.token;
    }

    return url;
  },

  _update: function (e) {
    if (this._map._panTransition && this._map._panTransition._inProgress) {
      return;
    }

    var zoom = this._map.getZoom();
    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return;
    }

    this._newImage = L.DomUtil.create('img', 'leaflet-image-layer');

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._newImage, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._newImage, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    L.Util.extend(this._newImage, {
      galleryimg: 'no',
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.Util.bind(this._onNewImageLoad, this),
      src: this._getImageUrl()
    });
  },

  _updateOpacity: function(){
    L.DomUtil.setOpacity(this._image, this.options.opacity);
    if(this._newImage){
      L.DomUtil.setOpacity(this._newImage, this.options.opacity);
    }
  },

  _zoomUpdate: function (e) {
    //console.log(e);
    //console.log(this._image);
    //console.log(this._newImage);
  },

  _onNewImageLoad: function () {
    var bounds = this._map.getBounds(),
        nw = L.latLng(bounds._northEast.lat, bounds._southWest.lng),
        se = L.latLng(bounds._southWest.lat, bounds._northEast.lng);

    var topLeft = this._map.latLngToLayerPoint(nw),
        size = this._map.latLngToLayerPoint(se)._subtract(topLeft);
    L.DomUtil.setPosition(this._newImage, topLeft);
    this._newImage.style.width = size.x + 'px';
    this._newImage.style.height = size.y + 'px';

    // this._map._panes.overlayPane.appendChild(this._newImage);
    // this._map._panes.overlayPane.removeChild(this._image);

    if (this._image == null) {
      this._map._panes.overlayPane.appendChild(this._newImage);
    } else {
      this._map._panes.overlayPane.insertBefore(this._newImage,this._image);
    }
    this._map._panes.overlayPane.removeChild(this._image);

    this._image = this._newImage;
    this._newImage = null;
  },

  _onImageLoad: function () {
    this.fire('load');
      //if (this._image.style.display == 'none') {
      //  this._image.style.display = 'block';
      //}
  },

  _reset: function () {
    return;
  }
});

L.esri.dynamicMapLayer = function (url, options) {
  return new L.esri.DynamicMapLayer(url, options);
};