# Summary - Part I: Test-Driven Development

## Chapter 1: Automated Testing

### 1.1 The Unit Test

#### `unit test` ...

> a piece of code that test a piece of production code.
>
> characteristics:
> * are stored on disk along with a version control system.
> * should be easy and fast to run.
> * should test software components in isolation.
> * should also run isolated - **no test should depend on another test**
> * should run simultaneously and in any order.

#### We run `tests` at any time ...

> * when the implementation (feature) is complete, to verify its correct behavior.
> * when the implementation changes, to verify its behavior is intact.
> * when new units are added to the system, to verify it still fulfills its intended purpose.

#### `xUnit` ...

> is a term to refer to test frameworks that are based on ideas and concepts or derive their structure on the Smalltalk's SUnit, designed by Kent Beck in 1988.

#### Exercise: have the `strftime` function to format `%S` seconds, `%M` minutes and `%H` hours.

### 1.2 Assertions

#### `assertion` ...

> is a predicate that states the programmer's intended state of a system.

#### Colors for `assertions`

> Red is used for "failure"
>
> Green is used for "success"

### 1.3 Test Functions, Cases and Suites

#### `test functions` ...

> are used to organize the tests to get a more fine-grained feedback
>
> should exercise only one unit, but it may do so using one or more assertions
>
> are required only to test one specific behavior of a single unit

#### `test case` ...

> a set of related test functions/methods

#### `test suites` ...

> test cases are usually organized in test suites in more complex systems
>
> `test suites` > `test cases` > `test functions`

#### `test fixtures` ...

> centralized setup of test data
>
> are handled by the following methods:
>
> * `setUp` aka `before` or `beforeEach`
>
> * `tearDown` aka `after` or `afterEach`

### 1.4 Integration Tests

#### `integration tests` ...

> test the sum of its parts (unit tests, two or more individual components)

### 1.5 Benefits of Unit Tests

#### `importance of testing` ...

> writing tests is an investment
>
> testing applications **takes time**
>
> automated testing allows us to write a test once and run it as many times as we wish

#### `regression testing` ...

> by "trapping" a bug in a test, our test suite will notify us if the bug ever makes a reappearance.
>
> we can run all our tests prior to pushing code into production to make sure that past mistakes stay in the past.

#### `refactoring` ...

> is vital to growing your application while preserving a good design.
>
> you've done it by:
>
> * Reusing code/methods. DRY (Don't Repeat Yourself)
> * Renaming objects or functions
>
> first step while refactoring:
>
> **“Build a solid set of tests for the section of code to be changed.”** - Martin Fowler
>
> without tests you have no reliable metric that can tell you whether or not the refactoring was successful, and that new bugs weren’t introduced:
>
> **“don’t touch anything that doesn’t have coverage. Otherwise, you’re not refactoring; you’re just changing shit.”** - Hamlet D’Arcy

#### `cross-browser testing` ...

> make use of a `test runner` to automate tests across multiple user agents aka browsers.

#### more benefits of `well-written tests` ...

> serve as good documentation of the underlying interfaces.
>
> new developers can get to know the system being developed better

### 1.6 Pitfalls of Unit Testing

#### `pitfalls` ...

> writing tests is **NOT** always easy
>
> in order to write truly great unit tests, the code you’re testing needs to be testable.
