require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware/index");
const { filter } = require("async");


router.get("/chat/:id", middleware.checkAccountOwnership ,function(req,res){

    User.findById(req.user._id,function(err,currentUser){
        User.find({},function(err,otherUser){
            otherUser.forEach((user) => {
            var item = req.user._id
            var index = user.likes.indexOf(item);
            if(index !==-1 ) {
                    item = user._id
                    index = currentUser.likes.indexOf(item);
                if(index !== -1) {
                    item=user._id
                    index=currentUser.bothLiked.indexOf(item)
                    
                    if(index===-1)
                    {
                        
                        currentUser.bothLiked.push(user._id);
                        // currentUser.notifications.push(user._id); 
                        // user.notifications.push(req.user._id);
                        user.bothLiked.push(req.user._id);
                        currentUser.save();
                        user.save();
                        
                    }
                }
            }
            });
        });
    });
    var noMatch = false;
    if(req.query.search)
    {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');              
               User.findById(req.params.id).populate({path:'bothLiked',match:{username:regex}}).exec(function(err,user){
                

                if(user.bothLiked.length<1)
                {
                   
                    noMatch=true;
                }
                

                res.render('chat',{allusers:shuffle(user.bothLiked),noMatch:noMatch});
               });   
    }

         else {

            User.findById(req.params.id).populate('bothLiked').exec(function(err,data){

                
            var arr=data.bothLiked;
            
            
            res.render('chat',{allusers:shuffle(arr),noMatch:noMatch});
            });
            
        }
    });
  

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

module.exports = router;
