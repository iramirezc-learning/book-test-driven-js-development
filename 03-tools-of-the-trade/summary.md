# Summary - Part I: Test-Driven Development

## Chapter 3: Tools of the Trade

### 3.1 xUnit Test Frameworks

#### `TDD`

> is not about `testing`, is about design and process.

#### `Acceptance TDD`

> starts by writing automated test for high level features.

#### `BDD Frameworks`

> * Cucumber

#### `What's Continuos Integration?`

> is the practice of integrating code from all developers on a regular basis. A CI Server builds all the sources and then run tests on them.

#### `Parts of a Testing Framework`

> * Test Runner
> * Assertions
> * Dependencies

### 3.2 In-Browser Test Frameworks

#### `what are they?`

> in the past the were some in-browser testing frameworks such as YUI from Yahoo! They run in the browser as the name suggests. An HTML page is required for them to run.

### 3.3 Headless Testing Frameworks

#### `what are those?`

> these frameworks run from the command line, sometimes emulating the browser behavior, running on top of some technology or browser engine. These frameworks are not suitable for Production, emulating means what it means, you can never get close to the real thing, so in production happens the same, you can't run all the tests you may want in an emulated environment.

### 3.4 One Test Runner to Rule Them All

#### `JsTestDriver` from Google

> Advantages:
> * Automated browser tests
> * Multiple machines, mobile devices
> * Multiple browsers simultaneously
>
> Disadvantages:
> * Does NOT support Asynchronous code