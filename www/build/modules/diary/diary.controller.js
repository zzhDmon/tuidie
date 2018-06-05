(function () {

    'use strict';

    angular
    .module('app')
    .controller('MDiaryController', MDiaryController);

    MDiaryController.$inject = ['$scope', '$http', '$window', '$location', '$state', '$rootScope', 'API'];

    function MDiaryController($scope, $http, $window, $location, $state, $rootScope, API) {
		var per_page=10;
		$scope.isEmpty = false;
        $scope.isLoaded = false;
        $scope.isLoading = false;
        $scope.isLastPage = false;
        
        $scope.loadMore=_loadMore
        
         function _reload() {
            if ($scope.isLoading)
                return;

			$scope.diaryList=null;
            $scope.isEmpty = false;
            $scope.isLoaded = false;

            _fetch(1, per_page);
        }

        function _loadMore() {
            if ($scope.isLoading)
                return;
            if ($scope.isLastPage)
                return;
            if ($scope.diaryList && $scope.diaryList.length) {
            	if($scope.diaryList.length%2){
            		console.log(411)
            		return;
            	}
                _fetch(($scope.diaryList.length / per_page) + 1, per_page);
            } else {
                _fetch(1, per_page);
            }
        }

        function _fetch(page, perPage) {
            $scope.isLoading = true;

             API.article
                .list({
                	id:13,
                    page: page,
                    per_page: perPage
                })
                .then(function(resData) {
                    $scope.diaryList = $scope.diaryList ? $scope.diaryList.concat(resData.articles) : resData.articles;
                    
	                $scope.isEmpty = ($scope.diaryList && $scope.diaryList.length) ? false : true;
	                $scope.isLoaded = true;
	                $scope.isLoading = false;
	                $scope.isLastPage = (resData.articles && resData.articles.length < per_page) ? !$scope.isEmpty : false;
	            
                });
        }

        _reload();
        
       
                
        
        $scope.articleDetail=function(article){
        	 $state.go('diary-detail',{url:article.link})
        }
        function _touchNotice(notice) {
            var url = '';
            if (notice.url.indexOf("http://", 0) == -1) {
                url = "http://" + notice.url;
            } else {
                url = notice.url;
            }
            $window.location.href = url;
        }
    }

})();
