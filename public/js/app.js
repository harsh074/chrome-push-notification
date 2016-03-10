var app = angular.module('chromePushNotify', []);

app.controller('MainCtrl',['$scope','$timeout', function($scope,$timeout) {
	$scope.showPushButton = false;
	$scope.pushToggle = true;
	$scope.args ={"pushStatus":"false"};

	$scope.updateUIForPush = function(pushToggleSwitch){
		if ('serviceWorker' in navigator) {  
			navigator.serviceWorker.register('sw.js')  
			.then($scope.initialiseState);  
		} else {  
			console.warn('Service workers aren\'t supported in this browser.');  
		}  
	}
	
	var toggleSwitch = document.querySelector('.js-push-toggle-switch');
	toggleSwitch.initialised = false;

	// This is to wait for MDL initialising
	document.addEventListener('mdl-componentupgraded', function() {
		if (toggleSwitch.initialised) {
			return;
		}
		toggleSwitch.initialised = toggleSwitch.classList.contains('is-upgraded');
		if (!toggleSwitch.initialised) {
			return;
		}
		var pushToggleSwitch = toggleSwitch.MaterialSwitch;
		$scope.updateUIForPush(pushToggleSwitch);
	});



	$scope.initialiseState = function() {  
		if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
			console.warn('Notifications aren\'t supported.');  
			return;  
		}
		if (Notification.permission === 'denied') {  
			console.warn('The user has blocked notifications.');  
			return;  
		}
		if (!('PushManager' in window)) {  
			console.warn('Push messaging isn\'t supported.');  
			return;  
		}
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
			serviceWorkerRegistration.pushManager.getSubscription()  
				.then(function(subscription) {
					$timeout(function(){
						$scope.pushToggle = false;
					}, 100);  
					if (!subscription) {  
						return;  
					}
					// sendSubscriptionToServer(subscription);
				})  
				.catch(function(err) {  
					console.warn('Error during getSubscription()', err);  
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
				// return sendSubscriptionToServer(subscription);
			})
			.catch(function(e){
				if(Notification.permission === 'denied'){
					console.warn('Permission for Notifications was denied');
					$scope.args.pushStatus = false;
				}else{
					console.error('Unable to subscribe to push.', e);
					$scope.args.pushStatus = false;
				}
			});
		});
	}
}]);


