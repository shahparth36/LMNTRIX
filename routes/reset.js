require("dotenv/config");
var express = require("express");
var router = express.Router();
var async = require("async");
var crypto = require("crypto");
var nodemailer = require("nodemailer");
var express = require("express");
var User = require("../models/user");

// FORGET PASSWORD ROUTE

router.get("/forgot", function (req, res) {
    res.render("forgot");
});

//HANDLING FORGOT PASSWORD REQUEST

router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({
                email: req.body.email
            }, function (err, user) {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    return res.redirect("back");
                }
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'setitupcorp@gmail.com',
                    pass: 'Lmntrix@2023'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'setitupcorp@gmail.com',
                subject: 'SetItUp Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

// RESET PASSWORD ROUTE
router.get('/reset/:token', function (req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        }
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            token: req.params.token
        });
    });
});

//HANDLING RESET PASSWORD REQUEST
router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    return res.redirect("back");
                }
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        if (err) {
                            req.flash("error", "Something went wrong.");
                            return res.redirect("back");
                        }
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            if (err) {
                                req.flash("error", "Something went wrong.");
                                return res.redirect("back");
                            }
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                }
                else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'setitupcorp@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed. Please login to continue.');
                done(err);
            });
        }
    ], function (err) {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
        }
        res.redirect('/login');
    });
});


module.exports = router;