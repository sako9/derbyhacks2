var User = require('../models/user');
var Application = require('../models/application');

module.exports = {

  /**
  * Build a line graph of registrations over time
  * GET /stats/registrations
  * Auth -> admin, staff
  */
  registrations: (req, res) => {
    User
      .find()
      .select('_application')
      .populate({
        path: '_application',
        match: req.query,
        select: 'created'
      })
      .exec((err, users) => {
        if (err) return res.internalError();
        var apps = users.filter((user) => {
          return user._application;
        }).map((user) => {
          return user._application;
        });
        var months = [
          {name: 'January', count: 0},
          {name: 'February', count: 0},
          {name: 'March', count: 0},
          {name: 'April', count: 0},
          {name: 'May', count: 0},
          {name: 'June', count: 0},
          {name: 'July', count: 0},
          {name: 'August', count: 0},
          {name: 'September', count: 0},
          {name: 'October', count: 0},
          {name: 'November', count: 0},
          {name: 'December', count: 0}
        ];
        for (var i = 0; i < apps.length; ++i) {
          var index = apps[i].created.getMonth(); // int value of the month, ex 7
          months[index].count++;
        }
        return res.status(200).json({
          months: months.filter((month) => {
            return month.count;
          })
        });
      });
  },

  /**
  * Get the distribution of t-shirt sizes for all applications
  * GET /stats/shirts
  * Auth -> admin, staff
  */
  shirts: (req, res) => {
    User
      .find()
      .select('_application')
      .populate({
        path: '_application',
        match: req.query,
        select: 'shirtSize'
      })
      .exec((err, users) => {
        if (err) return res.internalError();
        var apps = users.filter((user) => {
          return user._application;
        }).map((user) => {
          return user._application;
        });
        var xsmall = 0;
        var small = 0;
        var medium = 0;
        var large = 0;
        var xlarge = 0;
        for (var i = 0; i < apps.length; ++i) {
          switch (apps[i].shirtSize) {
            case 'Unisex - XS':
              xsmall++;
              break;
            case 'Unisex - S':
              small++;
              break;
            case 'Unisex - M':
              medium++;
              break;
            case 'Unisex - L':
              large++;
              break;
            case 'Unisex - XL':
              xlarge++;
              break;
          }
        }
        return res.status(200).json({
          small: small,
          medium: medium,
          large: large,
          xlarge: xlarge
        });
      });
  },

  /**
  * Get a breakdown of dietary restrictions
  * GET /stats/dietary
  * Auth -> admin, staff
  */
  dietary: (req, res) => {
    User
      .find()
      .select('_application')
      .populate({
        path: '_application',
        match: req.query,
        select: 'dietary'
      })
      .exec(function (err, users) {
        if (err) return res.internalError();
        var apps = users.filter((user) => {
          return user._application;
        }).map((user) => {
          return user._application;
        });
        var restrictions = {};
        for (var i = 0; i < apps.length; ++i) {
          if (apps[i].dietary) {
              var diet = apps[i].dietary.split(',');
            for (var j = 0; j < diet.length; ++j) {
              var name = diet[j];
              if (name in restrictions) {
                restrictions[name]++;
              } else {
                restrictions[name] = 1;
              }
            }
          }
        }
        console.log(restrictions);
        var dietary = [];
        for (var key in restrictions) {
          if (restrictions.hasOwnProperty(key)) {
            dietary.push({
              name: key,
              count: restrictions[key]
            });
          }
        }
        return res.status(200).json({restrictions: dietary});
      });
  },

  /**
  * Gender comparison
  * GET /stats/gender
  * Auth -> admin, staff
  */
  gender: (req, res) => {
    User
      .find()
      .select('_application')
      .populate({
        path: '_application',
        match: req.query,
        select: 'gender'
      })
      .exec((err, users) => {
        if (err) return res.internalError();
        var apps = users.filter((user) => {
          return user._application;
        }).map((user) => {
          return user._application;
        });
        var male = 0;
        var female = 0;
        var other = 0;
        for (var i = 0; i < apps.length; ++i) {
          if (apps[i].gender) {
            if (apps[i].gender.toLowerCase() == 'male') {
              male++;
            } else if (apps[i].gender.toLowerCase() == 'female') {
              female++;
            } else {
              other++;
            }
          }
        }
        return res.status(200).json({
          male: male,
          female: female,
          other: other
        });
      });
  },

  /**
  * Get a distribution of schools
  * GET /stats/schools
  * Auth -> admin, staff
  */
  schools: (req, res) => {
    User
      .find()
      .select('_application')
      .populate({
        path: '_application',
        match: req.query,
        select: 'school'
      })
      .exec((err, users) => {
        if (err) return res.internalError();
        var apps = users.filter((user) => {
          return user._application;
        }).map((user) => {
          return user._application;
        });
        var s = {};
        for (var i = 0; i < apps.length; ++i) {
          if (apps[i].school) {
            var school = apps[i].school;
            s[school] = (s[school] || 0) + 1;
          }
        }
        var schools = [];
        for (var key in s) {
          schools.push({
            name: key,
            count: s[key]
          });
        }
        schools = schools.slice(0, 10);
        return res.status(200).json({schools: schools});
      });
  },

  /**
  * Query for numbers of applications
  * GET /stats/count?param=value
  * Auth -> admin, staff
  */
  count: (req, res) => {
    Application
      .count(req.query)
      .exec((err, count) => {
        if (err) return res.internalError();
        return res.status(200).json({count});
      });
  }

};