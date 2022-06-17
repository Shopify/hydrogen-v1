export function getErrorMarkup(error) {
    return `<script type="module">
    import {ErrorOverlay} from '/@vite/client';
    document.body.appendChild(new ErrorOverlay(${JSON.stringify(error, Object.getOwnPropertyNames(error)).replace(/</g, '\\u003c')}));
</script>`;
}
