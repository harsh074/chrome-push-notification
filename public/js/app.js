var app = angular.module('chromePushNotify', ['ipCookie', 'ngResource', 'ngSanitize', 'ngAnimate', 'ui.router', 'ui.bootstrap','toastr']);


app.config(['$stateProvider', function($stateProvider) {
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


}]);
