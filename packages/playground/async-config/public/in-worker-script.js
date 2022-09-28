console.log('🎉🎉🎉 Hello from a Web Worker! 🎉🎉🎉');
const widget = document.getElementById('partytown-widget');
if (widget) {
  widget.innerHTML = `
    <div>
      <p>🎉🎉🎉 Injected by an inWorker script!.... 🎉🎉🎉</p>
      <p>check: Dev Tools / Sources / Page / Partytown</p>
    </div>
  `;
}

const data = [];

window.forwardedTestFn =
  window.forwardedTestFn ||
  function (value) {
    data.push(value);
    console.log('🎉 forwardedTestFn ⏭⏭⏭⏭⏭⏭⏭⏭', data);
  };
