(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('my-team', {
				needAuth: true,
				url: '/my-team',
				title: "团队",
				templateUrl: 'modules/my-team/my-team.html',
			});

	}

})();