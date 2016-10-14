var registerCtrl = angular.module('registerCtrl',[]);
registerCtrl.controller('registerController',function($scope,$http,$location,authentication,$state){
    // we will store all of our fomr data in this object
    $scope.formData = {};
    if(authentication.isLoggedIn()){
        $state.go("form.status");
    }
    
    //function to process the form
    $scope.processForm = function(form){
        console.log($scope.formData);
        $http.post('/v1.0/api/register', $scope.formData)
            .success(function(data){
                for(var key in form ) {
                    if(form[key] && form[key].$error){
                        form[key].$error.mongoose = null;
                    }
                }
                if(data.error){
                    for( key in data.error.errors){
                        form[key].$error.mongoose = data.error.errors[key].message;   
                    }
                }else{
                    authentication.saveToken(data.token);
                    $state.go('form.status');
                }
            })
            .error(function(data){
            });
    };
        
});
    
