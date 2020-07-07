var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var message=require("./models/message")
var flash = require("connect-flash");
var http = require('http').createServer(app);
var client = require('socket.io').listen(http);
var people = {};

//REQURING ROUTES
var authRoutes = require("./routes/auth");
var exploreRoutes = require("./routes/explore");
var gettingStartedRoutes = require("./routes/getting-started");
var miscRoutes = require("./routes/misc");
var profileRoutes = require("./routes/profile");
var resetRoutes = require("./routes/reset");
var settingsRoutes = require("./routes/settings");
var homeRoutes = require("./routes/home");
var savedUsersRoutes = require("./routes/saved");
var likeRoutes = require("./routes/like");
var chatRoutes = require("./routes/chat");

mongoose.connect(process.env.DATABASEURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//-------------------------------------------------------

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Monty is so single!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(async (req,res,next) => {
    if(req.user){
        const user = await User.findById(req.user._id).populate('popupp');
        res.locals.notifications = user.popupp;
        user.popupp = [];
        user.save();
    }
    else{
        res.locals.notifications = [];
    }
    next();
});

app.use(authRoutes);
app.use(exploreRoutes)
app.use(gettingStartedRoutes);
app.use(miscRoutes);
app.use(profileRoutes);
app.use(resetRoutes);
app.use(settingsRoutes);
app.use(homeRoutes);
app.use(savedUsersRoutes);
app.use(likeRoutes);
app.use(chatRoutes);

//SOCKET STARTSSSS
client.on('connection', function(socket){
    
    // Create function to send status
    sendStatus = function(name,s){
        client.to(people[name]).emit('status', s);
    }
    
    socket.on('loaddata', function(data){
        message.find({from :data.self._id, to :data.with._id},function(err, res1){
            if(err){
                req.flash('error','Something went wrong');
                return res.redirect('back');
            }
            else{
                message.find({from :data.with._id, to :data.self._id},function(err, res2){
                    if(err){
                        req.flash("error", "Something went wrong")
                        return res.redirect("back");
                    } else {
                        res = res1.concat(res2);
                        res.sort(function(a, b) {
                            var dateA = new Date(a.date), dateB = new Date(b.date);
                            return dateA - dateB;
                        });
                        client.to(socket.id).emit('output',res);
                    }
                });
            }
        });
    });
    
    socket.on('join', function (data) {
        people[data.self.username] = socket.id     
    });
	
	
	// //typing functionality
    
    // socket.on('hey',function(data){
    //     console.log(data);
    // });
	
    
	
    
    
    //Client sending message
    socket.on('input', function(data){
       
        User.find({username:data.from},function(err,from){
            User.find({username:data.to},function(err,to){
                message.create({from:from[0]._id, text: data.message,to:to[0]._id}, function(err,newmsg){
                    if(err){
                        req.flash('error','SOMETHING WENT WRONG');
                       return res.redirect("back");
                    } else {
                        newmsg.text = data.message;
                        newmsg.save();
                        client.to(people[data.from]).emit('output',[newmsg]);
                        client.to(people[data.to]).emit('output',[newmsg]);
                        // Send status object
                        sendStatus(data.from,{
                            message: 'Message sent',
                            clear: true
                        });
                    } 
                });
            });
        });
    });
    socket.on('disconnect', function() {
        arr = Object.entries(people);
        for(var i = 0; i < arr.length;i++){
            if(arr[i][1]==socket.id){
                User.find({username:arr[i][0]},function(err,usr){
                    if(err){
                        console.log(err);
                    } else {
                        usr[0].lastseen = Date.now();
                        usr[0].save();
                    }
                });
                delete people[arr[i][0]];
                break;
            }
        }
        
    }); 
});
             
//catchall Route 

app.get("*", function(req,res) {
    res.render("404notfound")
});

http.listen(process.env.PORT || 3000, function() {
    console.log("SetItUp serving");
});
