var mongoose = require('mongoose');
var User = require('../models/user');
var Application = require('../models/application');
var Email = require('../models/email');

var _APPROVED = 'approved',
    _DENIED = 'denied',
    _WAITLISTED = 'waitlisted',
    _PENDING = 'pending';
// App routes
module.exports = {

        /*
         * Get route to retrieve all applications
         * Should require staff/admin auth
         */
        getAll :(req, res) => {
            //Query the DB if no errors, send all users
            if(false){
                res.status(401).json({
                    "message" : "Unauthorized"
                });
            }else{
                console.log("hey");
                var query = Application.find({});
                query.exec(function(err, apps){
                    if(err) res.send(err);
                    //if no errors, send them back to the client
                    return res.status(200).json(apps)
                });
            }
        },
        /*
         *Post route to create a new application for the currently logged in user 
         *
         */
        create: (req, res) =>{
            //find user in database
            if (!req.payload._id) {
                res.status(401).json({
                  "message" : "UnauthorizedError: private profile"
                });
            }else{
                 User.findById(req.payload._id).exec(function(err, user) {
                    if(err){ res.json({error: err}); }
                    var newApp = new Application();
                    //Save it into the DB.
                    newApp.status = 'pending';
                    newApp.going= false;
                    newApp.door = false;
                    newApp.checked = false;
                    newApp.firstName = req.body.firstName
                    newApp.lastName = req.body.lastName;
                    newApp.school = req.body.school;
                    newApp.major = req.body.major;
                    newApp.gender = req.body.gender;
                    newApp.shirtSize = req.body.shirtSize;
                    newApp.dietary = req.body.dietary
                    newApp.age = req.body.age;
                    newApp.grade = req.body.grade;
                    newApp.phone = req.body.phone;
                    newApp.special = req.body.special;
                    newApp.pun = req.body.pun;
                    newApp.git = req.body.git;
                    newApp.LinkedIN = req.body.LinkedIN;
                    newApp.personal = req.body.personal;
                    newApp.other = req.body.other;
                    newApp.resume = req.body.resume;
                    newApp.conduct = req.body.conduct;
                    newApp.policy = req.body.policy;
                    newApp.validate(function(error){
                        if(error){
                            res.json({
                                error: error});
                        }
                         else{
                            newApp.save(function(err){
                                if(err){ res.json({error: err}); }
                                user._application = newApp._id;
                                user.save(function(err){
                                    if(err){ res.json({error: err}); }
                                    var email = new Email({
                                        subject: 'Your DerbyHacks Application',
                                        body: '# Thanks for applying to DerbyHacks!\nWe appreciate your interest.',
                                        recipients: {
                                          emails: [user.email]
                                        }
                                      });
                                      email.send(false);
                                    console.log("this happend")
                                });
                               return res.status(200).json({
                                    _id: user._id,
                                    email: user.email,
                                    role: user.role,
                                    created: user.created,
                                    application: newApp
                                })
                            });
                     }
                    });

                     
                 });
            }
        },
        
        /*
        * Get a single application of a user based of id.
        */
        getOne: (req, res) =>{
            if(! req.payload._id){
                res.status(401).json({
                    "message" : "Unauthorized"
                });
            }else{
                User.findById(req.payload._id)
                .populate('_application')
                .exec((err, user) => {
                    if(err){ res.json({error: err}); }
                    return res.status(200).json(user);
                });
            }
        },
        /*
        * Update a logged in users application 
        */
        update: (req,res) =>{
            if (!req.payload._id) {
                res.status(401).json({
                  "message" : "UnauthorizedError: private profile"
                });
            }else{
                var newApp = new Application(req.body);
                newApp.validate(function(error){
                        if(error){
                            res.json({
                                error: error});
                        }
                     });
                User.findByIdAndUpdate(req.payload._id)
                .exec((err, user) => {
                    if(err) res.send(err);
                    Application.findByIdAndUpdate(user._application, newApp, {new: true})
                    .exec((err,application) => {
                        return res.status(200).json({
                            _id: user._id,
                            email: user.email,
                            role: user.role,
                            created: user.created,
                            application: newApp
                        })
                    });
                });
            }
        }
};