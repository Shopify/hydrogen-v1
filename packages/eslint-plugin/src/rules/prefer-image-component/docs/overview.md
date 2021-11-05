# Prefer using @shopify/hydrogen `Image` component in place of HTML `img` tags(`hydrogen/prefer-image-component`)

Images can cause layout shifts if they load after the surrounding page has already rendered. This can lead to [Cumulative Layout Shift](https://web.dev/cls/), a [Core Web Vital](https://web.dev/vitals/) that [Google uses in search ranking](https://developers.google.com/search/blog/2020/05/evaluating-page-experience).
