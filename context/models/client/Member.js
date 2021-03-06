module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/members/register";
    else
      return "/api/members";
  },

  login: function(data){
    return this.save(data, {"url": "/api/members/login"});
  }

})