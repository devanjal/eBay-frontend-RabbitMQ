var profile = angular.module('profile', []);
//defining the login controller
profile.controller('profile', function($scope, $http,$window) {
    $scope.submit = function() {
        $http({
            method : "POST",
            url : '/setProfile',
            data : {
                "ebay_handle" : $scope.ebay_handle,
                "dob" : $scope.dob,
                "phone"	:$scope.phone,


            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statuscode==401) {
                $scope.invalid_login = false;
                $scope.validlogin = true;
                alert("invalid Input")
                $window.location.assign("/profile");;
            }
            else
            {
                $scope.invalid_login=true;
                $scope.validlogin=false;
                console.log("1");
                $window.location.assign("/view_Profile");

                alert("Profile Setup Successful!!!!")

            }
        }).error(function(error) {
            console.log(error);
        });
    };
});
