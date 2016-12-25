var resetCtrl = angular.module('resetCtrl',[]);
resetCtrl.controller('resetController',function($scope,$http,$state,$location){
// we will store all of our fomr data in this object
    $scope.resetData = {};
    $scope.message = null;
    
    //function to process the form
    $scope.processForm = function(form){
        $http.post('/v1.0/api/reset', $scope.resetData)
            .success(function(data) {
                $scope.message = null;
                
                settimeout(function(){ $state.go("form.status");},1000);
              }).error(function(data){
                $scope.message = data.message;
            });
        
    };
    
});