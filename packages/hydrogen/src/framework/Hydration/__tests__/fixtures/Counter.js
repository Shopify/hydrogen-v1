const React = require('react');

module.exports = function Counter({children, count, things = []}) {
  const top = count ? `${children} ${count}` : children;
  const bottom = things.map((thing) =>
    React.createElement('p', {key: thing.id}, `Thing ${thing.id}`)
  );

  return React.createElement('div', {}, [top, bottom]);
};
