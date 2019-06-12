# Summary - Part II: JavaScript for Programmers

## Chapter 9: Unobtrusive JavaScript

### 9.1 The Goal of Unobtrusive JavaScript

#### advantages of this technique

> * Accessibility. Wider audience, better for screen readers and web crawlers. Better sense of content.
> * Flexibility. Refactoring, tunning.
> * Robustness. Progressive enhancement.
> * Performance. Caching scripts.
> * Extensibility. Separation of concerns. JS form the Markup

### 9.2 The Rules of Unobtrusive JavaScript

#### the 7 rules of unobtrusive JS

> * Do not make any assumptions
> * Find your hooks and relationships
> * Leave traversing to the experts
> * Understand browsers and users
> * Understand events
> * Play well with others
> * Work for the next developer

### 9.3 Do Not Make Assumptions

#### important considerations

> * Don't assume you are alone. Keep your global footprint small
> * Don't assume markup is correct. Markup can be changed over time by other scripts,
> * Don't assume all users are created equal. Use the Web Content Accessibility Guidelines (WCAG).
> * Don't assume support. Test for the existence of features before using them.

### 9.4 When Do the Rules Apply?

#### in the real world...

> Like TDD, coding JavaScript unobtrusively will probably slow you down slightly as you start out, but you will reap the benefits over time because it makes maintenance a lot easier, causes fewer errors, and produces more accessible solutions. This translates to less time spent fixing bugs, less time spent handling complaints from users, and possibly also less serious trouble as accessibility laws get more comprehensive.

### 9.5 Unobtrusive Tabbed Panel Example

#### using the Tab Controller

> Implementation [here](./html/panel.html)
