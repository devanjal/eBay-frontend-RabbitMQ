//loading the 'login' angularJS module
var signup = angular.module('signup', []);
//defining the login controller
signup.controller('signup', function($scope, $http,$window) {

	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/checkSignup',
			data : {
				"first_name": $scope.fname,
				"last_name":$scope.lname,
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.status == "Fail") {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
				//alert("shit");
				$scope.existingUser='Account Already Exist';
			}
			else if (data.status == "Fail2") {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
				//alert("shit");
				$scope.existingUser='Fill First Name and Last Name Correctly';
			}
			else{
			//Making a get call to the '/redirectToHomepage' API
				alert("Signup Successful")
			window.location.assign("/login");
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
})
