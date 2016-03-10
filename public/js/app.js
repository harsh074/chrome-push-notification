var app = angular.module('chromePushNotify', ['ngMaterial']);

app.controller('MainCtrl',['$scope','$timeout','$http', function($scope,$timeout,$http){
	$scope.showPushButton = false;
	$scope.pushToggle = true;
	$scope.args ={"pushStatus":"false"};	
	$scope.subscriptionId = {'registrationId':"",'endpoint':"https://android.googleapis.com/gcm/send"};



	$scope.initialiseState = function() {  
		if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
			console.log('Notifications aren\'t supported.');  
			return;  
		}
		if (Notification.permission === 'denied') {  
			console.log('The user has blocked notifications.');  
			return;  
		}
		if (!('PushManager' in window)) {  
			console.log('Push messaging isn\'t supported.');  
			return;  
		}
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
			serviceWorkerRegistration.pushManager.getSubscription()  
				.then(function(subscription){
					console.log(subscription,'subscribe');
					$timeout(function(){
						$scope.pushToggle = false;
					}, 100);
					if (!subscription) {
						console.log("not subscribe, So subscribe please")
						$scope.subscribe();
						return;
					}else{
						if(subscription.endpoint.startsWith('https://android.googleapis.com/gcm/send')){
							var endpointParts = subscription.endpoint.split('/');
							$scope.subscriptionId.registrationId = endpointParts[endpointParts.length - 1];
						}
						$timeout(function(){
							$scope.args.pushStatus = true;
							// pushToggleSwitch.on();
							$scope.showPushButton = true;
						}, 1000);
					}
					// sendSubscriptionToServer(subscription);
				})  
				.catch(function(err) {  
					console.log('Error during getSubscription()', err);  
				});  
		});  
	}

	$scope.subscribeChange = function(){
		console.log($scope.args.pushStatus);
		if($scope.args.pushStatus){
			$scope.subscribe();
		}else{
			$scope.unsubscribe();
		}
	}

	$scope.subscribe = function(){
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
			serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
			.then(function(subscription){
				console.log(subscription,'subscribe');
				$timeout(function(){
					$scope.showPushButton = true;
					$scope.args.pushStatus = true;
				}, 100);
				// sendSubscriptionToServer(subscription);
			})
			.catch(function(e){
				if(Notification.permission === 'denied'){
					console.log('Permission for Notifications was denied');
					$scope.args.pushStatus = false;
				}else{
					console.error('Unable to subscribe to push.', e);
					$scope.args.pushStatus = false;
				}
			});
		});
	}

	$scope.unsubscribe = function(){  
	  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
	    serviceWorkerRegistration.pushManager.getSubscription().then(function(pushSubscription){
      	console.log(pushSubscription,'get status');
        if (!pushSubscription){
          $scope.showPushButton = false;
          return;
        }

        // var subscriptionId = pushSubscription.subscriptionId;
        // sendSubscriptionToServer(subscriptionId);

        pushSubscription.unsubscribe().then(function(successful){
        	console.log(successful,'unsubscribe');
        	$timeout(function(){
	        	$scope.showPushButton = false;
        	}, 100);
        }).catch(function(e){
					// sendSubscriptionToServer(subscriptionId);
          console.log('Unsubscription error: ', e);
        	$scope.showPushButton = false;
        });
      }).catch(function(e){
        console.error('Error thrown while unsubscribing from push messaging.', e);
      });
	  });
	}

		$scope.updateUIForPush = function(){
		if ('serviceWorker' in navigator) {  
			navigator.serviceWorker.register('sw.js')  
			.then($scope.initialiseState());  
		} else {  
			console.warn('Service workers aren\'t supported in this browser.');  
		}  
	}

	$scope.updateUIForPush();


	$scope.sendPushNotification = function(){
		console.log($scope.subscriptionId);
		$http({
			url: '/send-push',
			method: "POST",
			data: $scope.subscriptionId
		})
		.success(angular.bind(this,function(data, status, headers, config) {
			console.log(data, status);
		}))
		.error(angular.bind(this,function(data, status, headers, config) {
			console.log(data, status);
		}));
	}
}]);


