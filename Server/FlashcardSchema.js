const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
    term : String,
    definition : String,
    profficiency : Number
});

const Flashcard = mongoose.model("Flashcard", FlashcardSchema);

module.exports = Flashcard
