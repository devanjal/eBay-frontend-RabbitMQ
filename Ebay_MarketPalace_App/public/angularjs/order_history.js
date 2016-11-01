var order_history = angular.module('order_history', []);
//defining the login controller
order_history.controller('order_history', function($scope, $http,$window,$location) {
    $scope.test = [];
    $http.get("/order").success(function(data) {
        $scope.test=data;
        console.log($scope.test);
        alert($scope.test)
    })});
var buy_history = angular.module('buy_history', []);
//defining the login controller
buy_history.controller('buy_history', function($scope, $http,$window,$location) {
    $scope.test = [];
    $http.get("/buylist").success(function(data) {
        $scope.test=data;
        console.log($scope.test);
        alert($scope.test)
    })});
