var order_history = angular.module('order_history', []);
//defining the login controller
order_history.controller('order_history', function($scope, $http,$window,$location) {
   // $scope.test = [];
    $http.get("/try1").success(function(data) {
        $scope.test=JSON.stringify(data);
        $scope.elements=data;
        //alert(data);
        console.log(data);

        var count = Object.keys(data).length;
       // alert(count);
        alert($scope.test);


    })});
