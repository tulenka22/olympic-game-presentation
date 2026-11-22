import { defineConfig } from 'vite'

// Cross-document view transitions need the opt-in in the initial HTML of both
// pages. Inject it only into the production build: in dev the deck and app run
// on different ports, so the fallback fade is used instead.
const viewTransition = {
  name: 'olympic-view-transition',
  apply: 'build',
  transformIndexHtml(html) {
    const style = `
      @view-transition { navigation: auto; }
      ::view-transition-old(root) { animation: handoff-fade-out 0.34s ease both; }
      ::view-transition-new(root) { animation: handoff-fade-in 0.34s ease both; }
      @keyframes handoff-fade-out { to { opacity: 0; } }
      @keyframes handoff-fade-in { from { opacity: 0; } }
    `
    return html.replace('</head>', `${style}</head>`)
  },
}

export default defineConfig({
  // Relative assets work both at /presentation/ in production and at / in the
  // standalone dev server.
  base: './',
  plugins: [viewTransition],
  server: { port: 5174 },
  preview: { port: 4174 },
})
