(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('my-weixin', {
				needAuth: true,
				url: '/my-weixin',
				title: "微信",
				templateUrl: 'modules/my-weixin/my-weixin.html',
			});

	}

})();