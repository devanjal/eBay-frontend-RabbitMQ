var product = angular.module('product', []);
//defining the login controller
product.controller('product', function($scope, $http,$window) {
    $scope.submit = function() {

        $http({
            method : "GET",
            url : '/viewProducts',
            data : {
                "id" : $scope.id,
                "name":$scope.name,
                "desc":$scope.desc,
                "seller":$scope.seller,
                "shipAdd":$scope.shipAdd,
                "cost":$scope.cost,
                "quantity":$scope.quantity,
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
                $window.location='/'
                alert("yes");
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
    submit();
})
