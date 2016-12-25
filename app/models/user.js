var mongoose = require("mongoose");
var config = require("../../config/config");
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = config.salt;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


var UserSchema = new Schema({
    email: {type: String, required:true, trim:true, lowercase: true, unique:true,validate: [validateEmail, 'Please fill a valid email address']},
    password: { type: String, required: true },
    _application: {type: mongoose.Schema.Types.ObjectId, ref: 'app'},
    role: {type: String, enm: ['attendee', 'staff', 'admin'], default: 'attendee'}
});

UserSchema.pre('save', function(next){
    var user = this;
    
    //has the password only if it has been modified
    if(!user.isModified('password'))  next();
    
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/*fucntion to create a token for a user
 * this token will be used to check if users
 * can access certain routes
*/
UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    role: this.role,
    email: this.email,
    exp: parseInt(expiry.getTime() / 1000),
  }, config.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

/*
 * function to check a users password
*/
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('user',UserSchema);
    
