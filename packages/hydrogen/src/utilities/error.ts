export function getErrorMarkup(error: Error) {
  return `<script>
    import('/@vite/client')
        .then(() => {
            const err = new Error(\`${error.message}\`);
            err.stack = \`${error.stack}\`;
            const ErrorOverlay = customElements.get('vite-error-overlay')
            // don't open outside vite environment
            if (!ErrorOverlay) {return}
            console.log(err)
            const overlay = new ErrorOverlay(err)
            document.body.appendChild(overlay)
        })
</script>`;
}
