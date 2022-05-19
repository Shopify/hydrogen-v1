# Disallow using JSON.parse() in React server component code

The [prototype pollution](https://learn.snyk.io/lessons/prototype-pollution/javascript/) attack targets the object prototype in Javascript, leading to logical errors or potentially executing unintended code within the system. Prototype pollution happens if the JSON string being parsed has a `__proto__` key that's merged using `Object.assign`. It can also occur if a similar deep copying library is merged with another object.

Most deep copying libraries iterate over an object’s own properties and copy the primitives recursively into their own properties that are objects. This means the properties on the supplied `__proto__` key will get copied over to the prototype, opening the door to a potential attack vector for malicious code.

## Rule details

This rule prevents using `JSON.parse` in a Hydrogen API route or server component.
