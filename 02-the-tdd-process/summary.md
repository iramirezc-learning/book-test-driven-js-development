# Summary - Part I: Test-Driven Development

## Chapter 2: The Test-Driven Development Process

### 2.1 Goal and Purpose of TDD

#### `TDD`

> is a programming technique that moves unit tests to the front row, making them the primary entry point of production code

#### `TDD` benefits

> * better testability
> * cleaner interfaces
> * improved developer confidence
> * ensures that a system will never contain code that is not executed

### 2.2 The Process

#### The Steps

> * Write a test
> * Run tests; watch them fail
> * Make the test pass
> * Refactor to remove duplication

#### 1. Write a test

> * A good unit test should be short and focused on a single behavior of a function/method.
> * A new test should never duplicate assertions that have already been found to work
> * Inputs:
>   * Direct (passed by arguments)
>   * Indirect (global scope)
> * Outputs:
>   * Direct (returned by the function)
>   * Indirect (global scope modified by the function)

#### 2. Watch the test fail

> * Test must fail at first before writing production code, if they don't then something might be wrong.
> * Running the test with an expectation on what is going to happen greatly increases the chance of catching bugs in the tests themselves.

#### 3. Make the Test Pass

> * If there is an obvious solution to a test, we can go ahead and implement it. But we must remember to only add enough code to make the test pass, even when we feel that the greater picture is just as obvious. Don’t fear hard-coding.
> * **YAGNI:** “you ain’t gonna need it,”. We should not add functionality until it is necessary.

#### 4. Refactor to Remove Duplication

> * Some good advice when refactoring code is to never perform more than one operation at a time, and make sure that the tests stay green between each operation.

#### Lather, Rinse, Repeat

> * Once refactoring is completed, and there is no more duplication to remove or improvements to be made to design, we are done. Pick a new task off the to do list and repeat the process.
> * When you are done for the day, leave one test failing so you know where to pick up the next day.

### 2.3 Facilitating Test-Driven Development

> Tests need to run fast and they should be easy to run, a tool to automate tests every time a test file is changed.

### 2.4 Benefits of Test-Driven Development

> * Code that Works
> * Honors the Single Responsibility Principle
> * Forces Conscious Development (think about code before writing it)
> * Productivity Boost