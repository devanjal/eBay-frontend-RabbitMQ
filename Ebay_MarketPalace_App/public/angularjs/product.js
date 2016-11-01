var product = angular.module('product', []);
//defining the login controller
product.controller('product', function($scope, $http,$window) {
	$scope.dest = [

		{ id: 1, name: "true"},
		{ id: 2, name: "false"},];
	$scope.bid=$scope.dest[0],
		$scope.onDestChange = function () {

			//   $window.alert("Selected Value: " + $scope.item.id + "\nSelected Text: " + $scope.item.name);
		}

	$scope.submit = function() {

		$http({
			method : "POST",
			url : '/products',
			data : {
				"product_name":$scope.product_name,
				"description":$scope.desc,

				"ship_location":$scope.shipAdd,
				"cost":$scope.cost,
				"quantity":$scope.quantity,
				"bid_value":$scope.bid.name,
				"date":$scope.date,

			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.validlogin = true;

			}
			else
			{

				console.log("1");
				$window.location='/Product';
				alert("Item Posted Successfully");
			}

			//Making a get call to the '/redirectToHomepage' API
			//window.location.assign("/homepage");
		}).error(function(error) {
//			$scope.validlogin = true;
//			$scope.invalid_login = true;
//			alert("yes/no")
			console.log("2");
		});
	};
})
	