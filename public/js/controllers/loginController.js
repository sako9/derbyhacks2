var loginCtrl = angular.module('loginCtrl',[]);
loginCtrl.controller('loginController',function($scope,$http,$state,$location, authentication){
// we will store all of our fomr data in this object
    $scope.loginData = {};
    $scope.message = null;
    if(authentication.isLoggedIn()){
        $state.go("form.status");
    }
    
    //function to process the form
    $scope.processForm = function(form){
        $http.post('/v1.0/api/login', $scope.loginData)
            .success(function(data) {
                $scope.message = null;
                authentication.saveToken(data.token);
                $state.go("form.status");
              }).error(function(data){
                $scope.message = data.message;
            });
        
    };
    
});