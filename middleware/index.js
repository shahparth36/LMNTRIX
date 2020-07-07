
var User = require("../models/user");
var middlewareObj = {};

middlewareObj.checkAccountOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           User.findById(req.params.id, function(err, foundUser){
              if(err){
                  res.render("404notfound");
              }  else {
                  // does user own the account?
               if(foundUser._id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("/home/" + req.user._id);
               }
              }
           });
       } else {
           req.flash("error", "You need to be logged in to do that");
           res.redirect("/login");
       }
   }

   middlewareObj.isLoggedIn = function(req, res, next){
       if(req.isAuthenticated()){
           return next();
       }
       req.flash("error", "You need to be logged in to do that");
       res.redirect("/login");
   }
   
    middlewareObj.preventRenderingPage = function (req, res, next) {
        if (req.query.age && req.query.date && req.query.phNumber) {
           next();
        } else {
            res.render("404notfound")
        }
    };

    middlewareObj.bothLiked = function (req,res,next){
        var count1=0;
        var count2=0;
        var count3=0;
        
        User.findById(req.user._id,function(err,currentUser){
            var a1=currentUser.likes;
            var a2=[];
            User.find({_id:{$ne:req.user}},function(err,otherUser){
              otherUser.forEach(element => {
                  a2=element.likes;
                 a1.forEach(function(data){
                     if(data==element._id)
                     {
                         count1++;
                     }
                 });
    
                a2.forEach(function(data){
                    if(data==currentUser._id)
                    {
                        count2++;
                    }
                });

                currentUser.bothLiked.forEach(function(data){

                    if(data==element._id)
                    {
                        count3++;
                    }
                });
                  if(count1==1 && count2==1 && count3!=1)
                  {
                      currentUser.bothLiked.push(element._id);
                      currentUser.notifications.push(element._id); 
                      currentUser.save();
                  }
              });
            });
        });
        next();
    }
    

module.exports= middlewareObj;
