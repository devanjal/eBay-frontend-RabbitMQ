var creditcard = angular.module('creditcard', []);
//defining the login controller
creditcard.controller('creditcard', function($scope, $http,$window) {
    $scope.submit = function() {
        alert("in controller");
        $scope.name_length=$scope.name.toString().length;
        $scope.creditcard_length=$scope.creditcard.toString().length;
        $scope.cvv_length=$scope.cvv.toString().length;
        $scope.year_length=$scope.year.toString().length;
        $scope.month_length=$scope.month.toString().length;
        $scope.object_id="Credit Card Page";
        alert($scope.creditcard_length);
        $http({
            method : "POST",
            url : '/validation',
            data : {
                "cardname" : $scope.name,
                "card_no" : $scope.creditcard,
                "cvv"		:$scope.cvv,
                "year": $scope.year,
                "month":$scope.month,
                "creditcard_length":$scope.creditcard_length,
                "cvv_length":$scope.cvv_length,
                "year_length":$scope.year_length,
                "month_length":$scope.month_length,
                "object_id":$scope.object_id,

            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statuscode==401) {
                $scope.invalid_login = false;
                $scope.validlogin = true;
                alert("Invalid information reason(s) "+data.scard+"  "+data.scvv+"  "+data.sdate);
                //alert("Email already in use... Try other email")
                //$window.location.assign("/signup");;
            }
            else
            {
                $scope.invalid_login=true;
                $scope.validlogin=false;
                console.log("1");
                alert("Valid Successful")
                //"scard":scard, "scvv":scvv,"sdate":sdate
                $window.location.assign("/success");

                //alert("Signup Successful")

            }
        }).error(function(error) {
            console.log(error);
        });
    };
});
