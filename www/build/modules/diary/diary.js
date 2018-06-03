(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('diary', {
				needAuth: false,
				url: '/diary',
				title: "蜕蝶日记",
				templateUrl: 'modules/diary/diary.html',
			});

	}

})();