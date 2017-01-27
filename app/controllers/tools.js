var User = require('../models/user');
var Application = require('../models/application');
var csv = require('to-csv');

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
            'FirstName': user._application.name || '',
            'Email': user.email || '',
            'Phone': user._application.phone || '',
            'School': user._application.school || '',
            'Major': user._application.major || '',
            'Year': user._application.year || '',
            'Age': user._application.age || '',
            'Gender': user._application.gender || '',
            'Shirt Size': user._application.shirt || '',
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
      .select('resume name')
      .exec((err, applications) => {
        if (err) return res.internalError();

        let files = applications.filter((application) => {
          return application.resume;
        }).map((application) => {

          // normalize file names
          let newName = titleCase(application.name).replace(/\s/g, '');
          let newExt = path.extname(application.resume);
          return {
            path: path.join(__dirname, '../../uploads/', application.resume),
            name: newName + newExt
          };

        });

        return res.zip(files);

      });
  }

};

function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}