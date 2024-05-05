const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
    title : String,
    parent : mongoose.Schema.Types.ObjectId,
    children : [mongoose.Schema.Types.ObjectId],
    sets : [mongoose.Schema.Types.ObjectId]
});

const Folder = mongoose.model("Folder", FolderSchema);

module.exports = Folder
