(function () {

    'use strict';

    angular
    .module('app')
    .controller('diaryDetailController', diaryDetailController);

    diaryDetailController.$inject = ['$scope','$sce', '$http', '$window', '$location', '$state','$stateParams', '$rootScope', 'API'];

    function diaryDetailController($scope ,$sce, $http, $window, $location, $state,$stateParams, $rootScope, API) {      
        
        $scope.url=$stateParams.url
        
        $scope.otherSrc = $sce.trustAsResourceUrl($scope.url);
      

        jQuery.ajaxPrefilter( function (options) {
            console.log(options)
        　　　　if (options.crossDomain && jQuery.support.cors) {
            　　　　var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            　　　　options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        　　　　};
    　　});
　　　　var showSrc = $scope.otherSrc
　　　　jQuery.get( showSrc, function (response){
　　　　 　　var html = response;
　　　　　　 html = html.replace(/data-src/g, "src").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '').replace(/https/g,'http');

　　　　　　 $scope.html_src = 'data:text/html;charset=utf-8,' + html;
            $('#detail_iframe').attr("src" , $scope.html_src);
　　　　});
    }

})();
