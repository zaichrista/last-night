/* Keep dialogs within the visible area when the phone keyboard is open. */
if (window.visualViewport) {
  const fit = () => {
    document.documentElement.style.setProperty('--viewport-height', `${visualViewport.height}px`);
    document.documentElement.style.setProperty('--viewport-top', `${visualViewport.offsetTop}px`);
  };
  visualViewport.addEventListener('resize', fit);
  visualViewport.addEventListener('scroll', fit);
  fit();
}
if ('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js', {updateViaCache: 'none'}).then(reg => {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) reg.update().catch(() => {});
    });
  }).catch(() => {
    console.warn('Offline support is unavailable; the app can still run online.');
  });
}
