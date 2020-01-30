# Test-Driven JavaScript Development Book

Code & personal notes from the book [Test Driven JavaScript Development](https://www.amazon.com/Test-Driven-JavaScript-Development-Developers-Library/dp/0321683919) by Christian Johansen.

## Book site

https://www.tddjs.com/

## Summaries

* [Chapter 01. Automated Testing](./01-automated-testing/summary.md)
* [Chapter 02. The TDD Process](./02-the-tdd-process/summary.md)
* [Chapter 03. Tools of the Trade](./03-tools-of-the-trade/summary.md)
* [Chapter 04. Test to Learn](./04-test-to-learn/summary.md)
* [Chapter 05. Functions](./05-functions/summary.md)
* [Chapter 06. Applied Functions and Closures](./06-applied-functions-and-closures/summary.md)
* [Chapter 07. Objects and Prototypal Inheritance](./07-objects-and-prototypal-inheritance/summary.md)
* [Chapter 08. ECMAScript 5th Edition](./08-ecmascript-5th/summary.md)
* [Chapter 09. Unobtrusive JavaScript](./09-unobtrusive-js/summary.md)
* [Chapter 10. Feature Detection](./10-feature-detection/summary.md)
* [Chapter 11. The Observer Pattern](./11-the-observer-pattern/summary.md)
* [Chapter 12. Abstracting Browser Differences: Ajax](./12-abstracting-browsers-differences/summary.md)
* [Chapter 13. Streaming Data with Ajax and Comet](./13-streaming-data-with-ajax-and-comet/summary.md)
* [Chapter 14. Server-Side JavaScript with Node.js](./14-server-side-js-with-nodejs/summary.md)
* [Chapter 15. TDD and DOM Manipulation: The Chat Client](./15-tdd-and-dom-manipulation/summary.md)
* Chapter 16. Mocking and Stubbing
* Chapter 17. Writing Good Unit Tests

## Tests

Install [Mocha.js](https://mochajs.org/) globally

```sh
npm install --global mocha
```

### Run xUnit specs

> Only for chapters 1 and 2. Ignores the usage of `mocha` command

```sh
npm run test:spec
```

### Run Mocha tests

```sh
npm run test
```

## Benchmarks

Loops (Chapter 04):

```sh
npm run bench:loops
```

Fibonacci (Chapter 06):

```sh
npm run bench:fibonacci
```

Loops with timeout (Chapter 06):

```sh
node ./06-applied-functions-and-closures/benchmarks/loops-timeout.js
```
