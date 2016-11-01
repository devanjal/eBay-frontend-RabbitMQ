var viewProfile = angular.module('viewProfile', []);
//defining the login controller
viewProfile.controller('viewProfile', function($scope, $http,$window,$location) {
    $scope.test = [];
    $http.get("/viewProfile").success(function(data) {
        $scope.test=data;
        console.log($scope.test);
        alert($scope.test)
    })});