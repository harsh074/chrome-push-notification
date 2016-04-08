'use strict';

app.controller('registerCtrl',["$scope","$state","utilityService","ipCookie", function ($scope, $state, utilityService, ipCookie) {
	if($rootScope.token){
		console.log("logged in")
		$state.go('profile');
	}

	$scope.model = {'first_name':'','last_name':'','email':'','password':''};
	$scope.complete = false;
	
	// Registration
	$scope.register = function(formData){
		$scope.errors = [];
		if(formData.$valid){
			utilityService.register($scope.model)
			.then(function(data){
				$scope.setAuth(true);
				$state.go('profile');

			},function(data){
				// error case
				$scope.errors = data.user.email;
			});
		}
	}
}]);