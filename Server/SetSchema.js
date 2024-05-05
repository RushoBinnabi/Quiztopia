const mongoose = require("mongoose");

const SetSchema = new mongoose.Schema({
    title : String,
    description : String,
    flashcards : [mongoose.Schema.Types.ObjectId],
});

const Set = mongoose.model("Set", SetSchema);

module.exports = Set
