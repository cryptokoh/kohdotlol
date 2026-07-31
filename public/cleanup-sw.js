(() => {
  const cleanupKey = 'kohdotlol-cache-cleanup-2026-07-05'

  try {
    if (window.localStorage.getItem(cleanupKey) === 'done') return
    window.localStorage.setItem(cleanupKey, 'done')
  } catch (error) {
    return
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => {})
  }

  if ('caches' in window) {
    caches
      .keys()
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .catch(() => {})
  }
})()
