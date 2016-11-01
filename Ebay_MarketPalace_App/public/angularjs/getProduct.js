var getUser = angular.module('getUser', []);
//defining the login controller
getUser.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<=max; i++)
            input.push(i);
        return input;
    };
});
getUser.controller('getUser', function($scope, $http,$window,$location) {
        //    $scope.test = [];
            $http.get("/test").success(function(data) {
            $scope.test=JSON.stringify(data);
               $scope.test=data;
                //alert(data);

                var count = Object.keys(data).length;
                alert(count);
                alert($scope.test);

            });

    $scope.submit = function(req,res) {


        //$scope.item_id

        $http({
            method : "POST",
            url : '/addcart',
            data : {

                "selectedQuantitiy":$scope.selectedQuantity,
                "item_id": $scope.item_id,

            }
        }).success(function(data) {

            $scope.test=data.statuscode;

            if (data.statuscode==401) {

                $scope.invalid_login = true;
                $scope.validlogin = false;
            }

            else
            {
                $scope.invalid_login = true;
                $scope.validlogin = false;
               // $scope.var=data.fname;
                //alert("not ")
                //	console.log("2");
                $window.location = '/product';


            }


        }).error(function(error) {
//			$scope.validlogin = true;
//			$scope.invalid_login = true;

            console.log("2");
        });
     };
});

