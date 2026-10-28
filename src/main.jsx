import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Defensive normalization for environments with non-standard or strict WAAPI (Web Animations API) implementations
if (typeof window !== 'undefined' && typeof Element !== 'undefined' && Element.prototype.animate) {
  const originalAnimate = Element.prototype.animate;

  Element.prototype.animate = function (keyframes, options) {
    let normalizedOptions = options;

    if (typeof options === 'number') {
      normalizedOptions = { duration: options, iterations: 1, iterationCount: 1 };
    } else if (options && typeof options === 'object') {
      let iter = 1;
      if (typeof options.iterations === 'number' && !isNaN(options.iterations) && options.iterations >= 0) {
        iter = options.iterations;
      } else if (typeof options.iterationCount === 'number' && !isNaN(options.iterationCount) && options.iterationCount >= 0) {
        iter = options.iterationCount;
      }

      normalizedOptions = {
        ...options,
        iterations: iter,
        iterationCount: iter === Infinity ? 999999999 : iter,
      };
    }

    try {
      return originalAnimate.call(this, keyframes, normalizedOptions);
    } catch (err) {
      console.warn('[WAAPI Fallback] Intercepted element.animate error, using graceful shim:', err);
      const mockAnimation = {
        startTime: 0,
        currentTime: 0,
        playbackRate: 1,
        playState: 'finished',
        finished: Promise.resolve(),
        onfinish: null,
        oncancel: null,
        play: () => {},
        pause: () => {},
        finish: function () {
          if (typeof this.onfinish === 'function') {
            try { this.onfinish(); } catch (_) {}
          }
        },
        cancel: function () {
          if (typeof this.oncancel === 'function') {
            try { this.oncancel(); } catch (_) {}
          }
        },
        reverse: () => {},
        commitStyles: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };

      setTimeout(() => {
        if (typeof mockAnimation.onfinish === 'function') {
          try { mockAnimation.onfinish(); } catch (_) {}
        }
      }, 0);

      return mockAnimation;
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
