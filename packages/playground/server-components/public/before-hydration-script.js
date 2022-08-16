'use strict';
(function () {
  window.__test = window.__test || {
    icon: '💨',
  };
  console.log(
    '💨 <Script beforeHydration src /> loaded and injected window.__test..',
    window.__test
  );
})(window);
