
# Summary - Part III: Real-World Test-Driven Development in JavaScript

## Chapter 13: Streaming Data with Ajax and Comet

### 13.1 Polling Data

#### test-driven development...

> ...is really about **design** and **specification**.

#### *mockists*

> Some developers will always prefer stubbing and mocking as many of an interface’s dependencies as possible.

#### possible risk of implementing mocks and fakes

> There is a real possibility of using fakes in tests that are incompatible with their production counterparts, making tests succeed with such fakes will guarantee the resulting code to break when faced the real implementation in an integration test or production!

### 13.2 Comet

#### Polling drawbacks:

> * Polling too infrequently yields high latency, Meaning that the client won't experience a real-time application.
> * Polling too frequently yields too much server load, which may be unnecessary if few requests actually bring data back. This can bring scalability issues to the servers.

#### Comet

> is an umbrella term to define a web application model in which a long-held HTTPS requests allows a web server to push data to a browser without the browser explicitly requesting it.

#### Comet synonyms:

> * Ajax push
> * Reverse Ajax
> * Two-way web
> * HTTP Streaming
> * HTTP server push

#### Ways of doing Comet:

> * Polling (with the drawbacks already explained)
> * Forever Frames
>   * Disadvantages: little low control over error handling. Web browser never stops loading
>   * Advantages: no XMLHttpRequest object is needed. Allows true streaming of data and only uses a single connection.
> * Streaming XMLHttpRequest
>   * Disadvantages: not all browsers support multipart responses.
>   * Advantages: enables to receive chunks of data several times over the same connection.
> * HTML5 Web Sockets
>   * Disadvantages: not widely supported yet.
>   * Advantages: offers a full-duplex communication channel, which can held open for as long as required and allows true streaming of data between client and server with proper error handling.

### 13.3 Long Polling XMLHttpRequest

#### Long Polling

> * behaves like Regular Polling
> * not suitable for servers that do one thread-per-connection because this model does not scale well with long polling
> * its main goal is low latency
