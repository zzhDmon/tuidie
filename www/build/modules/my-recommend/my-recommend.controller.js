(function () {

    'use strict';

    angular
    .module('app')
    .controller('MyRecommendController', MyRecommendController);

    MyRecommendController.$inject = ['$scope', '$http', '$window', '$location', '$state', '$rootScope', 'API', 'MyRecommendModel'];

    function MyRecommendController($scope, $http, $window, $location, $state, $rootScope, API, MyRecommendModel) {


        $scope.myRecommendModel = MyRecommendModel;
        $scope.myRecommendModel.reload();
        // myRecommendModel.bonus_info.rules
        if($scope.myRecommendModel.bonus_info.rules.length>2){
            $scope.myRecommendrules=$scope.myRecommendModel.bonus_info.rules.slice(0,2)
        }else{
            $scope.myRecommendrules=$scope.myRecommendModel.bonus_info.rules
        }

    }

})();
