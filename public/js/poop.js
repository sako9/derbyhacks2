// create our angular app and inject ngAnimate and ui-router
var app = angular.module('derbyhacks', ['formCtrl','loginCtrl','registerCtrl','navCtrl','ngAnimate', 'ui.router','angular-filepicker'])
    //Configuring our routes
    .config(function($stateProvider, $urlRouterProvider, filepickerProvider) {
        
        $urlRouterProvider.when('/form', '/home/login');
    
        $stateProvider
            .state('form', {
                url: '/form',
                abstract:true,
                templateUrl: 'partials/form.html'                
            })
            .state('form.app', {
                url: '/app',
                templateUrl:'partials/app.html',
                controller: 'formController'
            })
            .state('form.login', {
                url: '/login',
                templateUrl:'partials/login.html',
                controller: 'loginController'
            })
            .state('form.register', {
                url: '/register',
                templateUrl:'partials/register.html',
                controller: 'registerController'
            })
            .state('form.status', {
                url:'/dash', 
                templateUrl:'partials/status.html',
                controller: 'navController'
            })
            .state('home',{
                url:'/home',
                templateUrl: 'partials/home.html',
        });
    // catch all route
    // send userws to the form page
    
    $urlRouterProvider.otherwise('/home');
        filepickerProvider.setKey('AezsdZiIRTHqeZzMYGcacz');
});


app.run(['$rootScope', '$state', function($rootScope, $state, authentication) {

    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
        
      
    });
}]);
        
        
            
            