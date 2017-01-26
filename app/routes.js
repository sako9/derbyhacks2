var jwt = require('express-jwt');
var config = require('../config/config');
var auth = jwt({
  secret: config.secret,
  userProperty: 'payload'
});
module.exports = function (router) {
    
    var user = require('./controllers/user');
    var application = require('./controllers/application');
    var stats = require('./controllers/stats');
    var email = require('./controllers/email');
    
    /*
    Routes
    */
    
    
    //user routes
    router.post('/register', user.register);
    router.post('/login', user.login);
    router.get('/users', auth, user.getAll);
    router.get('/users/:id', auth, user.getOne);
    router.post('/reset', user.resetPassword);
    router.patch('/user', auth, user.patch);
    router.patch('/user/:id', auth, user.patchById);
    router.delete('/user/:id',auth, user.delete);
    
    //application routes
    router.post('/apply', auth, application.create);
    router.get('/application', auth, application.getOne);
    router.get('/application/:id',auth, application.getOneById);
    router.patch('/application', auth, application.update);
    router.patch('/application/:id', auth, application.updatebyid);
    router.get('/applications',auth,application.getAll);
    
    //Email routes
    router.get('/emails', auth, email.get);
    router.post('/emails',auth, email.post);
    router.delete('/emails/:id', auth, email.delete);
    
    // stats
  router.get('/stats/registrations',  stats.registrations);
  router.get('/stats/shirts',  stats.shirts);
  router.get('/stats/dietary',  stats.dietary);
  router.get('/stats/gender',  stats.gender);
  router.get('/stats/schools',  stats.schools);
  router.get('/stats/count',  stats.count);


    
};