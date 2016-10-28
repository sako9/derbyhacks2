var navCtrl = angular.module('navCtrl',[]);
navCtrl.controller('navController',function($scope,$http,$state,$location, authentication){
    $scope.user = {};
    $scope.application = {};
    $scope.user.isLoggedIn = authentication.isLoggedIn();
    $scope.user.currentUser = authentication.currentUser();
    if($scope.user.isLoggedIn){
        var headers = { Authorization: 'Bearer '+ authentication.getToken() };
        $http.get('/v1.0/api/application',{ headers: headers })
            .success(function(data){
                if(data._application === undefined || data._application === null ){
                   $scope.application.status = 'Application Not submitted';
                }else if(data.error){
                    alert(data.error);
                }else{
                    $scope.application = data._application;
                }
            })
            .error(function(data){
            });
    }
    
    $scope.getApp = function(){
        var headers = { Authorization: 'Bearer '+ authentication.getToken() };
        $http.get('/v1.0/api/application',{ headers: headers })
            .success(function(data){
                if(data.error){
                   alert(data.error);
                }else{
                    $scope.application = data;
                }
            })
            .error(function(data){
            });
    }
    
    if(!authentication.isLoggedIn()){
        $state.go('form.login');
    }
    
    
    $scope.logout = function(){
        if($scope.user.isLoggedIn){
            authentication.logout();
            $state.go("form.login");
        }
    }
    
});