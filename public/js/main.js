if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js')
  .then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(reg) {
    console.log('Service Worker is ready :^)', reg);
    reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
      console.log('endpoint:', sub.endpoint);
    });
  }).catch(function(error) {
    console.log('Service Worker error :^(', error);
  });
}


var sendPushNotification = document.querySelector('.sendPush');
sendPushNotification.addEventListener('click', function(e) {
  var title = 'Push message';

  event.waitUntil(
    self.registration.showNotification(title, {
      'body': 'The Message',
      'icon': 'images/icon.png'
    }));
});