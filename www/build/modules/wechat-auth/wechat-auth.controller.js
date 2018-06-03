/**
 * Created by howiezhang on 16/9/27.
 */
(function () {

	'use strict';

	angular
		.module('app')
		.controller('WeChatAuthController', WeChatAuthController);

	WeChatAuthController.$inject = ['$scope', '$http', '$window', '$location', '$timeout','AppAuthenticationService'];

	function WeChatAuthController($scope, $http, $window, $location, $timeout,AppAuthenticationService) {

		var callbackUrl = encodeURIComponent($window.location.protocol+"//"+$window.location.host+$window.location.pathname);

		var scope = "snsapi_userinfo";

		  if(AppAuthenticationService.getReferences()){
               var invite_code =  parseInt(AppAuthenticationService.getReferences());
    		   var locationRef = GLOBAL_CONFIG.API_HOST + "/v2/ecapi.auth.web?vendor=1"+"&scope="+scope+"&invite_code="+invite_code+"&referer=" + callbackUrl;
          }
          else{
			var locationRef = GLOBAL_CONFIG.API_HOST + "/v2/ecapi.auth.web?vendor=1"+"&scope="+scope+"&referer=" + callbackUrl;          	
          }



		$window.location.href = locationRef;
	}

})();