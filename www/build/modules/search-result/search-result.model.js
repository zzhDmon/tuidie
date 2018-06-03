(function() {

    'use strict';

    angular
        .module('app')
        .factory('SearchResultModel', SearchResultModel);

    SearchResultModel.$inject = ['$http', '$q', '$timeout', '$rootScope', 'CacheFactory', 'AppAuthenticationService', 'API', 'ENUM'];

    function SearchResultModel($http, $q, $timeout, $rootScope, CacheFactory, AppAuthenticationService, API, ENUM) {

    	var service = {};

    	service.height = 0;
        service.products = [];

    	return service;
    }

})();
