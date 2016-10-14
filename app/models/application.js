var mongoose = require('mongoose');
var Schema      = mongoose.Schema;

var _APPROVED = 'approved',
    _DENIED = 'denied',
    _WAITLISTED = 'waitlisted',
    _PENDING = 'pending';

var ApplicationSchema = new Schema({
    status: {type: String, enum: [_APPROVED, _DENIED, _WAITLISTED, _PENDING]},
    going: Boolean,         // rsvp status
    checked: Boolean,       // check-in status
    created: {type: Date, default: Date.now},
    door: Boolean,          // was this person registered during check-in?
    probable: {type: Boolean, default: false}, // is this person a probable attendee?
    
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    school : {type: String, required: true},
    major : {type: String, required: true},
    gender : {type: String, required: true},
    shirtSize : {type: String, enum: ["Women's - XS", "Women's - S", "Women's - M", "Women's - L", "Women's - XL","Men's - XS", "Men's - S", "Men's - M", "Men's - L", "Men's - XL"], required: true},
    dietary : {type: String},
    age : {type: Number, required: true},
    grade : {type: String, required: true},
    phone: {type: String, validate: { validator: function(v) { return /\d{3}-\d{3}-\d{4}/.test(v);}, message: '{VALUE} is not a valid phone number!'},required: [true, 'User phone number required'] },
    special : { type: String},
    pun : {type: String},
    git : {type: String},
    LinkedIN : {type: String},
    personal : {type: String},
    other: {type: String},
    resume: {type: String},
    conduct: {type: Boolean, required: true, message:'You must accept the MLH code of conduct'},
    policy: {type: Boolean, required: true, message: 'You must provide authorization'}
    
});

module.exports = mongoose.model('app',ApplicationSchema);
module.exports.Status = {
    APPROVED: _APPROVED,
    DENIED: _DENIED,
    WAITLISTED: _WAITLISTED,
    PENDING: _PENDING
};
