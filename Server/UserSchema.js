const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    username : String,
    password : String,
    folder : mongoose.Schema.Types.ObjectId,
    classes : [mongoose.Schema.Types.ObjectId]
});

const User = mongoose.model("User", UserSchema);

module.exports = User
