module.exports = function(config){
  var Member = require(config.models+"/Member");
  var _ = require('underscore');
  
  return {
    "GET": function(req, res){
      Member.find({}, function(err, members){
        if(err) return res.error(err);
        var publicMembers = _.map(members, function(mem){
          return mem.toPublicJSON();
        })
        res.result(publicMembers); 
      })
    },
    "POST /register": function(req, res){
      Member.create(req.body, function(err, member){
        if(err) return res.error(err);
        req.logIn(member, function(err) {
          if (err) { return next(err); }
          return res.result(member);
        });
      })
    },
    "GET /me": function(req, res){
      Member.findById(req.session.passport.user, function(err, member){
        if(err) return res.error(err);
        res.result(member.toPublicJSON());
      });
    },
    "GET /:id": function(req, res){
      Member.findById(req.params.id, function(err, member){
        if(err) return res.error(err);
        res.result(member.toPublicJSON());
      });
    },
    "POST /login": function(req, res, next) {
      passport.authenticate('local', function(err, user, info){
        if (err) { return next(err); }
        if (!user) { return res.error(info); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.result(user);
        });
      })(req, res, next)
    }
  }
}