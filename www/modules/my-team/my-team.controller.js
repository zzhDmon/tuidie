(function () {

    'use strict';

    angular
    .module('app')
    .controller('MyTeamController', MyBalanceController);

    MyBalanceController.$inject = ['$scope', '$http', '$window', '$location', '$state', '$rootScope', 'API'];

    function MyBalanceController($scope, $http, $window, $location, $state, $rootScope, API) {

        

    }

})();
