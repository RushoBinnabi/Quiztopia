const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    title : String,
    description : String,
    folder : mongoose.Schema.Types.ObjectId,
    owner : mongoose.Schema.Types.ObjectId,
    teachers : [mongoose.Schema.Types.ObjectId],
    students : [mongoose.Schema.Types.ObjectId]
});

const Class = mongoose.model("Class", ClassSchema);

module.exports = Class;
