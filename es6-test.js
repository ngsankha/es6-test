function assertEq(a, b, cx) {
  if (a !== b)
    throw Error("Assertion failed in " + cx + " : " + a + " === " + b);
}

function raiseImplError(obj) {
  throw new Error("Invalid implementation: " + obj);
}

function testMap() {
  // TODO: Add complete tests for Map
  try {
    Map.length ? assertEq(Map.length, 0, "Map.length") : raiseImplError("Map");
    var m = new Map([1, 'a']);
    m.size ? assertEq(m.size, 1, "Map.prototype.size") : raiseImplError("Map.prototype.size");
  } catch (e) {
    console.log(e.message);
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
    console.log(e.message);
  }
}

var methods = [["Map", testMap],
               ["Set",],
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
