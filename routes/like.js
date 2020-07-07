require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require ("../middleware/index.js");

// DISPLAY LIKES PAGE

router.get("/likes/:id", middleware.checkAccountOwnership ,(req, res) => {
    // get list of those users which exist in likes array of foundUser
    User.findById(req.params.id)
        .populate("likes")
        .exec(function (err, foundUser) {
            if (err) {
                req.flash("error", "Something went wrong!");
                return res.redirect("back");
            }
            res.render("likes", {
                user: foundUser,
            });
        });
});

//HANDLING Like/Unlike REQUEST FROM VIEW PROFILE PAGE

router.post("/likes/:selectedUser_id", middleware.isLoggedIn  ,(req, res) => {
    User.findById(req.params.selectedUser_id, async (err, foundclickedUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        }
        // check if req.user._id exists in foundclickedUser.likes
        var foundclickedUserLike = foundclickedUser.likes.some(function (like) {
            return like.equals(req.user._id);
        });
        
        if (foundclickedUserLike) {
            // user already liked, removing like
            foundclickedUser.likes.pull(req.user._id);
            // foundclickedUser.bothLiked.pull(req.user._id);
            // await  req.user.bothLiked.pull(foundclickedUser._id);
        } else {
            // adding the new user like
            foundclickedUser.likes.push(req.user);
            
        }
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

        foundclickedUser.save(function (err) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("back");
            }
            return res.redirect("/profile/" + foundclickedUser._id + "/view");
        });
    });
});

//HANDLING Like/Unlike REQUEST FROM CURRENT USER LIKES PAGE 
router.post("/likesPage/:selectedUser_id", middleware.isLoggedIn  ,(req, res) => {
    User.findById(req.params.selectedUser_id,async (err, foundclickedUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        }
        // check if req.user._id exists in foundclickedUser.likes
        var foundclickedUserLike = foundclickedUser.likes.some( function (like) {
            return like.equals(req.user._id);
        });

        if (foundclickedUserLike) {
            // user already liked, removing like
            foundclickedUser.likes.pull(req.user._id);
            // foundclickedUser.bothLiked.pull(req.user._id);
            // await  req.user.bothLiked.pull(foundclickedUser._id);
            } else {
            // adding the new user like
            foundclickedUser.likes.push(req.user);
        }
        
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

        foundclickedUser.save(function (err) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("back");
            }
            return res.redirect("/likes/" + req.user._id );
        });
    });
});

//HANDLING Like/Unlike REQUEST FROM HOME PAGE

router.post("/likes/:selectedUser_id/home", middleware.isLoggedIn ,(req, res) => {
    User.findById(req.params.selectedUser_id, (err, foundclickedUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        }
        // check if req.user._id exists in foundclickedUser.likes
        var foundclickedUserLike = foundclickedUser.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundclickedUserLike) {
            // user already liked, removing like
            foundclickedUser.likes.pull(req.user._id);
            foundclickedUser.bothLiked.pull(req.user._id);
            req.user.bothLiked.pull(foundclickedUser._id);
        } else {
            // adding the new user like
            foundclickedUser.likes.push(req.user);
        }

        foundclickedUser.save(function (err) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("back");
            }
            return res.redirect("/home/" + req.user._id);
        });
    });
});

module.exports = router;


// require("dotenv/config");
// var express = require("express");
// var router = express.Router();
// var User = require("../models/user");
// var middleware = require ("../middleware/index.js");

// // DISPLAY LIKES PAGE

// router.get("/likes/:id", middleware.checkAccountOwnership ,(req, res) => {
//     // get list of those users which exist in likes array of foundUser
//     User.findById(req.params.id)
//         .populate("likes")
//         .exec(function (err, foundUser) {
//             if (err) {
//                 req.flash("error", "Something went wrong!");
//                 return res.redirect("back");
//             }
//             res.render("likes", {
//                 user: foundUser,
//             });
//         });
// });

// //HANDLING Like/Unlike REQUEST FROM VIEW PROFILE PAGE

// router.post("/likes/:selectedUser_id", middleware.isLoggedIn  ,(req, res) => {
//     User.findById(req.params.selectedUser_id, async (err, foundclickedUser) => {
//         if (err) {
//             req.flash("error", "Something went wrong.");
//             return res.redirect("back");
//         }
//         // check if req.user._id exists in foundclickedUser.likes
//         var foundclickedUserLike = foundclickedUser.likes.some(function (like) {
//             return like.equals(req.user._id);
//         });
        
//         if (foundclickedUserLike) {
//             // user already liked, removing like
//             foundclickedUser.likes.pull(req.user._id);

//         } else {
//             // adding the new user like
//             foundclickedUser.likes.push(req.user);
            
            
//         }
//         await User.findById(req.user._id,async function(err,currentUser){
//             await User.find({}, async function(err,otherUser){
                
//                 otherUser.forEach(async (user) => {
            

//                 var item = req.user._id
//                 var index = user.likes.indexOf(item);
//                 if(index !==-1 ) {
                   
//                      item = user._id
//                      index = currentUser.likes.indexOf(item);
//                     if(index !== -1) {
                        
//                         item=user._id
//                         index=currentUser.bothLiked.indexOf(item)
                        
//                         if(index===-1)
//                         {    
//                             currentUser.bothLiked.push(user._id);
//                             user.bothLiked.push(req.user._id);
//                             await currentUser.save(); 
//                             await user.save();   
//                         }
//                     }
//                 }
//               });
//             });
//         });
//         foundclickedUser.save(function (err) {
//             if (err) {
//                 req.flash("error", "Something went wrong.");
//                 return res.redirect("back");
//             }
//             return res.redirect("/home/" + req.user._id);
//         });
//     });
// });

// //HANDLING Like/Unlike REQUEST FROM CURRENT USER LIKES PAGE 
// router.post("/likesPage/:selectedUser_id", middleware.isLoggedIn  ,(req, res) => {
//     User.findById(req.params.selectedUser_id,async (err, foundclickedUser) => {
//         if (err) {
//             req.flash("error", "Something went wrong.");
//             return res.redirect("back");
//         }
//         // check if req.user._id exists in foundclickedUser.likes
//         var foundclickedUserLike = foundclickedUser.likes.some( function (like) {
//             return like.equals(req.user._id);
//         });

//         if (foundclickedUserLike) {
//             // user already liked, removing like
//             foundclickedUser.likes.pull(req.user._id);
//             } else {
//             // adding the new user like
//             foundclickedUser.likes.push(req.user);
//         }
        
//         await User.findById(req.user._id,async function(err,currentUser){
//             await User.find({}, async function(err,otherUser){
                
//                 otherUser.forEach(async (user) => {
            

//                 var item = req.user._id
//                 var index = user.likes.indexOf(item);
//                 if(index !==-1 ) {
                   
//                      item = user._id
//                      index = currentUser.likes.indexOf(item);
//                     if(index !== -1) {
                        
//                         item=user._id
//                         index=currentUser.bothLiked.indexOf(item)
                        
//                         if(index===-1)
//                         {    
//                             currentUser.bothLiked.push(user._id);
//                             user.bothLiked.push(req.user._id);
//                             await currentUser.save(); 
//                             await user.save();   
//                         }
//                     }
//                 }
//               });
//             });
//         });
//         foundclickedUser.save(function (err) {
//             if (err) {
//                 req.flash("error", "Something went wrong.");
//                 return res.redirect("back");
//             }
//             return res.redirect("/home/" + req.user._id );
//         });
//     });
// });

// //HANDLING Like/Unlike REQUEST FROM HOME PAGE

// router.post("/likes/:selectedUser_id/home", middleware.isLoggedIn ,(req, res) => {
//     User.findById(req.params.selectedUser_id, (err, foundclickedUser) => {
//         if (err) {
//             req.flash("error", "Something went wrong.");
//             return res.redirect("back");
//         }
//         // check if req.user._id exists in foundclickedUser.likes
//         var foundclickedUserLike = foundclickedUser.likes.some(function (like) {
//             return like.equals(req.user._id);
//         });

//         if (foundclickedUserLike) {
//             // user already liked, removing like
//             foundclickedUser.likes.pull(req.user._id);
//         } else {
//             // adding the new user like
//             foundclickedUser.likes.push(req.user);
//         }

//         foundclickedUser.save(function (err) {
//             if (err) {
//                 req.flash("error", "Something went wrong.");
//                 return res.redirect("back");
//             }
//             return res.redirect("/home/" + req.user._id);
//         });
//     });
// });

// module.exports = router;
