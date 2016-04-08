'use strict';
app.controller('loginCtrl',["$scope","$state","utilityService",'CONSTANTS', function ($scope, $state, utilityService,CONSTANTS) {
	if(CONSTANTS.AUTHENTICATED){
		$state.go('profile');
	}
	else {
		$scope.model = {'email': '', 'password': '', 'staySign': false};
		$scope.complete = false;
		$scope.authenticated = false;
		$scope.login = function (formData) {
			$scope.submitted = true;
			if (formData.password.$error.minlength) {
				$scope.minlength = true;
				$scope.model.password = "";
			}
			if (formData.email.$error.pattern) {
				$scope.pattern = true;
			}
			if (formData.$valid) {
				utilityService.login($scope.model)
					.then(function (data) {
						// success case
						$scope.complete = true;
						CONSTANTS.AUTHENTICATED = true;
						$scope.setAuth(true);
						$state.go('profile');
					}, function (data) {
						// error case
						$scope.error = data.message;
					});
			}
		}
	}
}]);