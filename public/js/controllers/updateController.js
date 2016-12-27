var updateCtrl = angular.module('updateCtrl',[]);
updateCtrl.controller('updateController',function($scope,$http,$state,$location,authentication){
// we will store all of our fomr data in this object
    $scope.updateData = {};
    $scope.message = null;
    
    if(!authentication.isLoggedIn()){
        $state.go('form.login');
    }
    
    //function to process the form
    
    $scope.processForm = function(form){
        if($scope.updateData.password !== $scope.updateData.repassword){
            $scope.message = "Passwords do not match"
        }else{
            $("#update").hide();
            var headers = { Authorization: 'Bearer '+ authentication.getToken() };
            $http.patch('/v1.0/api/user', $scope.updateData, { headers: headers })
                .success(function(data) {
                    $scope.message = null;
                    $("#success").show();
                    setTimeout(function(){ $state.go("form.status");},1000);
                  }).error(function(data){
                    $("#update").show();
                    $scope.message = data.message;
                });
        }
        
    };
    
});