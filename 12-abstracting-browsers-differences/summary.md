# Summary - Part III: Real-World Test-Driven Development in JavaScript

## Chapter 12: Abstracting Browser Differences: Ajax

### 12.1 Test Driving a Request API

#### development strategy:

> Unit tests are there to drive us through development of the higher level API. They are going to help us develop and test the logic *we* build on top of the native transport, **not the logic a given browser vendor built into their XMLHttpRequest implementation**.

### 12.4 Making Get Requests

#### Stubs...

> Stubbing and mocking are two ways to create objects that mimic real objects in tests. Along with fakes and dummies, they are often collectively referred to as test doubles.

#### Test doubles

> They usually implemented on tests when original implementations is awkward or when we need to isolate an interface from its dependencies.
