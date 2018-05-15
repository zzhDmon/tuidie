(function () {

	'use strict';

	angular
		.module('app')
		.controller('AddressSelectController', AddressSelectController);

	AddressSelectController.$inject = ['$scope', '$http', '$stateParams', '$rootScope', '$state', 'API', 'ENUM', 'AddressEditModel', 'AddressSelectModel'];

	function AddressSelectController($scope, $http, $stateParams, $rootScope, $state, API, ENUM, AddressEditModel, AddressSelectModel) {

		$scope.selectedId = $stateParams.address;

		$scope.addressSelectModel = AddressSelectModel;

		$scope.touchCreate = _touchCreate;
		$scope.touchModify = _touchModify;
		$scope.touchConsignee = _touchConsignee;

		$scope.touchDefaultAddress = _touchDefaultAddress;
		$scope.isDefaultAddress = _isDefaultAddress;

		$scope.addressEditModel = AddressEditModel;

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

		function _touchConsignee(consignee) {
			$rootScope.$emit('consigneeChanged', consignee);
			$scope.goBack();
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

		$scope.addressSelectModel.clear();
		$scope.addressSelectModel.reload();
	}

})();
