require("dotenv/config");
var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var User = require("../models/user");
var async = require("async");
var middleware = require("../middleware/index");

router.get("/", (req, res) => {
    res.render("landing");
});

// SUPPORT ROUTE
 
router.get("/support", middleware.isLoggedIn ,(req, res) => {
    res.render("support");
});

// TERMS AND CONDITIONS ROUTE

router.get("/termsandconditions", middleware.isLoggedIn, (req, res) => {
    res.render("tnc");
});

// PRIVACY ROUTE

router.get("/privacy", middleware.isLoggedIn, (req, res) => {
    res.render("privacy");
});

// T&C ROUTE

router.get("/tnc", (req, res) => {
    res.render("terms");
})

// ABOUT ROUTE

router.get("/about", middleware.isLoggedIn, (req, res) => {
    res.render("about");
})

router.get("/guidelines", middleware.isLoggedIn, (req,res) => {
    res.render("guidelines");
})

router.get("/safety", middleware.isLoggedIn, function (req,res) {  
    res.render("safety");
})

module.exports = router