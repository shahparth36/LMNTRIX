require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware/index");
var count=0;
var array=[];



//HOME PAGE ROUTE

router.get("/home/:id", middleware.checkAccountOwnership,middleware.bothLiked,async function (req, res) {

        await User.findById(req.user._id,async function(err,currentUser){
            await User.find({}, async function(err,otherUser){
                
                otherUser.forEach(async (user) => {
            

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
                            user.bothLiked.push(req.user._id);
                            await currentUser.save(); 
                            await user.save();   
                        }
                    }
                }
              });
            });
        });
        
    await User.findById(req.params.id).populate('bothLiked').exec( function (err, foundUser) {
        if (err) {
            req.flash("error", "Something went wrong!")
            return res.redirect("back")
        } else {
			
            //Female gender
            if (foundUser.gender === "Female") {
                if (foundUser.relPreference === "Straight") {
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Male",
                            city: foundUser.city,
                            relPreference: "Straight",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                               return res.redirect("back")
                            }
                            array=matching(data,foundUser,count,array);
                            res.render('home',{data:shuffle(array)});
                            array = [];
    
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Male",
                            relPreference: "Straight" ,
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3 ,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array = [];
                        });
                    } else {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Male",
                            relPreference: "Straight",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array = [];
                        });
                    }
                } else if (foundUser.relPreference === "Homosexual") {
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Female",
                            city: foundUser.city,
                            relPreference: "Homosexual",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                               return res.redirect("back")
                            }
                            array=matching(data,foundUser,count,array);
                            res.render('home',{data:shuffle(array)});
                            array = []
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) -3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            gender: "Female",
                            relPreference: "Homosexual" 
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array = [];
                        });
                    } else {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            gender: "Female",
                            relPreference: "Homosexual"
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array=[];
                        });
                    }
                    //bisexual
                } else {
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            city: foundUser.city
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array)  });
                                array = [];
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) -3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array)  });
                            array = [];
                        });
                    } else {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array)  });
                            array = [];
                        });
                    }
                }
            }
            //Male gender
            else if (foundUser.gender === 'Male') {
                if (foundUser.relPreference === "Straight") {
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Female",
                            city: foundUser.city,
                            relPreference: "Straight",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                               return res.redirect("back")
                            }
                            array=matching(data,foundUser,count,array);
                            res.render('home',{data:shuffle(array) });
                            array = [];
    
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Female",
                            
                            relPreference: "Straight" ,
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array = [];
                        });
                    } else {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Female",
                            relPreference: "Straight",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array = [];
                        });
                    }
                } else if (foundUser.relPreference === "Homosexual") {
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Male",
                            city: foundUser.city,
                            relPreference: "Homosexual",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                               return res.redirect("back")
                            }
                            array=matching(data,foundUser,count,array);
                            res.render('home',{data:shuffle(array) });
                            array = []
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            gender: "Male",
                            relPreference: "Homosexual" 
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array = [];
                        });
                    } else {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            gender: "Male",
                            relPreference: "Homosexual"
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array=[];
                        });
                    }
                    //bisexual
                } else {
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            city: foundUser.city
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                                array = [];
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array) });
                            array = [];
                        });
                    } else {
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data:shuffle(array) });
                            array = [];
                        });
                    }
                }
            }
            //Others gender
            else {
                if (foundUser.relDistance === "Short Distance Relationships") {
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Others",
                        city: foundUser.city,
                        age: {
                            $gte: Number(foundUser.relInitialAge) - 3,
                            $lte: Number(foundUser.relFinalAge) + 3
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            return res.redirect("back")
                        }
                        array=matching(data,foundUser,count,array);
                        res.render('home',{data:shuffle(array) });
                        array = [];

                    });
                } else if (foundUser.relDistance === "Long Distance Relationship") {
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Others",
                        age: {
                            $gte: Number(foundUser.relInitialAge) - 3,
                            $lte: Number(foundUser.relFinalAge) + 3
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            return res.redirect("back")
                        }
                        array = matching(data, foundUser, count, array);
                        res.render('home', { data:shuffle(array) });
                        array = [];
                    });
                } else {
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Others",
                        age: {
                            $gte: Number(foundUser.relInitialAge) - 3,
                            $lte: Number(foundUser.relFinalAge) + 3
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            return res.redirect("back")
                        }
                        array = matching(data, foundUser, count, array);
                        res.render('home', { data: shuffle(array) });
                        array = [];
                    });
                }
            }
        }
    })
});

function matching(data,foundUser,count,array){
    data.forEach(function (match) {



        //    var percent = 60;
        
            if (foundUser.relDistance === "Long Distance Relationship") {
                if (foundUser.city !== match.city) {
                    count += 5;
                }
            } else if (foundUser.relDistance === "Short Distance Relationships") {
                if (foundUser.city === match.city) {
                    count += 5;
                }
    
            } else if(foundUser.relDistance==="Anything Will Do") {
                count += 5;
            }
            if (foundUser.maritalStatus === match.maritalStatus) {
                count+=1;
            }
            if (foundUser.relType) {
                if (foundUser.relType === "Anything will do") {
                    count += 4;    
                }
                else if (foundUser.relType === match.relType) {
                    count += 4;
                }
            }
            if (foundUser.liveIn === match.liveIn) {
                count+=2;
            }
            if (foundUser.currently === match.currently) {
                count+=1;
            }
            if (foundUser.virgin === match.virgin) {
                count+=1;
            }
            if (foundUser.cook === match.cook) {
                count+=1;
            }
            if (foundUser.income === match.income) {
                count+=2;
            }
            var percentage = Math.ceil((count/17)*100);
            var x = {
                userData: match,
                percentage: percentage
            };
            array.push(x);
            count = 0;
    });        
    var n=array.length;
            for (var i = 1; i<n; i++) {
                for (var j = 0; j < n - i; j++) {
                    if (array[j].count < array[j + 1].count) {
                        var temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }
    return array;

}
module.exports = router

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

