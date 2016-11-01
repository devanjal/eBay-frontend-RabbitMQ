
var cartApp = angular.module('cartApp', []);

cartApp.controller('cartController', function ($scope, $http,$window) {
   // alert("in shopping_cart Conrtoller");
   // $scope.test = [];
    var total = 0;
    $http.get("/getCart").success(function (data) {
          //  alert(JSON.stringify(data));
         //   $scope.test = response.items;
        $scope.cartTotal = data.sum;
        $scope.test=JSON.stringify(data);
        $scope.test=data.items;
        alert(test);
        console.log(data);
        //alert(data.sum);

        var count = Object.keys(data).length;
        //alert(count);
       // alert($scope.test);

    });
    
    $scope.removeProduct = function (item_id) {
        var x= item_id;
        alert(x);


        $http({
            method : "POST",
            url : "/removeCart",
            data : {
                "item_id":x
            }
        }).success(function (response) {
            $scope.test = response.cartData;
            $scope.cartTotal = response.cartTotal;
            $window.location = '/getproduct';
        });
    }

    
});