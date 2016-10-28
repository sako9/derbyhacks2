var formCtrl = angular.module('formCtrl',[]);
formCtrl.controller('formController',function($scope,$http,filepickerService,authentication,$state){
    // we will store all of our fomr data in this object
    $scope.appData = {};
    $scope.update = false;
    
    
    if(authentication.isLoggedIn()){
        var headers = { Authorization: 'Bearer '+ authentication.getToken() };
        $http.get('/v1.0/api/application',{ headers: headers })
            .success(function(data){
                if(data._application){
                    $scope.appData = data._application;
                    $scope.update = true;
                }else if(data.error){
                    alert(data.error);
                }
            })
            .error(function(data){
            });
    }
    
    //function to process the form
    $scope.processForm = function(form){
        var headers = { Authorization: 'Bearer '+ authentication.getToken() };
        console.log(form);
        if(!$scope.update){
            $http.post('/v1.0/api/apply', $scope.appData,{ headers: headers })
                .success(function(data){
                    for(var key in form ) {
                        if(form[key] && form[key].$error){
                            form[key].$error.mongoose = null;
                        }
                    }
                    if(data.error){
                        console.log(data.error);
                        for( key in data.error.errors){
                            if(form[key] && form[key].$error){
                                form[key].$error.mongoose = data.error.errors[key].message; 
                            }
                        }
                    }else{
                        $state.go('form.status');
                    }
                })
                .error(function(data){
                });
        }else{
            $http.patch('/v1.0/api/application', $scope.appData,{ headers: headers })
                .success(function(data){
                    for(var key in form ) {
                        if(form[key] && form[key].$error){
                            form[key].$error.mongoose = null;
                        }
                    }
                    if(data.error){
                        console.log(data.error);
                        for( key in data.error.errors){
                            if(form[key] && form[key].$error){
                                form[key].$error.mongoose = data.error.errors[key].message; 
                            }
                        }
                    }else{
                        $state.go('form.status');
                    }
                })
                .error(function(data){
                });
        }
    };

    

     //Single file upload,take a look ath the options
    $scope.upload = function(){
        filepickerService.pick(
            {
                extension: '.pdf',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE'],
                openTo: 'BOX'
            },
            function(Blob){
                $scope.appData.resume = Blob.url;
                $scope.$apply();
            }
            );
    };
});