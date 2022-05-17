# Disallow using JSON.parse() in React server component code

The Prototype Pollution attack targets the Object prototype in Javascript, leading to logical errors or potentially executing unintended code within the system. This happens if the JSON string being parsed has a `__proto__` key and that is later merged via `Object.assign`, or similar deep copying library, with another Object.

Most deep copying libraries iterate over an object’s own properties and copy the primitives recursively into their own properties that are objects. This means the properties on the supplied `__proto__` key will get copied over to the prototype, opening the door to a potential attack vector for malicious code.

## Rule details

This rule prevents using `JSON.parse` in a Hydrogen API route or server component.
