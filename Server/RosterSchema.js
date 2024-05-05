const mongoose = require("mongoose");

const RosterSchema = new mongoose.Schema({
    users : [mongoose.Schema.Types.ObjectId]
});

const Roster = mongoose.model("Roster", RosterSchema);

module.exports = Roster
