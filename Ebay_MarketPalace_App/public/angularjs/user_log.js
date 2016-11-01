var user_log = angular.module('user_log', []);
//defining the login controller
user_log.controller('user_log', function($scope, $http,$window,$location) {
    $scope.test = [];
    $http.get("/test2").success(function(data) {
        $scope.test=data;
        console.log($scope.test);

    })});
