//loading the 'login' angularJS module
var login = angular.module('login', []);
//defining the login controller
login.controller('login', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(data) {
			//checking the response data for statusCode
			//alert(data.status);
			if (data.status == "Fail") {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
				//$scope.existingUser='Account Already Exist';
				//alert('wrong email/password')
			}
			else{
				alert("success")
				window.location.assign("/product");}
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;

		});
	};
})
