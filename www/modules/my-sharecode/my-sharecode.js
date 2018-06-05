(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('my-sharecode', {
				needAuth: true,
				url: '/my-sharecode/:id',
				title: "推荐码",
				templateUrl: 'modules/my-sharecode/my-sharecode.html',
			});

	}

})();