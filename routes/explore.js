require("dotenv/config");
var express = require("express");
var router = express.Router();
var async = require("async");
var User = require("../models/user");
const cities = require("all-countries-and-cities-json")
var indianCities = cities.India;
var middleware = require ("../middleware/index.js");

router.get("/explore/:id",middleware.checkAccountOwnership, (req, res) => {
    if (Object.keys(req.query).length > 0) {
        User.find(getFilters(req), async function (err, allUsers) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("back");
            } else {
                if (allUsers.length < 1) {
                    req.flash("error", "No user with given criteria Exists");
                    return res.redirect("/explore/" + req.params.id)
                }
                allUsers.forEach(async (user) => {
                    var {
                        AgeFromDateString
                    } = require('age-calculator');
                    var Date = user.date;
                    let ageFromString = new AgeFromDateString('' + Date + '').age;
                    user.age = ageFromString;
                    await user.save();
                });
                res.render("explore", {
                    users: shuffle(allUsers),
                    cities: indianCities
                });
            }
        });
    } else {
        User.find({
            _id: {
                $ne: req.user
            }
        },async function (err, allUsers) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("back");
            }
            allUsers.forEach(async (user) => {
                var {
                    AgeFromDateString
                } = require('age-calculator');
                var Date = user.date;
                let ageFromString = new AgeFromDateString('' + Date + '').age;
                user.age = ageFromString;
                await user.save();
            });
            return res.render("explore", {
                users: shuffle(allUsers),
                cities: indianCities
            });
        });
    }
})

function getFilters(req){
    var filter = { _id: { $ne: req.user }};
    if(req.query.username.length>0){
        filter.username = new RegExp(escapeRegex(req.query.username), 'gi');
    }
    if(req.query.name.length>0){
        filter.name = new RegExp(escapeRegex(req.query.name),'gi');
    }
    if(req.query.city.length>0){
        filter.city = new RegExp(escapeRegex(req.query.city),'gi');
    }
    if(req.query.age.length>0){
        filter.userAgeGroup = new RegExp(escapeRegex(req.query.age),'gi');
    }
    if(req.query.relPreference.length>0){
        filter.relPreference = new RegExp(escapeRegex(req.query.relPreference),'gi');
    }
    if(req.query.gender.length>0){

        if(req.query.gender === "Male" ) {
            filter.gender = "Male"
        }
        else if(req.query.gender === "Female" ) {
            filter.gender = "Female" 
        } else {
            filter.gender = "Others"
        }
    }
    return filter;
}

//FOR CLEARING FILTERS ROUTE

router.post("/explore/:id", middleware.checkAccountOwnership ,(req, res) => {
    User.find({
        _id: {
            $ne: req.user
        }
    }, (err, allUsers) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        }
    
        return res.redirect("/explore/" + req.params.id);
    })
});


//SEARCH GIVEN USER

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//SHUFFLE ALL USERS

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

module.exports = router