var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    date: {type: Date, default: Date.now},
    text : {type:String,default:"nothing here"},
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    to : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("message", messageSchema);