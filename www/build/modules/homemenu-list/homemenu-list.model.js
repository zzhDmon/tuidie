(function() {

    'use strict';

    angular
        .module('app')
        .factory('homeMenuListResultModel', homeMenuListResultModel);

    homeMenuListResultModel.$inject = ['$http', '$q', '$timeout', '$rootScope', 'CacheFactory', 'AppAuthenticationService', 'API', 'ENUM'];

    function homeMenuListResultModel($http, $q, $timeout, $rootScope, CacheFactory, AppAuthenticationService, API, ENUM) {

    	var service = {};

    	service.height = 0;
        service.products = [];

    	return service;
    }

})();
