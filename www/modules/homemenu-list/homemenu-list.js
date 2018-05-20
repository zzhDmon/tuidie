(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('homemenuList', {
				needAuth: false,
				url: '/home/homemenulist/:type',
				title: "商品分类",
				templateUrl: 'modules/homemenu-list/homemenu-list.html',
			});

	}

})();