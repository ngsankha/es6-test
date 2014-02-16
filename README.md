# ES6 Test

This is a small test suite that is meant to be run on websites as a bookmarklet to check their compatibility with the ECMAScript 6 Draft.

The idea behind this is to prevent errors due to conflicting implementation between browsers and their incomplete polyfills by the websites. This can prevent bugs like [this](https://bugzilla.mozilla.org/show_bug.cgi?id=924386#c19), [this](https://bugzilla.mozilla.org/show_bug.cgi?id=883914) and [this](https://bugzilla.mozilla.org/show_bug.cgi?id=881782) from occuring.

## To Use

Create a bookmarklet with the following JavaScript code:

```javascript
javascript:(function () {
  var newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = 'https://raw2.github.com/sankha93/es6-test/master/es6-test.js';
  document.getElementsByTagName('body')[0].appendChild(newScript);
})();
```

Just click on the bookmarklet with the Webconsole open. You will see the results coming up!