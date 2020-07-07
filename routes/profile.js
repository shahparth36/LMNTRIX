require("dotenv/config");
var express = require("express");
var router = express.Router();
var async = require("async");
var multer = require('multer');
var User = require("../models/user");
const cities = require("all-countries-and-cities-json")
var indianCities = cities.India;
var middleware = require ("../middleware/index.js");

//CLOUDINARY REQUIREMENTS

var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({
    dest: "uploads/",
    storage: storage,
    fileFilter: imageFilter
});

var cloudinary = require('cloudinary');
const {
    update
} = require("../models/user");
const middlewareObj = require("../middleware/index.js");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//VIEW PROFILE ROUTE

router.get("/profile/:id/view", middleware.isLoggedIn ,function (req, res) {
    User.findById(req.params.id, function (err, foundclickedUser) {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        }

        var {
            AgeFromDateString
        } = require('age-calculator');
        var Date = foundclickedUser.date;
        let ageFromString = new AgeFromDateString('' + Date + '').age;
        foundclickedUser.age = ageFromString;
        foundclickedUser.save();


        // check if req.user._id exists in foundclickedUser.likes
        var foundclickedUserLike = foundclickedUser.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundclickedUserLike) {
            var button = {
                value: "Unlike"
            }
            res.render("showProfile", {
                user: foundclickedUser,
                button: button
            })
        } else {
            var button = {
                value: "Like"
            }
            res.render("showProfile", {
                user: foundclickedUser,
                button: button
            })
        }
    })
});



//EDIT PROFILE ROUTE
router.get("/profile/:id/edit", middleware.checkAccountOwnership ,function (req,res) {
    User.findById(req.params.id, function(err,foundUser) {
        if(err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        } else {
            res.render("editProfile", {user: foundUser,cities: indianCities})
        }
    })
});

//UPDATE PROFILE ROUTE
router.post("/profile/:id/view", middleware.checkAccountOwnership ,async function (req,res) {
    User.findById(req.params.id, async function (err, updatedUser) {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        } else {
            
            //CALCULATING AGE FROM DOB GIVEN BY USER
            
            var {
                AgeFromDateString
            } = require('age-calculator');
            var Date = req.body.user.date;
            let ageFromString = new AgeFromDateString('' + Date + '').age;

            // SAVING DATA ON DATABASE
            if (ageFromString < 15 ) {
                req.flash("error", "Users below the age of 15 are not permitted!");
                return res.redirect("/profile/" + updatedUser._id + "/edit" );
            }
            else if (ageFromString >= 15 && ageFromString <= 18) {
                updatedUser.userAgeGroup = "15-18";
            }
            else if (ageFromString >= 19 && ageFromString <= 21) {
                updatedUser.userAgeGroup = "19-21";
            }
            else if (ageFromString >= 22 && ageFromString <= 26) {
                updatedUser.userAgeGroup = "22-26";
            } 
            else if (ageFromString >= 27 && ageFromString <= 30) {
                updatedUser.userAgeGroup = "27-30";
            }
            else if (ageFromString >= 31 && ageFromString <= 50) {
                updatedUser.userAgeGroup = "31-50";
            }
            else {
                updatedUser.userAgeGroup = "Above 50";
            }   
            if(req.body.user.relFinalAge <= req.body.user.relInitialAge ) {
                req.flash("error", "Please Enter a Final Age that is greater than the Initial Age in the Preferred Age Group category!");
                return res.redirect("/profile/" + updatedUser._id + "/edit" );
            }
            updatedUser.firstName = req.body.user.firstName;
            updatedUser.lastName = req.body.user.lastName;
            updatedUser.name = req.body.user.firstName + " " + req.body.user.lastName;
            updatedUser.city = req.body.user.city;
            updatedUser.gender = req.body.user.gender;
            updatedUser.date = req.body.user.date;
            updatedUser.age = ageFromString;
            updatedUser.nickname = req.body.user.nickname;
            updatedUser.bio = req.body.user.bio;
            updatedUser.maritalStatus = req.body.user.maritalStatus;
            updatedUser.relType = req.body.user.relType;
            updatedUser.relPreference = req.body.user.relPreference;
            updatedUser.relDistance = req.body.user.relDistance;
            updatedUser.relInitialAge = req.body.user.relInitialAge;
            updatedUser.relFinalAge = req.body.user.relFinalAge;
            updatedUser.relAgeGroup = req.body.user.relInitialAge + "-" + req.body.user.relFinalAge;
            updatedUser.liveIn = req.body.user.liveIn;
            updatedUser.currently = req.body.user.currently;
            updatedUser.virgin = req.body.user.virgin;
            updatedUser.cook = req.body.user.cook;
            updatedUser.income = req.body.user.income;
            updatedUser.languages = req.body.user.languages;
            updatedUser.fbLink = req.body.user.fbLink;
            updatedUser.igLink = req.body.user.igLink;
            updatedUser.twitterLink = req.body.user.twitterLink;
            await updatedUser.save();
            res.redirect("/profile/"+ req.params.id + "/view");
        }
    })
});

//EDITING MULTIPLE IMAGES ROUTE

router.put("/profile/:id/update", middleware.checkAccountOwnership ,upload.array("images"), (req, res) => {
    //find user by id
    User.findById(req.params.id, async (err, user) => {
        //check if there is any image for deletion
        if (req.body.deleteImages && req.body.deleteImages.length) {
            //assign deleteImages from req.body to its own variable
            var deleteImages = req.body.deleteImages;
            //loop over for deletion of selected images
            for (var public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                //delete images from user.images
                for (var image of user.images) {
                    if (image.public_id === public_id) {
                        var index = user.images.indexOf(image);
                        user.images.splice(index, 1);
                    }
                }
            }
        }
        //check if there are any new images to upload
        if (req.files) {
            //upload images
            for (const file of req.files) {
                var image = await cloudinary.v2.uploader.upload(file.path);
                //add images to user.images array
                user.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                })
            }
        }
        //save the new images in database
        await user.save();
        res.redirect("/profile/" + req.params.id + "/view#photos");
    })
});

module.exports = router;