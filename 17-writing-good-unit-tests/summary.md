
# Summary - Part IV: Testing Patterns

## Chapter 17: Writing Good Unit Tests

Unit Tests are useful because:

* They help to design the production code.
* They provide us with an indication of progress.
* They help us scope down and only implement what we really need.
* They help to build a suite of regression tests.
* They help us to feel more confident when we refactor code.

### 17.1 Improving Readability

Readability is a key aspect of writing good unit tets, if a test is hard to read it is very likely to be misunderstood by other programmers. Leading to modifications both to tests or production code, causing the quality of both to drop over time.

#### Name Tests Clearly to Reveal Intent

Naming a test describing what's it purpose can help to understand and document what is the test trying to validate and will give us a better sense of what the production code should do.

A good name for a test is also important in case if it fails we can understand the root cause.

The name of a test is the very fist thing you write, if you can not express in words what do you want to test, then you may not have the complete understanding of the requirements you should implement. Writing the name of a test helps mentally to start thinking about the feature we will implement.

Good Test Names also help to `focus on scan-ability`. By looking at the name of the test you can understand what the feature is about, how it works and also to clearly notice what scenarios are not being covered.

##### Rules for Writing Good Unit Test Names

* Write the name of the tests in english words. No _snake_case_ nor _camelCaseName_.
* Use the word _"should"_ for your tests to describe behavior.
* Keep the names as short as possible without sacrificing clarity.
* Group related tests in separate test cases and indicate the relation in the test case name. That will help to have the same repetitive large name of similar tests.
* Never use the word "and", doing so indicates that the test is not specific enough. Do **NOT** test more that one aspect of the target method.
* Focus on the _what_ and _why_ not the _how_.

#### Structure Tests in _Setup_, _Exercise_ and _Verify_ Blocks

Add a new line between the code that is related to _setup_, _exercise_ and _verification_ in order to improve its readability.

Bad example:

```js
it('should notify observers of username', () => {
  var input = this.element.getElementsByTagName(input)[0] // set up
  input.value = 'Isaac'
  this.controller.setModel({})
  this.controller.setView(this.element)
  var observer = stubFn()
  this.controller.observe('user', observer) // exercise
  this.controller.handleSubmit(this.event)
  assert(observer.called) // verification
  assertEquals('Isaac', observer.args[0])
})
```

Good example:

```js
it('should notify observers of username', () => {
  var input = this.element.getElementsByTagName(input)[0]
  input.value = 'Isaac'
  this.controller.setModel({})
  this.controller.setView(this.element)
  var observer = stubFn()

  this.controller.observe('user', observer)
  this.controller.handleSubmit(this.event)

  assert(observer.called)
  assertEquals('Isaac', observer.args[0])
})
```

#### Use Higher-Lever Abstractions to Keep Tests Simple

Unit tests should only focus on a single behavior, nothing more. But some behaviors are more complex to verify thus requiring more assertions.

Higher-Lever Abstractions:

* __Custom Assertions: Behavior Verification__. Example: `expect().toHaveBeenCalledWith(...args)`.
* __Domain Specific Test Helpers__. Example: `expectMethodBoundAsEventHandler` can be a function that its only job is to perform such complex assertion.

Bad Example:

```js
it('should notify observers', (stub) => {
  const client = Object.create(ajax.cometClient)
  client.observers = { notify: stubFn() }

  client.dispatch({ custom: [{ id:1234 }] })

  // multiple assertions that make the test hard to read
  const args = client.observers.notify.args
  assert(client.observers.notify.called)
  assertEquals('someEvent', args[0])
  assertEquals({ id: 1234 }, args[1])
})
```

Good Example:

```js
it('should notify observers', sinon.test((stub) => {
  const client = Object.create(ajax.cometClient)
  const observers = client.observers
  stub(observers, 'notify')

  client.dispatch({ custom: [{ id:1234 }] })

  // this is the higher-lever assertion which is more readable and simpler
  assertCalledWith(observers.notify, 'custom', { id:1234 })
}))
```

#### Reduce Duplication, Not Clarity

Removing duplicated code is good, but doing it so aggressively can make the tests hard to understand missing important communication.

### 17.2 Tests as Behavior Specification

Unit tests can be used as a specification mechanism.

You may be tempted to write more than the necessary code for a test to fail in order to speed up things, but that's not a good idea. Every test should test one behavior at a time.

#### Test One Behavior at a Time

A test should only focus on test one behavior of the system, usually a test will have one assertion. If multiple assertions are required, then they should be logical related to what the test is trying to verify.

Example:

```js
it('should notify observers', () => {
  const client = Object.create(ajax.cometClient)

  client.dispatch({ someEvent: [{ id: 1234 }] })

  const args = client.observers.notify.args
  assert(client.observers.notify.called)
  assertEquals('someEvent', args[0])
  assertEquals({ id: 1234 }, args[1])
})
```

The advantages of writing unit tests to verify a single behavior are many. If a test fail, it should be easier to understand the reason of a failure without the need to use a debugging tool. Ask to yourself this question: Why would you be debugging while you are testing? Another advantage is that that tests that focus only in one thing are easier to understand.

#### Test Each Behavior Only Once

Testing the same behavior in different tests can lead to maintenance burden because a lot of test may fail for the same reason, and as a consequence the point of failure won't be obvious.

Re-testing adds no value to the specification system neither helps to find bugs.

You need to trust your tests! Because if you don't trust them, you'll ended up testing the same behavior.

Example:

```js
it('should not connect if connected', () => {
  this.client.url = '/my/url'
  ajax.poll = stubFn({})
  this.client.connect() // notice how we don't care about verifying the first call, that was covered in another test.

  ajax.poll = stubFn({})
  this.client.connect()

  assertFalse(ajax.poll.called)
})
```

Another way of doing re-testing is when your function is not focused on the things they should do "Single Responsibility" principle. So, if you find yourself doing a lot of assertions of validations for example, then that will be a clear sign that you need to refactor and write the corresponding unit tests.

#### Isolate Behavior in Tests

Sometimes your tests may fail because a dependency might be working incorrectly, so, for that reason, you should test your system in isolation. Try to avoid the _accidentally integration tests_. Stub your dependencies with the desire behavior and write their own suit of tests to verify their correctness.

Example:

```js
describe('FormController.handleSubmit - Test', () => {
  it('should publish message', () => {
    const controller = Object.create(messageController)
    const model = { notify: stubFn() } // stub

    controller.setModel(model)
    controller.handleSubmit()

    assert(model.notify.called)
    assertEquals('message', model.notify.args[0])
    assertObject(model.notify.args[1])
  })
})
```

Some of the most common errors when using stubs or mocks is that we can misspelled names of functions, methods, parameters, etc. We may forget the order of the params. Stubs or mocks may not implement the same interface as the real objects. Just make sure that your mocks and stubs mirror the real objects they mimic.

Trust your objects/dependencies if they are already tested.

### 17.3 Fighting Bugs in Tests

**You don't test your tests!**

Avoid adding logic to your tests! Your tests should be _stupid_! They should only care about assigning values, calling functions and asserting results. Respect the TDD life-cycle, before writing any production code, you must make sure that the test is failing, the you can write the code to make it pass. By respecting this workflow, you can avoid _buggy tests_. Not verifying a red test before writing the prod code, can give us the impression that the prod implementations was correct and then that will introduce buggy code.

Another way to avoid bugs in test is that you MUST write the test first. Let's recap some of the benefits of writing the test first:

* They ensure the prod code is testable. **Testability in mind!**
* They help to design the solution
* They serve as documentation
* They give you confidence to refactor

Code that is hard to use, is also hard to test.

Rules to avoid bugs in tests:

* Run the tests before passing them.
* Write tests first!!! The TDD principle!
* Break the production code to verify if tests break too. That will give you and idea of how to test & catch exceptions in your code that is not covered in your test suite.
* Use a linter!

**ONCE YOU HAVE GROWN COMFORTABLE WITHIN THE PROCESS THAT IS TEST-DRIVEN-DEVELOPMENT, YOU WON'T EVER GO BACK!**
