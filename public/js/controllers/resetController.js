var resetCtrl = angular.module('resetCtrl',[]);
resetCtrl.controller('resetController',function($scope,$http,$state,$location){
// we will store all of our fomr data in this object
    $scope.resetData = {};
    $scope.message = null;
    
    //function to process the form
    $scope.processForm = function(form){
        $("#reset").hide();
        $http.post('/v1.0/api/reset', $scope.resetData)
            .success(function(data) {
                $scope.message = null;
                $("#success").show();
                setTimeout(function(){ $state.go("form.status");},1000);
              }).error(function(data){
                $("#reset").show();
                $scope.message = data.message;
            });
        
    };
    
});