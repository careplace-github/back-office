import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

// Declare the `hljs` property on the `window` object
declare global {
  interface Window {
    hljs: typeof hljs;
  }
}

// Configure `hljs`
hljs.configure({
  languages: ['javascript', 'jsx', 'sh', 'bash', 'html', 'scss', 'css', 'json'],
});

// Assign `hljs` to the `window` object
if (typeof window !== 'undefined') {
  window.hljs = hljs;
}
