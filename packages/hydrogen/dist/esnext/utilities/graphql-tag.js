export const gql = (s, ...args) => s
    .map((ss, i) => `${ss}${args[i] || ''}`)
    .join('')
    .replace(/\s+#.*$/gm, '') // Remove GQL comments
    .replace(/\s+/gm, ' ') // Minify spaces
    .trim();
