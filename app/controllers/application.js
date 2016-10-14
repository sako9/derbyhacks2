var mongoose = require('mongoose');
var User = require('../models/user');
var Application = require('../models/application');
// App routes
module.exports = {

        /*
         * Get route to retrieve all users
         * Todo: make it so only admins can access route
         */
        getAll :(req, res) => {
            //Query the DB if no errors, send all users
            if(! req.payload._id || (req.payload.role != "staff" || req.payload.role != "admin")){
                res.status(401).json({
                    "message" : "Unauthorized"
                });
            }else{
                var query = Application.find({});
                query.exce(function(err, apps){
                    if(err) res.send(err);
                    //if no errors, send them back to the client
                    res.json(apps);
                });
            }
        },
        create: (req, res) =>{
            //find user in database
            if (!req.payload._id) {
                res.status(401).json({
                  "message" : "UnauthorizedError: private profile"
                });
            }else{
                 User
                    .findById(req.payload._id)
                    .exec(function(err, user) {
                        if (err) return res.status(500).send('Something broke!');
                        var newApp = new Application();
                        //Save it into the DB.
                        newApp.status = Application.Status.Pending;
                        newApp.going= false;
                        newApp.door = false;
                        newApp.checked = false;
                        newApp.firstName = req.body.firstname
                        newApp.lastName = req.body.lastname;
                        newApp.school = req.body.school;
                        newApp.major = req.body.major;
                        newApp.gender = req.body.gender;
                        newApp.shirtSize = req.body.shirtsize;
                        newApp.dietary = req.body.dietary
                        newApp.age = req.body.age;
                        newApp.grade = req.body.grade;
                        newApp.phone = req.body.phone;
                        newApp.special = req.body.special;
                        newApp.pun = req.body.pun;
                        newApp.git = req.body.git;
                        newApp.LinkedIN = req.body.linkedin;
                        newApp.personal = req.body.personal;
                        newApp.other = req.body.other;
                        newApp.resume = req.body.resume;
                        newApp.conduct = req.body.conduct;
                        newApp.policy = req.body.policy;
                        
                        newApp.validate(function(error){
                            if(error){
                                res.json({
                                    error: error});
                            }else{
                                newApp.save(function(err){
                                    user.application = newApp._id;
                                    user.save(function(err){
                                        //Todo: maybe send an email
                                    });
                                    res.status(200);
                                    res.json({
                                        "_id": user._id,
                                        "email": user.email,
                                        "role": user.role,
                                        "created": user.created,
                                        "application": newApp
                                    });
                                });
                            }
                        });
                 });
            }
                
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