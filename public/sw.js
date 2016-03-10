console.log('Started', self);
self.addEventListener('push', function(event) {
	console.log('Push message received', event);

	fetch("/get-push-data").then(function(response) {
    if (response.status !== 200) {
      // Either show a message to the user explaining the error
      // or enter a generic message and handle the
      // onnotificationclick event to direct the user to a web page
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      throw new Error();
    }
    return response.json().then(function(data) {
      if (data.error || !data) {
        console.error('The API returned an error.', data.error);
        throw new Error();
      }

      var title = data.title;
      var message = data.message;
      var icon = data.icon;
      var notificationTag = data.tag;

      return self.registration.showNotification(title, {
        body: message,
        icon: icon,
        tag: notificationTag
      });
    });
  }).catch(function(err){
    console.error('Unable to retrieve data', err);
    var title = 'An error occurred';
    var message = 'We were unable to get the information for this push message';
    var icon = "/images/icon.png";
    var notificationTag = 'notification-error';
    return self.registration.showNotification(title, {
        body: message,
        icon: icon,
        tag: notificationTag
      });
  });
});


self.addEventListener('notificationclick', function(event) {
	console.log('Notification click: tag', event.notification.tag);
	// Android doesn't close the notification when you click it
	// See http://crbug.com/463146
	event.notification.close();

	var url = 'http://localhost/';
	// Check if there's already a tab open with this URL.
	// If yes: focus on the tab.
	// If no: open a tab with the URL.
	event.waitUntil(
		clients.matchAll({
			type: 'window'
		})
		.then(function(windowClients) {
			console.log('WindowClients', windowClients);
			for (var i = 0; i < windowClients.length; i++) {
				var client = windowClients[i];
				console.log('WindowClient', client);
				if (client.url === url && 'focus' in client) {
					return client.focus();
				}
			}
			// if (clients.openWindow) {
			// 	return clients.openWindow('/');
			// }
		})
	);
});
