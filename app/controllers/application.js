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
                return res.status(401).json({
                    "message" : "Unauthorized"
                });
            }else{
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
                return res.status(401).json({
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
                            return res.json({
                                error: error});
                        }
                         else{
                            newApp.save(function(err){
                                if(err){ res.json({error: err}); }
                                user._application = newApp._id;
                                user.save(function(err){
                                    if(err){ return res.json({error: err}); }
                                    var email = new Email({
                                        subject: 'Your DerbyHacks Application',
                                        body: '# Thanks for applying to DerbyHacks!\nWe appreciate your interest.',
                                        recipients: {
                                          emails: [user.email]
                                        }
                                      });
                                      email.send(false);
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
        * Get a single application of a logged in user.
        */
        getOne: (req, res) =>{
            if(! req.payload._id){
                return res.status(401).json({
                    "message" : "Unauthorized"
                });
            }else{
                User.findById(req.payload._id)
                .populate('_application')
                .exec((err, user) => {
                    if(err){ return res.json({error: err}); }
                    return res.status(200).json(user);
                });
            }
        },
    
        getOneById:(req,res) =>{
            if(! req.payload._id){
                res.status(401).json({
                    "message" : "Unauthorized"
                });
            }else{
                User.findById(req.params.id)
                .populate('_application')
                .exec((err, user) => {
                    if(err){ return res.json({error: err}); }
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
                            return res.json({
                                error: error});
                        }
                     });
                User.findByIdAndUpdate(req.payload._id)
                .exec((err, user) => {
                    if(err) return res.send(err);
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
        },
    updatebyid:(req,res) =>{
        //Todo if admin
        User.findByIdAndUpdate(req.params.id)
            .exec((err,user) =>{
            if (err) return res.status(500).send(err);
            if (user._application){
                Application.findByIdAndUpdate(user._application, req.body, {new: true})
                .exec((err, application) =>{
                    if (err) return res.status(500).send(err);
                    if(req.body.status == 'approved'){
                        //Send Acceptance email
                        new Email({
                            subject: 'You\'ve been accepted to DerbyHacks!',
                            body: 'Dear ' + application.firstName + ' \n\n\n ## Congratulations!\n\n We are super excited to invite you to join us in Louisville February 24th-26th for DerbyHacks 2. We can’t wait to see you and what you bring to the table to help make cities smarter.\n\n Sometime between now and a week from now we need you to login to your dashboard and RSVP. We know that this can be time consuming, but know that we also have limited space and funds, and if you don’t RSVP, then some other qualified hacker will get your spot.\n\n There has been a change from the time you signed up to now, involving our venue. Due to factors out of our control our former venue will not be ready in time for our event. We’ll now be having our event at FirstBuild, a centerdedicated to designing, engineering, building, and selling the next generation of major home appliances. We’re excited to be working with our sponsors and venue  hosts to bring you the best hackathon experience possible.\n\n We’ve worked hard this year, and we hope that we can enable you to accomplish your ideas in a weekend. We look forward to seeing you at DerbyHacks 2.\n\n\ #MakeYourCity<br> See you soon<br> DerbyHacks Team',
                            recipients: {
                                emails:[user.email]
                            }
                        }).send(false);
                    }else if (req.body.status == "waitlisted"){
                        //Send waitlist email
                        new Email({
                            subject: 'DerbyHacks application status',
                            body: 'Dear ' + application.firstName + ' \n\n We’ve received more applicants this year than we can really afford to put into one space. As of right now we’ve put you on the waiting list. We’re sorry that we can’t confirm you a spot, but we will be sending out more acceptances as spots open up. We hope that we do get a chance to see you at DerbyHacks 2 or a future DerbyHacks event as we grow.\n\n Still, finding opportunities to turn your hacks into hacks for civic good within Louisville and other cities is a great cause; so wherever you find yourself February 24th-26th, or any weekend for that matter, #MakeYourCity.<br> Good Luck<br> DerbyHacks Team',
                            recipients: {
                                emails:[user.email]
                            }
                        }).send(false);
                    }else if (req.body.status == "denied"){
                        //Send rejection email
                        new Email({
                            subject: 'DerbyHacks application status',
                            body:'Dear ' + application.firstName + ' \n\n It is with sadness in our hearts that we inform you that we can’t invite you to DerbyHacks this year. We worked hard and are trying to accommodate as large a number of students at DerbyHacks 2 as we can, but there are limits, both in our space and our funding. We hope that you still find yourself making and hacking February 24th-26th (I hear HackIllinois has opened up registrations for that weekend). Regardless wherever you are and whatever you’re doing that weekend, #MakeYourCity.\n\n Sincerely<br> DerbyHacks Team',
                            recipients: {
                                emails:[user.email]
                            }
                        }).send(false);
                    }
                    
                    if(req.body.checked){
                        new Email({
                            subject:'Welcome to derby hacks',
                            body: "# Welcome to derby hacks!",
                            recipients: {
                                emails:[user.email]
                            }
                        }).send(false);
                    }
                    
                    var response = {
                        _id: user._id,
                        email: user.email,
                        role: user.role,
                        created: user.created,
                        _application :application
                        
                    };
                    return res.status(200).json(response);
                    
                });
            }else{
                var application = new Application(req.body);
                application.save((err, application) => {
                    user._application = application;
                    user.save((err, user) =>{
                        if (err) return res.status(500).send(err);
                        var response = {
                            _id: user._id,
                            email: user.email,
                            role: user.role,
                            created: user.created,
                            _application :application
                        };
                        return res.status(200).json(response);
                        });
                    });
                }
            });
        }
};