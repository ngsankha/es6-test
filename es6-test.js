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

var methods = [["Map", testMap],
               ["Set",],
               ["String.fromCodePoint",],
               ["String.raw",],
               ["String.prototype.codePointAt",],
               ["String.prototype.repeat",],
               ["String.prototype.startsWith",],
               ["String.prototype.endsWith",],
               ["String.prototype.contains",],
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
