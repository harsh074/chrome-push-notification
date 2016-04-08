'use strict';
app.service('notificationService',["$q","$http","CONSTANTS", function utilityService($q,$http,CONSTANTS) {
	var deferred = $q.defer();
	var service = {
		subscribe:function(){
			navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
				serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
				.then(function(subscription){
					console.log(subscription,'subscribe');
					deferred.resolve(subscription);
					/*if(subscription.endpoint.startsWith('https://android.googleapis.com/gcm/send')){
						var endpointParts = subscription.endpoint.split('/');
						$scope.subscriptionId.registrationId = endpointParts[endpointParts.length - 1];
					}
					$timeout(function(){
						$scope.showPushButton = true;
						$scope.args.pushStatus = true;
					}, 100);*/
					// sendSubscriptionToServer(subscription);
				})
				.catch(function(e){
					if(Notification.permission === 'denied'){
						console.log('Permission for Notifications was denied');
						deferred.reject(Notification,'Permission for Notifications was denied');
						// $scope.args.pushStatus = false;
					}else{
						console.error('Unable to subscribe to push.', e);
						deferred.reject(Notification,'Unable to subscribe to push.');
						// $scope.args.pushStatus = false;
					}
				});
			});
		},
		unsubscribe:function(){

		},
		initializeState:function(){
			var notificationService = this;
			if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
				console.log('Notifications aren\'t supported.');  
				deferred.reject(Notification.permission,'Notifications aren\'t supported.');
			}
			if (Notification.permission === 'denied') {
				console.log('The user has blocked notifications.');
				deferred.reject(Notification.permission,'The user has blocked notifications.');
			}
			if (!('PushManager' in window)) {
				console.log('Push messaging isn\'t supported.');
				deferred.reject(Notification.permission,'Push messaging isn\'t supported.');
			}
			navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
				serviceWorkerRegistration.pushManager.getSubscription()
				.then(function(subscription){
					if (!subscription) {
						return notificationService.subscribe();
					}else{
						deferred.resolve(subscription);
						/*if(subscription.endpoint.startsWith('https://android.googleapis.com/gcm/send')){
							var endpointParts = subscription.endpoint.split('/');
							$scope.subscriptionId.registrationId = endpointParts[endpointParts.length - 1];
						}
						$timeout(function(){
							$scope.args.pushStatus = true;
							// pushToggleSwitch.on();
							$scope.showPushButton = true;
						}, 1000);*/
					}
					// sendSubscriptionToServer(subscription);
				})
				.catch(function(err) {
					console.log('Error during getSubscription()', err);
					deferred.reject(Notification.permission,err);  
				});
			});
			return deferred.promise;
		},
		initialize:function(){
			if('serviceWorker' in navigator){
				navigator.serviceWorker.register('sw.js')
				.then(this.initializeState());
			}else{
				console.warn('Service workers aren\'t supported in this browser.');
				deferred.reject(Notification.permission,'Service workers aren\'t supported in this browser.');
			}
			return deferred.promise;
		}
	};
	return service;
}]);