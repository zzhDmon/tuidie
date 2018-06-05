(function () {

    'use strict';

    angular
    .module('app')
    .controller('MyShareCodeController', MyShareCodeController);

    MyShareCodeController.$inject = ['$scope', '$http', '$window', '$location', '$state','$stateParams', '$rootScope', 'API'];

    function MyShareCodeController($scope, $http, $window, $location, $state,$stateParams, $rootScope, API) {

        $scope.id=$stateParams.id
        console.log($scope.id)
        var qrcode = new QRCode(document.getElementById("sharecode_qrcode"), {
            text: "http://app.tuidie.top/h5/?u="+$scope.id+"#/signin",
            width: 150,
            height: 150,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

})();
