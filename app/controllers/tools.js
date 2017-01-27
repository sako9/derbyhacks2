var User = require('../models/user');
var Application = require('../models/application');
var csv = require('to-csv');
var request = require('request');
var fs = require('fs');
var archiver = require('archiver')

module.exports = {

  /**
  * Download a CSV of all attendees
  * GET /exports/attendees
  */
  attendees: (req, res) => {
    User
      .find()
      .select('email _application')
      .where({_application: {$exists: true}})
      .sort('-created')
      .populate({
        path: '_application',
        match: req.query
      })
      .exec((err, users) => {
        if(err){ res.json({error: err}); }
        if (!users || !users.length) return res.send('No attendees match that query');
        var list = users.map((user) => {
          return {
            'FirstNmae': user._application.firstName || '',
            'LastName' : user._application.lastName || '',
            'Email': user.email || '',
            'Phone': user._application.phone || '',
            'School': user._application.school || '',
            'Major': user._application.major || '',
            'Year': user._application.grade || '',
            'Age': user._application.age || '',
            'Gender': user._application.gender || '',
            'Pun':user._application.pun || '',
            'Shirt Size': user._application.shirtSize || '',
            'RSVPd?': (user._application.going) ? 'Yes' : 'No',
            'Link': user._application.link || '',
            'Status': user._application.status || '',
            'Checked In?': (user._application.checked) ? 'Yes' : 'No'
          };
        });
        res.setHeader('Content-disposition', 'attachment; filename=attendees.csv');
        res.setHeader('Content-type', 'text/csv');
        return res.status(200).send(csv(list));
      });
  },

  /**
  * Download a resume book
  * GET /exports/resumes
  */
  resumes: (req, res) => {
    Application
      .find(req.query)
      .select('resume firstName lastName')
      .exec((err, applications) => {
        if (err) return res.internalError();

        var files = applications.filter((application) => {
          return application.resume;
        }).map((application) => {

          // normalize file names
          var newName = titleCase(application.firstName).replace(/\s/g, '');
          var last = titleCase(application.lastName).replace(/\s/g, '');
          return {
            path: application.resume,
            name: newName +last
          };

        });
        var archive = archiver('zip');
        res.attachment('archive-name.zip');
        archive.pipe(res);

        for(var i in files) {
            archive.append(request(files[i].path), { name: files[i].name });
        }
        
        archive.finalize();


      });
  }

};

function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}