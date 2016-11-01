var bid_log = angular.module('bid_log', []);
//defining the login controller
bid_log.controller('bid_log', function($scope, $http,$window,$location) {
    $scope.test = [];
    $http.get("/bid_log1").success(function(data) {
        $scope.test=data;
        console.log($scope.test);

    })});
