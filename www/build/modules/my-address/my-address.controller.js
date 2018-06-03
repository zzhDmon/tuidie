(function () {

	'use strict';

	angular
		.module('app')
		.controller('MyAddressController', MyAddressController);

	MyAddressController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$location', '$state', 'API', 'ENUM', 'AddressEditModel', 'MyAddressModel'];

	function MyAddressController($scope, $http, $rootScope, $stateParams, $location, $state, API, ENUM, AddressEditModel, MyAddressModel) {

		$scope.touchCreate = _touchCreate;
		$scope.touchModify = _touchModify;

		$scope.myAddressModel = MyAddressModel;
		$scope.addressEditModel = AddressEditModel;

		$scope.touchDefaultAddress = _touchDefaultAddress;
		$scope.isDefaultAddress = _isDefaultAddress;

		function _touchCreate() {
			$scope.addressEditModel.clear();
			$scope.addressEditModel.consignee = null;

			$state.go('address-edit', {});
		}

		function _touchModify(consignee) {
			$scope.addressEditModel.clear();
			$scope.addressEditModel.consignee = consignee;

			$state.go('address-edit', {});
		}

		function  _isDefaultAddress(consignee) {
			if ( consignee.is_default ) {
				return true;
			}else {
				return false;
			}
		}

		function _touchDefaultAddress(consignee)  {
			// 请求网络 设置默认地址
			API.consignee.setDefault({
				consignee: consignee.id
			}).then(function(succeed) {
				if ( succeed ) {
					for (var i = 0; i < $scope.myAddressModel.consignees.length; i++) {
						var consignees = $scope.myAddressModel.consignees[i];
						if ( consignees.id == consignee.id ) {
							consignees.is_default = true;
						}
						else {
							consignees.is_default = false;
						}
					}
				}
				else {
					$scope.toast('设置失败');
				}
			});
		}

		$scope.myAddressModel.reload();
	}

})();
