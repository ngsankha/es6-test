function assertEq(a, b, cx) {
  var leftChain, rightChain;
  function compare2Objects (x, y) {
    var p;
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number')
      return true;

    if (x === y)
      return true;

    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    if (!(x instanceof Object && y instanceof Object))
        return false;

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x))
      return false;

    if (x.constructor !== y.constructor)
      return false;

    if (x.prototype !== y.prototype)
      return false;

    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1)
      return false;

    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p))
        return false;
      else if (typeof y[p] !== typeof x[p])
        return false;
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p))
        return false;
      else if (typeof y[p] !== typeof x[p])
        return false;

        switch (typeof (x[p])) {
          case 'object':
          case 'function':
            leftChain.push(x);
            rightChain.push(y);
            if (!compare2Objects (x[p], y[p]))
              return false;
            leftChain.pop();
            rightChain.pop();
            break;

          default:
            if (x[p] !== y[p])
              return false;
            break;
        }
    }
    return true;
  }
  leftChain = [];
  rightChain = [];

  if (!compare2Objects(a, b))
    throw Error("Assertion failed in " + cx + " : " + a + " === " + b);
}

function raiseImplError(obj) {
  throw new Error("Invalid implementation: " + obj);
}

function testMap() {
  try {
    var m = new Map([[1, 'a'], [2, 'b']]);
    m.size ? assertEq(m.size, 2, "Map.prototype.size") : raiseImplError("Map.prototype.size");
    m.get ? assertEq(m.get(1), 'a', "Map.prototype.get()") : raiseImplError("Map.prototype.get()");
    m.has ? assertEq(m.has(1), true, "Map.prototype.has()") : raiseImplError("Map.prototype.has()");
    m.set ? m.set(3, 'c') : raiseImplError("Map.prototype.set()");
    if (m.delete) {
      m.delete(2);
      assertEq(m.has(2), false, "Map.prototype.delete()");
    } else
      raiseImplError("Map.prototype.delete()");

    var it;
    if (m.entries) {
      it = m.entries();
      assertEq(it.next(), {value: [1, 'a'], done: false}, "Map.prototype.entries()");
      assertEq(it.next(), {value: [3, 'c'], done: false}, "Map.prototype.entries()");
      assertEq(it.next(), {value: undefined, done: true}, "Map.prototype.entries()");
    } else
      raiseImplError("Map.prototype.entries()");

    if (m.keys) {
      it = m.keys();
      assertEq(it.next(), {value: 1, done: false}, "Map.prototype.keys()");
      assertEq(it.next(), {value: 3, done: false}, "Map.prototype.keys()");
      assertEq(it.next(), {value: undefined, done: true}, "Map.prototype.keys()");
    } else
      raiseImplError("Map.prototype.keys()");

    if (m.values) {
      it = m.values();
      assertEq(it.next(), {value: 'a', done: false}, "Map.prototype.values()");
      assertEq(it.next(), {value: 'c', done: false}, "Map.prototype.values()");
      assertEq(it.next(), {value: undefined, done: true}, "Map.prototype.values()");
    } else
      raiseImplError("Map.prototype.values()");

    if (m.clear) {
      m.clear();
      assertEq(m.has(1), false, "Map.prototype.clear()");
    } else
    raiseImplError("Map.prototype.clear()")
  } catch (e) {
    console.error(e.message);
  }
}

function testSet() {
  /* TODO: Add complete tests for Set */
  try {
    var s = new Set([1, 'a']);
    s.size ? assertEq(s.size, 2, "Set.prototype.size") : raiseImplError("Set.prototype.size");
    s.has ? assertEq(s.has(1), true, "Set.prototype.has()") : raiseImplError("Map.prototype.has()");
  } catch (e) {
    console.error(e.message);
  }
}

function testStringPrototypeContains() {
  try {
    assertEq("abc".contains("a"), true, methods[8][0]);
    assertEq("abc".contains("b"), true, methods[8][0]);
    assertEq("abc".contains("abc"), true, methods[8][0]);
    assertEq("abc".contains("bc"), true, methods[8][0]);
    assertEq("abc".contains("d"), false, methods[8][0]);
    assertEq("abc".contains("abcd"), false, methods[8][0]);
    assertEq("abc".contains("ac"), false, methods[8][0]);
    assertEq("abc".contains("abc", 0), true, methods[8][0]);
    assertEq("abc".contains("bc", 0), true, methods[8][0]);
    assertEq("abc".contains("de", 0), false, methods[8][0]);
    assertEq("abc".contains("bc", 1), true, methods[8][0]);
    assertEq("abc".contains("c", 1), true, methods[8][0]);
    assertEq("abc".contains("a", 1), false, methods[8][0]);
    assertEq("abc".contains("abc", 1), false, methods[8][0]);
    assertEq("abc".contains("c", 2), true, methods[8][0]);
    assertEq("abc".contains("d", 2), false, methods[8][0]);
    assertEq("abc".contains("dcd", 2), false, methods[8][0]);
    assertEq("abc".contains("a", 42), false, methods[8][0]);
    assertEq("abc".contains("a", Infinity), false, methods[8][0]);
    assertEq("abc".contains("ab", -43), true, methods[8][0]);
    assertEq("abc".contains("cd", -42), false, methods[8][0]);
    assertEq("abc".contains("ab", -Infinity), true, methods[8][0]);
    assertEq("abc".contains("cd", -Infinity), false, methods[8][0]);
    assertEq("abc".contains("ab", NaN), true, methods[8][0]);
    assertEq("abc".contains("cd", NaN), false, methods[8][0]);
    var myobj = {toString : function () {return "abc";}, contains : String.prototype.contains};
    assertEq(myobj.contains("abc"), true, methods[8][0]);
    assertEq(myobj.contains("cd"), false, methods[8][0]);
    var gotStr = false, gotPos = false;
    myobj = {toString : (function () {
        assertEq(gotPos, false, methods[8][0]);
        gotStr = true;
        return "xyz";
      }),
      contains : String.prototype.contains};
    var idx = {valueOf : (function () {
    assertEq(gotStr, true, methods[8][0]);
    gotPos = true;
    return 42;
    })};
    myobj.contains("elephant", idx, methods[8][0]);
    assertEq(gotPos, true, methods[8][0]);
    assertEq("xyzzy".contains("zy\0", 2), false, methods[8][0]);
    var dots = Array(10000).join('.');
    assertEq(dots.contains("\x01", 10000), false, methods[8][0]);
    assertEq(dots.contains("\0", 10000), false, methods[8][0]);
  } catch (e) {
    console.error(e.message);
  }
}

function testArrayPrototypeEntries() {
  /* TODO: Add complete tests for Array.prototype.entries */
  try {
    var arr = [1, 2];
    var it = arr.entries();
    assertEq(it.next(), {value: [0, 1], done: false}, methods[20][0]);
    assertEq(it.next(), {value: [1, 2], done: false}, methods[20][0]);
    assertEq(it.next(), {value: undefined, done: true}, methods[20][0]);
  } catch (e) {
    console.error(e.message);
  }
}

var methods = [["Map", testMap],
               ["Set", testSet],
               ["String.fromCodePoint",],
               ["String.raw",],
               ["String.prototype.codePointAt",],
               ["String.prototype.repeat",],
               ["String.prototype.startsWith",],
               ["String.prototype.endsWith",],
               ["String.prototype.contains", testStringPrototypeContains],
               ["Number.parseInt",],
               ["Number.parseFloat",],
               ["Number.isNaN",],
               ["Number.isSafeInteger",],
               ["Number.isFinite",],
               ["Number.prototype.clz",],
               ["Array.from",],
               ["Array.of",],
               ["Array.prototype.find",],
               ["Array.prototype.findIndex",],
               ["Array.prototype.keys",],
               ["Array.prototype.entries", testArrayPrototypeEntries],
               ["Array.prototype.values",],
               ["Object.is",],
               ["Object.assign",],
               ["Math.sign",],
               ["Math.log10",],
               ["Math.log2",],
               ["Math.log1p",],
               ["Math.expm1",],
               ["Math.cosh",],
               ["Math.sinh",],
               ["Math.tanh",],
               ["Math.acosh",],
               ["Math.asinh",],
               ["Math.atanh",],
               ["Math.hypot",],
               ["Math.trunc",],
               ["Math.imul",]];

var notExists = 0;
var notExistsNames = [];
var context = window;

for (var i = 0; i < methods.length; i++) {
  var namespaces = methods[i][0].split(".");
  var func = namespaces.pop();
  var tmpContext = context;
  for(var j = 0; j < namespaces.length; j++) {
    tmpContext = tmpContext[namespaces[j]];
  }
  if (!tmpContext[func]) {
    notExists++;
    notExistsNames.push(methods[i][0]);
  } else if (methods[i][1])
    methods[i][1]();
}

console.log(notExists + " out of " + methods.length + " methods are not supported.");
console.log(notExistsNames);
