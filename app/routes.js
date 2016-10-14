var jwt = require('express-jwt');
var config = require('../config/config');
var auth = jwt({
  secret: config.secret,
  userProperty: 'payload'
});
module.exports = function (router) {
    
    var user = require('./controllers/user');
    var application = require('./controllers/application');
    
    /*
    Routes
    */
    
    
    //user routes
    router.post('/register', user.register);
    router.post('/login', user.login);
    router.get('/users', auth, user.getAll);
    
    //application routes
    router.post('/apply', auth, application.create);
    router.get('/application', auth, application.getOne);
    router.patch('/application', auth, application.update);

    
};