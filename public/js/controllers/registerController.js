var registerCtrl = angular.module('registerCtrl',[]);
registerCtrl.controller('registerController',function($scope,$http,$location,authentication,$state){
    // we will store all of our fomr data in this object
    $scope.formData = {};
    $scope.errmess = null;
    if(authentication.isLoggedIn()){
        $state.go("form.status");
    }
    
    //function to process the form
    $scope.processForm = function(form){
        console.log($scope.formData);
        $http.post('/v1.0/api/register', $scope.formData)
            .success(function(data){
                $scope.errmess = null;
                if(data.error){
                    if(data.error.code = 11000){
                        $scope.errmess = "That email is already in use";
                    }else{
                        $scope.errmess = "There was an error";
                    }

                }else{
                    authentication.saveToken(data.token);
                    $state.go('form.app');
                }
            })
            .error(function(data){
            });
    };
        
});
    
