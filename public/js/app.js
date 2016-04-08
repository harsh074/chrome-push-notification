var app = angular.module('chromePushNotify', ['ipCookie', 'ngResource', 'ngSanitize', 'ngAnimate', 'ui.router', 'ui.bootstrap','toastr']);
app.run(['CONSTANTS','ipCookie', function(CONSTANTS,ipCookie){
	if(CONSTANTS.PRODUCTION_MODE) {
		if(window.console && window.console.log){
			window.console.log = function() {};
		}
		if(window.alert){
			window.alert = function() {};
		}
	}
}]);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'partials/login.html',
			controller: 'loginCtrl'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'partials/register.html',
			controller:"registerCtrl"
		})
		.state('logout', {
			url: '/logout',
			templateUrl: 'partials/logout.html'
		})
		.state('home', {
			url: '/home',
			templateUrl: 'partials/home.html'
		})

		// Profile
		.state('profile', {
			url: '/profile',
			templateUrl: 'partials/profile.html',
			controller:'profileCtrl'
		});

		$urlRouterProvider.otherwise('/login');
}]);
