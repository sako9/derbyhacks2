var formCtrl = angular.module('formCtrl',[]);
formCtrl.controller('formController',function($scope,$http,filepickerService,authentication,$state){
    // we will store all of our fomr data in this object
    $scope.appData = {};
    
    
    //function to process the form
    $scope.processForm = function(form){
        var headers = { Authorization: 'Bearer '+ authentication.getToken() };
        console.log($scope.appData);
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
                console.log(JSON.stringify(Blob));
                $scope.appData.resume = Blob.url;
                $scope.$apply();
            }
            );
    };
});