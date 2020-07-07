var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    password: String,
    firstName: String,
    lastName: String,
    name: String,
    bio: String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    gender: String,
    phNumber: {type: String, unique: true},
    city: String,
    image: String,
    imageId: String,
    date: String,
    age: String,
    userAgeGroup: String,
    nickname: String,
    maritalStatus: String,
    relType: String,
    relPreference: String,
    relInitialAge: String,
    relFinalAge: String,
    relAgeGroup: String,
    relDistance: String,
    liveIn: String,
    currently: String,
    virgin: String,
    cook: String,
    income: String,
    languages: String,
    images: [{
        url: String,
        public_id: String
    }],
    fbLink : String,
    igLink : String,
    twitterLink : String,
    savedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    bothLiked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

});


UserSchema.plugin(passportLocalMongoose, {
    usernameQueryFields: ["phNumber","email"]
});

module.exports = mongoose.model("User", UserSchema);
