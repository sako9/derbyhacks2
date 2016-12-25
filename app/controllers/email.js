var Email = require('../models/email');

module.exports = {

  /**
  * Send an email
  * POST /emails
  * Auth -> admin
  */
  post: (req, res) => {
    var errors = Email.validate(req.body);
    if (errors.length) return res.multiError(errors, 400);
    var email = new Email(req.body);

    email.send(true, (err, email) => {
      if(err){ res.json({error: err}); }
      return res.status(201).json(email);
    });
  },

  /**
  * Get a list of sent emails
  * GET /emails
  * Auth -> admin, staff
  */
  get: (req, res) => {
    Email
      .find()
      .exec((err, emails) => {
        if(err){ res.json({error: err}); }
        return res.status(200).json({emails: emails});
      });
  },

  /**
  * Delete a sent email
  * DELETE /emails/:id
  * Auth -> admin
  */
  delete: (req, res) => {
    Email
      .findByIdAndRemove(req.params.id)
      .exec((err, email) => {
        if(err){ res.json({error: err}); }
        var response = {
          _id: email._id
        };
        return res.status(200).json(response);
      });
  }

};