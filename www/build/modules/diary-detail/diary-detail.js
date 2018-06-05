(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('diary-detail', {
				needAuth: true,
				url: '/diary-detail/:url',
				title: "日记详情",
				templateUrl: 'modules/diary-detail/diary-detail.html',
			});

	}

})();