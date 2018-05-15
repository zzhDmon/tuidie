(function () {

	'use strict';

	angular
		.module('app')
		.factory('MyRecommendModel', MyRecommendModel);

	MyRecommendModel.$inject = ['$http', '$q', '$timeout', '$rootScope', 'CacheFactory', 'AppAuthenticationService', 'API', 'ENUM'];

	function MyRecommendModel($http, $q, $timeout, $rootScope, CacheFactory, AppAuthenticationService, API, ENUM) {

		var service = {};
		service.reload = _reload;
		service.fetch = _fetch;
		service.getChildren=_getChildren;

		return service;

		function _reload() {

			if (!AppAuthenticationService.getToken())
				return;

			this.fetch();
			this.getChildren();
		}



		function _fetch() {

			if (!AppAuthenticationService.getToken())
				return;

			var _this = this;
			var params = {
			};

			API.recommend.bonusInfo(params).then(function (bonus_info) {
				_this.bonus_info = bonus_info;
			});

		}


		function _getChildren() {

			if (!AppAuthenticationService.getToken())
				return;

			var _this = this;
			
			API.user.getChildren().then(function (children) {
				_this.children = children;
			});

		}

	}

})();