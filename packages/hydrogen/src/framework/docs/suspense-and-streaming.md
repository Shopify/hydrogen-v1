React suspense and streaming is what makes Hydrogen performant, visually and in reality.

## What is streaming and data suspense?

Streaming, like what we are familiar with any video platform, is the ability to load
data over the network in multiple chunks out of order. React 18 make use of streaming on
HTML documents. This may sounds silly on what might be a 20kB document but on a ecommerce
site, it makes a difference when the generation of the document is dependent on the API calls
it makes. These API calls are typically the bottlenecks for creating a static HTML document.

[streaming.mov]

This streaming example shows that we have content to display (the yellow boxes) and
as streaming approaches 1.5 seconds, each yellow boxes get replaced by blue boxes
at the time they were specified.

React 18 introduce the concept of data suspense to compliment streaming.
If you looks at the source code for the streamed document, you will notice that
HTML are being streamed by the content time delayed order. Visually, these contents
are displayed out of order.

[streaming-source.png]

## What does React `Suspense` component do?

React `Suspense` component is what defines the visual data suspense boundaries.
Let's take a took at the same example without any `Suspense` component
defined:

[data-suspense-0.mov]

When no `Suspense` component is defined, React will wait for streaming to
complete before showing the final layout. If you take a look at the streamed
document source, you will notice that the streamed content is in the exact
time delayed order as the example with `Suspense` component wrapping over
each timed componets

Let's look at the same example with `Suspense` wrapped a group of timed components:

[data-suspense-1.mov]

When `Suspense` component is wrapped around a group of timed components, it
will wait for the last component in the group to resolve before visually
display. Again, if you look at the streamed document source, the order of streamed
content didn't change.
