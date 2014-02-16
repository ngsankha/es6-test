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
  // TODO: Add complete tests for Map
  try {
    Map.length ? assertEq(Map.length, 0, "Map.length") : raiseImplError("Map");
    var m = new Map([[1, 'a'], [2, 'b']]);
    m.size ? assertEq(m.size, 2, "Map.prototype.size") : raiseImplError("Map.prototype.size");
  } catch (e) {
    console.error(e.message);
  }
}

function testSet() {
  // TODO: Add complete tests for Set
  try {
    Set.length ? assertEq(Set.length, 0, "Set.length") : raiseImplError("Set");
    var s = new Set([1, 'a']);
    s.size ? assertEq(s.size, 2, "Set.prototype.size") : raiseImplError("Set.prototype.size");
  } catch (e) {
    console.error(e.message);
  }
}

function testStringPrototypeContains() {
  try {
    assertEq("abc".contains("a"), true, "String.prototype.contains");
    assertEq("abc".contains("b"), true, "String.prototype.contains");
    assertEq("abc".contains("abc"), true, "String.prototype.contains");
    assertEq("abc".contains("bc"), true, "String.prototype.contains");
    assertEq("abc".contains("d"), false, "String.prototype.contains");
    assertEq("abc".contains("abcd"), false, "String.prototype.contains");
    assertEq("abc".contains("ac"), false, "String.prototype.contains");
    assertEq("abc".contains("abc", 0), true, "String.prototype.contains");
    assertEq("abc".contains("bc", 0), true, "String.prototype.contains");
    assertEq("abc".contains("de", 0), false, "String.prototype.contains");
    assertEq("abc".contains("bc", 1), true, "String.prototype.contains");
    assertEq("abc".contains("c", 1), true, "String.prototype.contains");
    assertEq("abc".contains("a", 1), false, "String.prototype.contains");
    assertEq("abc".contains("abc", 1), false, "String.prototype.contains");
    assertEq("abc".contains("c", 2), true, "String.prototype.contains");
    assertEq("abc".contains("d", 2), false, "String.prototype.contains");
    assertEq("abc".contains("dcd", 2), false, "String.prototype.contains");
    assertEq("abc".contains("a", 42), false, "String.prototype.contains");
    assertEq("abc".contains("a", Infinity), false, "String.prototype.contains");
    assertEq("abc".contains("ab", -43), true, "String.prototype.contains");
    assertEq("abc".contains("cd", -42), false, "String.prototype.contains");
    assertEq("abc".contains("ab", -Infinity), true, "String.prototype.contains");
    assertEq("abc".contains("cd", -Infinity), false, "String.prototype.contains");
    assertEq("abc".contains("ab", NaN), true, "String.prototype.contains");
    assertEq("abc".contains("cd", NaN), false, "String.prototype.contains");
    var myobj = {toString : function () {return "abc";}, contains : String.prototype.contains};
    assertEq(myobj.contains("abc"), true, "String.prototype.contains");
    assertEq(myobj.contains("cd"), false, "String.prototype.contains");
    var gotStr = false, gotPos = false;
    myobj = {toString : (function () {
        assertEq(gotPos, false, "String.prototype.contains");
        gotStr = true;
        return "xyz";
      }),
      contains : String.prototype.contains};
    var idx = {valueOf : (function () {
    assertEq(gotStr, true, "String.prototype.contains");
    gotPos = true;
    return 42;
    })};
    myobj.contains("elephant", idx, "String.prototype.contains");
    assertEq(gotPos, true, "String.prototype.contains");
    assertEq("xyzzy".contains("zy\0", 2), false, "String.prototype.contains");
    var dots = Array(10000).join('.');
    assertEq(dots.contains("\x01", 10000), false, "String.prototype.contains");
    assertEq(dots.contains("\0", 10000), false, "String.prototype.contains");
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
               ["Array.prototype.entries",],
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
