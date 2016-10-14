
var mongoose = require('mongoose');
 schema = require('validate');
var config = rootRequire('config/config');
var sendgrid = require('sendgrid')(config.sendgrid.apikey);
let marked = require('marked');

/**
* Schema
*/
var EmailSchema = mongoose.Schema({
  subject: String,
  body: String, // stored as markdown
  sent: {type: Date, default: Date.now},
  recipients: {
    nickname: String, // optional
    emails: [String]
  }
});

/**
* Sends an email using sendgrid
* @param save:bool Whether or not to save the email to the database
* @param callback An optional callback
*/
EmailSchema.methods.send = function (save, callback) {

    let message = new sendgrid.Email({
      from: config.sendgrid.from,
      fromname: config.sendgrid.fromname,
      subject: this.subject,
      text: this.body,
      html: marked(this.body)
    });

    for (let address of this.recipients.emails) {
      message.addTo(address);
    }

    sendgrid.send(message);


  if (save) {
    this.sent = Date.now();
    this.save((err, email) => {
      callback && callback(err, email);
    });
  } else {
    callback && callback(err);
  }

};

let Email = mongoose.model('Email', EmailSchema);

/**
* Validate a message
*/
function validate(email) {

  let test = schema({
    subject: {
      type: 'string',
      required: true,
      message: 'You must provide a subject'
    },
    body: {
      type: 'string',
      required: true,
      message: 'You must provide a body'
    }
  }, {typecast: true, strip: false});

  return test.validate(email);

};

module.exports = Email;
module.exports.validate = validate;