require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");

//GETTING STARTED ROUTE

router.get("/getting-started", function (req, res) {
    res.render("getting-started");
});

//HANDLING GETTING STARTED ROUTE REQUEST

router.post("/getting-started", async function (req, res) {

    //CALCULATING AGE FROM DOB GIVEN BY USER      
    
    var {
        AgeFromDateString
    } = require('age-calculator');
    var Date = req.body.date;
    let ageFromString = new AgeFromDateString('' + Date + '').age;
    var age = ageFromString;
    var phNumber = req.body.phNumber;
    var date = req.body.date;
    if (ageFromString < 15) {
        req.flash("error", "Users below the age of 15 are not permitted!");
        return res.redirect("back");
    } 
    await User.find({}, async (err, allUsers) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        }
        for (var i = 0; i < allUsers.length; i++) {
                if (allUsers[i].phNumber === req.body.phNumber) {
                    req.flash("error", "Phone Number is already in use.Please sign up with different Phone Number.");
                    return res.redirect("/getting-started");                
                }
        }
        res.render("register", {
            phNumber: req.body.phNumber,
            age: age,
            date: date
        });
    })
});

module.exports = router;