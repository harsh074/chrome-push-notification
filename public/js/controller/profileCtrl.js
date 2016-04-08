'use strict';
app.controller('profileCtrl',["$scope", "$rootScope", "$state", "utilityService",'notificationService', function($scope, $rootScope, $state, utilityService,notificationService) {
	$scope.editing = false;
	$scope.args ={"pushStatus":false};

	// Get Profile
	getprofile();
	function getprofile() {
		utilityService.profile()
		.then(function(data) {
			$scope.details = data;
			notificationService.initialize()
			.then(function(data){
				console.log(data);
			},function(data,message){
				console.log(data,message);
			})
		}, function(data) {
			$scope.errors = data.user;
			if (data.detail == "Invalid token") {
				utilityService.logout();
				$scope.setAuth(false);
			}
		});
	}

	// Updating the profile
	$scope.editmode = function() {
		$scope.editing = true;
		$scope.profileData = angular.copy($scope.details);
	}

	$scope.reset = function() {
		$scope.profileData = angular.copy($scope.details);
		$scope.editing = false;
		window.scrollTo(0, 0);
	}


	$scope.changeNotificationSatus = function(){
		
	}
}]);