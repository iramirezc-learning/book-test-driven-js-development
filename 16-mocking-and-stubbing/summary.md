
# Summary - Part IV: Testing Patterns

## Chapter 16: Mocking and Stubbing

### 16.1 Test Doubles

#### Test Double

> Is an object that looks and feels like a real thing but it is a fake implementation of the original.
>
> Test doubles supports the same API or at least the same parts of a real thing but not behaving the same way.
>
> They are used to isolate interfaces and do the testing more convenient; faster, not doing calls to inconvenient methods, spying calls to assert inputs and outputs.
>
> Test doubles are like stunt doubles.

#### System Under Test

> is the code being tested

#### Fake Object

> It provides the same functionality of a real object but its implementation is much simpler.
>
> Fakes are different that Stubs because they can be used in all the test suit. Stubs are placed only in the tests that makes sense. Other Systems under testing are not aware that the fake objects they interact with are not the originals as long as they provide the same interface.
>
> _Example_: The File System module can be replaced with a fake to run faster and in memory while testing.

#### Dummy Object

> A dummy object can be an empty object or a function that can be used to perform a test that requires data in case they throw an error and focus only in the functionality that matters.
>
> Dummy objects are a complement, they can replace real objects with their API.
>
> _Example_: A dummy object that can replace an element in the DOM

```js
const dummyElement = {
  appendChild: stubFn(),
  scrollHeight: 1900,
  className: 'js-chat'
}
```

### 16.2 Test Verification

#### Unit tests have four stages

> * __Set Up__ (beforeAll, beforeEach). All the set up of the tests and configuration of objects.
> * __Exercise__. Where we execute the functions under test.
> * __Verification__. Where we perform the validation of the test as assertions.
> * __Tear Down__ (afterAll, afterEach). All the cleaning after tests have run.

#### Types of Test Verification

##### State Verification

> Determines if objects have a specific state after the Exercise. Describes the outcome of using some parts of the system under test. Observes the inputs and outputs.
>
> _Example_: `it should set some value...`

##### Behavior Verification

> Verifies if a function was actually called with the correct arguments. It does not care about state, if focuses on the interactions with other parts of the system.
>
> _Example_: `it should do something...`

### 16.3 Stubs

> Stubs are Test Doubles with pre-programmed behavior.
>
> They may return something (_Responders_) or throw an exception (_Saboteurs_).

#### Use cases for Stubs

> Stubs are used to avoid inconvenient interfaces.
>
> Stubs are used to force certain code paths by using _Responders_.
>
> Stubs are used to cause trouble by using _Saboteurs_ returning unexpected values or exceptions.

### 16.4 Test Spies

> Tests Spies are objects or functions that record information about their usage through the system under test: calls, arguments, context of `this`.
>
> Test Spies can be smarter to record all their calls with their respective list of arguments.

### 16.5 Stub Libraries

> [Sinon.js](https://sinonjs.org/). __Sinon__ was a Greek spy that convinced the Trojans to accept the Trojan Horse into their city.
>
> Sinon can be configured to throw a different fail exception when working with other libraries by just changing the `sinon.failException` string. If that does not work, you can override the `sinon.fail` method to do the right thing.

### 16.6 Mocks

> Like Stubs, a Mock is an object with pre-programmed behavior but also it includes pre-programmed expectations and built-in behavior verification.
>
> When using a Mock; expectations are set before we exercise the system.
>
> A Mock is a Stub pre-programmed with expectations focused on behavior verification.
>
> Mocks fail early.

```js
// example of a Mock using Sinon.js
it('should start polling' () => {
  this.client.url = "/my/url"

  const mock = sinon.mock(ajax)

  mock.expects("poll").withArgs("/my/url").returns({})

  this.client.connect()

  mock.verify() // also restores the mock
})
```

```js
// example wrapping a test with sinon.test
// that will sandbox the mocks and restore them after the test runs.
it('should start polling' sinon.test((stub, mock) => {
  const url = this.client.url = "/my/url"

  sinon.mock(ajax).expects("poll").withArgs(url).returns({})

  this.client.connect()
}))
```

#### Anonymous Mocks

```js
// example of an anonymous mock
it('should notify all observers even when some fail', sinon.test((stub, mock) => {
  const observable = Object.create(tddjs.util.observable)

  observable.addObserver(mock().throwsException())
  observable.addObserver(mock())

  observable.notifyObservers()
}))
```

#### Multiple Expectations

```js
// example of using mocks with multiple expectations

// old test

it('should not connect if connected', () => {
  this.client.url = '/my/url'

  ajax.poll = stubFn({}) // creates first stub
  this.client.connect() // first call
  ajax.poll = stubFn({}) // creates a new second stub
  this.client.connect() // second call

  assertFalse(ajax.poll.called) // verifies that second stub was not called
})

// same test with sinon mock #1

it('should not connect if connected', sinon.test((stub, mock) => {
  this.client.url = '/my/url'

  mock(ajax).expects('poll').once().returns({}) // once() indicates poll should be called once

  this.client.connect()
  this.client.connect()
}))

// same test with sinon mock #2

it('should not connect if connected', sinon.test((stub, mock) => {
  this.client.url = '/my/url'

  // first call
  stub(ajax, 'poll').returns({})
  this.client.connect()

  // second call
  mock(ajax).expects('poll').never()
  this.client.connect()
}))
```

#### Expectations on the `this` value

```js
it('should handle event with bound handleSubmit', sinon.test((stub, mock) => {
  const controller = this.controller

  stub(dom, 'addEventHandler')
  mock(controller).expects('handleSubmit').on(controller) // on() indicates which value to us as `this`

  controller.setView(this.element)
  dom.addEventHandler.getCall(0).args[2]()
}))
```

### 16.7 Mocks or Stubs?

#### Stubs

> Are more versatile.
>
> They are simpler to silence dependencies.
>
> They are more useful to fill in not-yet implemented interfaces.
>
> They can force certain paths.
>
> Support both State and Behavior verification.
>
> Assertions are required but are more expressive in tests.
>
> Test Verification Stages go as follow: Set Up -> Exercise -> Verification -> Tear Down

#### Mocks

> Only support Behavior verification.
>
> Assertions are not required because Mocks have their own validation for expectations causing the tests hard to read.
>
> Mocks should not be used in cases where other tests may be broken due to an expectation set for a mock which is not related to the purpose of the test.
>
> Test Verification Stages go as follow: Set Up -> Sets Expectations (No Assertions/Verifications) -> Exercise -> Tear Down.
