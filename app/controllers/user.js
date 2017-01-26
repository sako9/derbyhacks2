var passport = require('passport');
var mongoose = require('mongoose');
var uuid = require('uuid');
var User = require('../models/user');
var Email = require('../models/email');
// App routes
module.exports = {

        /*
         * Get route to retrieve all users
         * Todo: make it so only admins can access route
         */
        getAll :(req, res) => {
            //Query the DB if no errors, send all users
            var query = User.find().populate('_application');
            query.exec(function(err, users){
                if(err){ res.json({error: err}); }
                //if no errors, send them back to the client
                return res.json(users);
            });
        },
        /*
         * Post route to save a new user into the DB.
         */
        register: (req, res) =>{
            //create new user
            var newUser = new User();
            //Save it into the DB.
            newUser.email= req.body.email;
            newUser.password = req.body.password;
            if(req.body.role) newUser.role = req.body.role;
            console.log(newUser);
            
            newUser.validate(function(error){
                if(error){
                   return res.json({
                        error: error});
                }else{
                    newUser.save(function(err){
                        //If no errors, redirect to main page
                        // add token here ?
                        if(err){ 
                            res.json({
                                error: err});
                        }else{
                        var token
                        token = newUser.generateJwt();
                        res.status(200);
                        return res.json({
                            "token":token
                        });
                        }
                    });
                }
            });
        },
    
        /*
         * Login a user using passport, if successful return token to the user
         */
        login: (req,res) =>{
              passport.authenticate('local', function(err, user, info){
                var token;

                // If Passport throws/catches an error
               if(err){ 
                   if(err){ return res.json({error: err}); }
               }else if(user){
                  token = user.generateJwt();
                  res.status(200);
                  return res.json({
                    "token" : token
                  });
                } else {
                  // If user is not found
                  return res.status(404).json(info);
                }
              })(req, res);
        
        },
        
        /*
        * Get a single user based on id.
        */
        getOne: (req, res) =>{
            if(! req.payload._id || (req.payload.role != "staff" && req.payload.role != "admin")){
                return res.status(401).json({
                    "message" : "Unauthorized"
                });
            }else{
            User.findById(req.params.id, function(err, user){
                if(err){ res.json({error: err}); }
                //If no errors, send it back to the client
                return res.json(user);
            });
            }
        },
      delete: (req,res) =>{
          if(!req.payload._id || (req.payload.role != "staff" && req.payload.role != "admin")){
              res.status(401).json({
                  "message" : "Unauthorized",
                  "req" : req.payload
              });
          }else{
              User.findByIdAndRemove(req.params.id, function(err,user){
                  if(err){ return res.json({error: err});}
                  return res.json(user);
                    
              });
          }
          
      },
    
        /*
         * Reset the password for a logged in user 
         */
      resetPassword: (req, res) => {
        User
          .findOne({email: req.body.email})
          .exec((err, user) => {
            if(err){ res.json({error: err}); }
            if(!user){
                return res.status(404).json({message: "Email not found"});
            }
            var random = uuid.v4().substr(0, 8);
            user.password = random;
            user.save((err) => {
              if (err) return res.send(err);
              var email = new Email({
                subject: '[DerbyHacks] Password reset',
                body: '# DerbyHacks \n ## Password Reset \n Your password has been reset. Your new password is: <br>' + random + '<br>Please login at [derbyhacks.io](https://derbyhacks.io) and change your password immediately.',
                recipients: {
                  emails: [user.email]
                }
              });
              email.send(false);
              return res.status(200).json({});
            });
          });
      },
    /**
  * Partially update the logged in user
  * PATCH /users
  * Auth
  */
  patch: (req, res) => {
      if (!req.payload._id) {
            return res.status(401).json({
                "message" : "UnauthorizedError: private profile"
            });
        }else{
            User.findById(req.payload._id).exec(function(err, user) {
                if(err){ res.status(500).json({message: err}); }
                if (req.body.email) {
                    user.email = req.body.email.toLowerCase();
                }
                if (req.body.password) {
                    user.password = req.body.password;
                }
                
                user.validate(function(error){
                    if(error){
                        return res.status(500).json({
                            error: error});
                    }else{
                        user.save(function(err){
                            //If no errors, redirect to main page
                            // add token here ?
                            if(err){ 
                                return res.status(500).json({
                                    error: err});
                            }else{
                                return res.status(200).json({
                                    "message" : "Update Successful"
                                });
                            }
                        });
                    }
                });

            });
        }
  },
    /*User
      .findById(req.user._id)
      .exec((err, user) => {
        if (err) return res.internalError();
        if (req.body.email) {
          user.email = req.body.email.toLowerCase();
        }
        if (req.body.password) {
          user.salt = User.Helpers.salt();
          user.password = User.Helpers.hash(req.body.password, user.salt);
        }
        user.save((err) => {
          if (err) return res.singleError('That email is already taken', 409);
          let response = {
            _id: user._id,
            email: user.email
          };
          io.emit('update', response);
          return res.status(200).json(response);
        });
      });*/

  /**
  * Partially update a user by ID
  * PATCH /users/:id
  * Auth -> admin
  */
  patchById: (req, res) => {
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    User
      .findByIdAndUpdate(req.params.id, req.body, {new: true})
      .exec((err, user) => {
        if(err){ res.json({error: err}); }
        var response = {
          _id: user._id,
          email: user.email,
          role: user.role,
          created: user.created
        };
        //io.emit('update', response);
        return res.status(200).json(response);
      });
  }
};
