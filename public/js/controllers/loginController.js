var loginCtrl = angular.module('loginCtrl',[]);
loginCtrl.controller('loginController',function($scope,$http,$state,$location, authentication){
// we will store all of our fomr data in this object
    $scope.loginData = {};
    console.log($scope);
    
    //function to process the form
    $scope.processForm = function(form){
        console.log(form);
        console.log($scope.loginData);
        $http.post('/v1.0/api/login', $scope.loginData)
            .success(function(data){
                for(var key in form ) {
                    if(form[key] && form[key].$error){
                        form[key].$error.mongoose = null;
                    }
                }
                if(data.error){
                    console.log(data.error);
                    for( key in data.error.errors){
                        form[key].$error.mongoose = data.error.errors[key].message;   
                    }
                }else{
                    authentication.saveToken(data.token);
                    $state.go('form.status');
                }
            })
            .error(function(data){
                console.log(data);
            });
    };
    
});