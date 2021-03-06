module.exports = function (config) {
  var BlogPost = require(config.models + '/BlogPost');
  return {
    'GET' : function (req, res) {
      BlogPost.find({}).populate("creator").exec(function(err, blogposts) {
        if (err) return res.error(err);
        res.result(blogposts);
      });
    },
    'POST /add' : function (req, res) {
      if(!req.body.creator)
        req.body.creator = req.session.passport.user;
      
      if (!/^[0-9a-fA-F]{24}$/i.test(req.body.creator)) {
        return res.error({
          message: 'Validation failed',
          name : 'ValidationError',
          errors : {
            creator : {
              message : 'Invalid member id provided',
              name : 'ValidationError',
              path : 'creator',
              type : 'ObjectId'
            }
          }
        });
      }
      BlogPost.create(req.body, function (err, blogpost) {
        if (err) return res.error(err);
        res.result(blogpost);
      });
    },
    'GET /:id' : function (req, res) {
      BlogPost.findById(req.params.id, function(err, blogpost) {
        if (err) return res.error(err);
        res.result(blogpost);
      });
    },
    "PUT /:id": function(req, res) {
      BlogPost.findById(req.params.id,function(err, blogpost){
        if(err || !blogpost) return res.error(err || "not found");
        for(var key in req.body)
          blogpost[key] = req.body[key];
        blogpost.save(function(err){
          if(err) return res.error(err);
          res.result(blogpost)
        })
      })
    },
    "DELETE /:id": function(req, res) {
      BlogPost.findByIdAndRemove(req.params.id, function(err, blogpost){
        if(err) return res.error(err);
        res.result(blogpost);
      })
    }
  }
}