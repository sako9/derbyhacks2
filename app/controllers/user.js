var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/user');
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
                if(err) res.send(err);
                //if no errors, send them back to the client
                res.json(users);
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
            console.log(newUser);
            
            newUser.validate(function(error){
                if(error){
                    res.json({
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
                        res.json({
                            "token":token
                        });
                        }
                    });
                }
            });
        },
        login: (req,res) =>{
              passport.authenticate('local', function(err, user, info){
                var token;

                // If Passport throws/catches an error
               if(err){ 
                   res.send(err);
               }else if(user){
                  token = user.generateJwt();
                  res.status(200);
                  res.json({
                    "token" : token
                  });
                } else {
                  // If user is not found
                  res.status(401).json(info);
                }
              })(req, res);
        
        },
        
        /*
        * Get a single user based on id.
        */
        getOne: (req, res) =>{
            if(! req.payload._id || (req.payload.role != "staff" || req.payload.role != "admin")){
                res.status(401).json({
                    "message" : "Unauthorized"
                });
            }else{
            User.findById(req.params.id, function(err, user){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(user);
            });
            }
        }
};