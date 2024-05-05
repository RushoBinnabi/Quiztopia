const express = require('express');
const cors = require('cors');
const app = express();

const User = require('./UserSchema.js');
const Folder = require('./FolderSchema.js');
const Set = require('./SetSchema.js');
const Flashcard = require('./FlashcardSchema.js');
const Class = require('./ClassSchema.js');


app.use(express.json());
app.use(cors());
app.listen(9000, () => {
    console.log(`Server Started at ${9000}`)
})

const mongoose = require('mongoose');

const mongoString = "mongodb+srv://quiztopia:6YaTcokwzpoSo3nW@databace.kfmvvmh.mongodb.net/";
mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => console.log(error))
database.once('connected', () => console.log('Database Connected'))

/**
 * http://localhost:9000/createUser
 * 
 * Creates a new user using the provided information. Returns error if a user with the same username already exists.
 * 
 * @param firstName The first name of the new user.
 * @param lastName The last name of the new user.
 * @param username The username of the new user.
 * @param password The password for the new user.
 * @returns The newly created User.
 */
app.post('/createUser', async (req, res) => {
    try {
        // Get info
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username;
        const password = req.body.password;
        console.log("/createUser FN:" + firstName + " LN:" + lastName + " ID:" + username + " PW:" + password);

        // Check that there isn't another user with the same username
        const testUsername = await User.findOne({ username: username });

        if (testUsername == null) {
            const rootFolder = await createRootFolder(username)

            // Make empty classes array
            const classes = [];

            // Make the new user, and return result.
            const user = new User({ firstName, lastName, username, password, folder: rootFolder._id, classes });
            await user.save()
            res.send(user);
        }
        else {
            res.status(500).send("Username already exists")
            console.log("ERROR: Username: \"" + username + "\" already exists.");
        }
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

// - `/getUsers` - `(req:{userIDs : [User._id]}, res{userList : [User]})` - UNTESTED
app.post('/getUsers', async (req, res) => {
    try {
        const userIDs = req.body.userIDs;
        console.log("/getUsers ids: " + userIDs);

        let userList = [];

        for (const id of userIDs) {
            const user = await User.findById(id);
            userList.push({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                _id: user._id
            });
        }
        res.send(userList);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
})

/**
 * http://localhost:9000/getUser
 * 
 * Gets the user specified by the passed userID
 * 
 * @param userID The User._id of the desired user.
 * @returns The user specified by the passed userID.
 */
app.post('/getUser', async (req, res) => {
    try {
        const userID = req.body.userID;
        console.log("/getUser id: " + userID);

        const retUser = await User.findById(userID);

        let classes = [];

        if (retUser.classes){
            for (const classID of retUser.classes) {
                const clase = await Class.findById(classID)
                classes.push({
                    title: clase.title,
                    _id: classID
                })
            }
        }        

        let user = {
            firstName: retUser.firstName,
            lastName: retUser.lastName,
            username: retUser.username,
            folder: retUser.folder,
            classes: classes,
            _id: retUser._id
        }

        res.send(user);
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
})

// - `/getUserByUsername` - `(req:{username : String}, res{User})` - UNTESTED
app.post('/getUserByUsername', async (req, res) => {
    try {
        const username = req.body.username;
        console.log("/getUserByName UN: " + username);

        const user = await User.findOne({ username: username });

        let retUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            _id: user._id
        }
        res.send(retUser);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
})

// - `/searchUserByLastName` - `(req:{lastName : String}, res{users : [User]})` - UNTESTED
app.get('/searchUserByLastName', async (req, res) => {
    try {
        const lastName = req.body.lastName;
        console.log("/searchUserByLastName LN: " + lastName);

        const users = User.find({ lastName: lastName });
        let retUsers = [];
        for (const user of users) {
            retUsers.push({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                _id: user._id
            })
        }

        res.send(retUsers)
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});

/**
 * http://localhost:9000/loginUser
 * 
 * Takes a username and password and returns the specified user if the correct password is given.
 * 
 * @param username The username of the desired User.
 * @param password The password attempt for the desired User.
 * @returns The specified user.
 */
app.post('/loginUser', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        console.log("/loginUser UN: " + username + " PW: " + password);

        const user = await User.findOne({ username: username, password: password });

        res.send(user);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
})

/**
 * http://localhost:9000/deleteUser
 * 
 * Takes a User._id and deletes the specifed User.
 * 
 * @param userID The User._id of the user to be deleted.
 */
app.post('/deleteUser', async (req, res) => {
    try {
        const userID = req.body.userID;
        console.log("/deleteUser id: " + userID);

        const deletedUser = await User.deleteOne({ _id: userID });

        res.send(deletedUser);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});


/**
 * http://localhost:9000/createFolder
 * 
 * Takes a title, and a parent folder, and creates a new folder.
 * 
 * @param title : String. The title of the new folder.
 * @param parentID : Folder._id. The parent folder to the new folder. 
 * @returns The newly created folder.
 */
app.post('/createFolder', async (req, res) => {
    try {
        const title = req.body.title;
        const parentID = req.body.parentID.substring(0, 24);
        console.log("/createFolder Title: " + title + " parent: " + parentID);

        const children = [];
        const sets = [];

        // Add to parent folder.
        const parent = await Folder.findById(parentID);

        const folder = new Folder({ title: title, parent: parent._id, children, sets });
        await folder.save();

        //console.log(parent);

        let oldChildren = parent.children;
        oldChildren.push(folder._id);
        await Folder.findByIdAndUpdate(parent._id, {
            children: oldChildren
        })

        res.send(folder);
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

/**
 * http://localhost:9000/getFolderByID
 * 
 * Returns a folder based on the passed folder._id.
 * 
 * @param folderID The folder ID to aquire.
 * @returns {title : String, parent : SmallFolder, children : [SmallFolder], sets : [SmallSet]}
 */
app.post('/getFolderByID', async (req, res) => {
    try {
        //console.log((req.body));
        const folderID = req.body.folderID//.substring(0, 24);
        console.log("/getFolderByID id: " + folderID);

        const folder = await Folder.findById(folderID);

        const parentFolder = await Folder.findById(folder.parent);

        let parent = null;
        if (parentFolder != null) {
            parent = {
                title: parentFolder.title,
                _id: parentFolder._id
            }
        }

        let children = [];

        for (const childID of folder.children) {
            const child = await Folder.findById(childID);
            if (child !=null)
            children.push({
                title: child.title,
                _id: childID
            });
        }

        let sets = [];

        for (const setID of folder.sets) {
            const set = await Set.findById(setID);
            sets.push({
                title: set.title,
                _id: setID
            });
        }

        let retFolder = {
            title: folder.title,
            parent: parent,
            children: children,
            sets: sets
        }
        //console.log(retFolder);
        res.send(retFolder);
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

// - `/moveFolder` - `(req : {thisFolderID: Folder._id, newParentID : Folder._id}, res {})` - UNTESTED
app.patch('/moveFolder', async (req, res) => {
    try {
        const thisFolderID = req.body.thisFolderID;
        const newParentID = req.body.newParentID;
        console.log("/moveFolder thisFolder: " + thisFolderID + " NewParentID: " + newParentID);

        // Remove from old parent folder.
        const thisFolder = await Folder.findById(thisFolderID);
        const oldParent = await Folder.findById(thisFolder.parent);
        let oldChildren = oldParent.children;
        const index = oldChildren.indexOf(thisFolderID);
        oldChildren.splice(index, 1);

        await Folder.findByIdAndUpdate(oldParent._id, {
            children: oldChildren
        })

        // Add to new parent folder
        const newParent = await Folder.findById(newParentID);
        let newChildren = newParent.children;
        newChildren.push(thisFolderID);
        await Folder.findByIdAndUpdate(newParentID, {
            children: newChildren
        })

        await Folder.findByIdAndUpdate(thisFolderID, {
            parent: newParentID
        });
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});

// - `/moveSet` - `(req : {set: Set._id, oldParentID : Folder._id, newParentID : Folder._id}, res {})` - UNTESTED
app.patch('/moveSet', async (req, res) => {
    try {
        const set = req.body.set;
        const oldParentID = req.body.oldParentID
        const newParentID = req.body.newParentID;
        console.log("/moveSet set: " + set + " OldParentID: " + oldParentID + " NewParentID: " + newParentID);

        // Remove from old parent folder.
        const oldParent = await Folder.findById(oldParentID);
        let oldSets = oldParent.sets;
        const index = oldSets.indexOf(set);
        oldSets.splice(index, 1);

        await Folder.findByIdAndUpdate(oldParent._id, {
            sets: oldSets
        })

        // Add to new parent folder
        const newParent = await Folder.findById(newParentID);
        let newSets = newParent.sets;
        newSets.push(set);
        await Set.findByIdAndUpdate(newParentID, {
            sets: newSets
        })
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});

// - `/deleteFolder` - `(req:{deletedID : Folder._id}, res{})` - UNTESTED
app.post('/deleteFolder', async (req, res) => {
    try {
        const deletedID = req.body.deletedID;
        console.log("/deleteFolder deleted: " + deletedID);

        const deleted = await Folder.findById(deletedID);
        const parent = await Folder.findById(deleted.parent);

        console.log(parent);

        let children = parent.children;
        const index = children.indexOf(deletedID);
        children.splice(index, 1);

        await Set.findByIdAndUpdate(parent._id, {
            children: children
        })

        console.log(parent);

        // Recursivly delete all children.
        deleteFolder(deletedID);
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});


// - `http://localhost:9000/createClass` - `(req : {title : String, description : String, owner : User._id}, res {Class})` - UNTESTED
/**
 * http://localhost:9000/createClass
 * 
 * Creates a new class with the passed Title, Description, and ownerID.
 * 
 * @param title The title of the new class.
 * @param description The description of the new class.
 * @param owner The User._id of the new class.
 * @returns The newly created class.
 */
app.post('/createClass', async (req, res) => {
    try {
        //console.log(req.body);
        const title = req.body.title;
        const description = req.body.description;
        const ownerID = req.body.owner;
        console.log("/createClass title: " + title + 
            " Desc: " + description + 
            " Owner: " + ownerID);

        const folder = await createRootFolder(title);
        const teachers = [];
        const students = [];

        const newClass = new Class({
            title : title,
            description : description,
            folder : folder,
            owner : ownerID,
            teachers : teachers,
            students : students
        });
        await newClass.save();

        // Add to owner's classes
        const owner = await User.findById(ownerID);
        let classes = owner.classes || [];

        classes.push(newClass._id);

        await User.findByIdAndUpdate(ownerID, {
            classes: classes
        })

        res.send(newClass);
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

/**
 * http://localhost:9000/getClass
 * 
 * @param classID The Class._id of the desired Class.
 * @returns The specified class.
 */
app.post('/getClass', async (req, res) => {
    try {
        const classID = req.body.classID;
        console.log("/getClass ID: " + classID)

        const retClass = await Class.findById(classID);

        res.send(retClass);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
})

// - `/addStudent` - `(classID : Class._id, studentID : User._id)` - UNTESTED
app.post('/addStudent', async (req, res) => {
    try {
        const classID = req.body.classID;
        const username = req.body.studentUsername;
        console.log("/addStudent classID: " + classID + " studentUsername: " + username);

        const student = await User.findOne({
            username : username
        })

        if (student != null){
            const clase = await Class.findById(classID);

            // Add teacher to class
            let students = clase.students;
            students.push(student._id);

            await Class.findByIdAndUpdate(classID, {
                students: students
            })

            // Add class to teacher
            let classes = student.classes;
            classes.push(classID);

            await User.findByIdAndUpdate(student._id, {
                classes: classes
            })
            res.send(student);
        }
        else{
            console.log("Teacher " + username + " not found")
            res.status(404)
        }
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
})

// - `/addTeacher` - `(req : {teachers : User._id}, res {})` - UNTESTED
app.post('/addTeacher', async (req, res) => {
    try {
        const classID = req.body.classID;
        const username = req.body.teacherUsername;
        console.log("/addTeacher classID: " + classID + " teacherID: " + username);

        const teacher = await User.findOne({
            username : username
        })

        if (teacher != null){
            const clase = await Class.findById(classID);

            // Add teacher to class
            let teachers = clase.teachers;
            teachers.push(teacher._id);

            await Class.findByIdAndUpdate(classID, {
                teachers: teachers
            })

            // Add class to teacher
            let classes = teacher.classes;
            classes.push(classID);

            await User.findByIdAndUpdate(teacher._id, {
                classes: classes
            })
            res.send(teacher);
        }
        else{
            console.log("Teacher " + username + " not found")
            res.status(404)
        }
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
})

// - `/removeStudent` - `(req : {classID : Class._id, studentID : [User._id]}, res {})` - UNTESTED
app.post('/removeStudent', async (req, res) => {
    try {
        const classID = req.body.classID;
        const studentID = req.body.studentID;
        console.log("/removeStudent classID: " + classID + " studentID: " + studentID);

        // Remove student from roster.
        const classs = await Class.findById(classID);

        let students = classs.students;
        const studentIndex = students.indexOf(studentID);
        students.splice(studentIndex, 1);

        await Class.findByIdAndUpdate(classID, {
            students: students
        })

        // Remove class from student's class list.
        const student = await User.findById(studentID);

        let classes = student.classes;
        const classIndex = classes.indexOf(classID);
        classes.splice(classIndex, 1);

        await User.findByIdAndUpdate(studentID, {
            classes: classes
        })

        return classs.students;
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

// - `/removeTeacher` - `(req : {classID : Class._id, studentID : [User._id]}, res {})` - UNTESTED
app.post('/removeTeacher', async (req, res) => {
    try {
        const classID = req.body.classID;
        const teacherID = req.body.teacherID;
        console.log("/removeStudent classID: " + classID + " studentID: " + teacherID);

        // Remove student from roster.
        const classs = await Class.findById(classID);

        let teachers = classs.teachers;
        const studentIndex = teachers.indexOf(teacherID);
        teachers.splice(studentIndex, 1);

        await Class.findByIdAndUpdate(classID, {
            teachers: teachers
        })

        // Remove class from student's class list.
        const teacher = await User.findById(teacherID);

        let classes = teacher.classes;
        const classIndex = classes.indexOf(classID);
        classes.splice(classIndex, 1);

        await User.findByIdAndUpdate(teacherID, {
            classes: classes
        })

        return classs.teachers;
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

// - `/deleteClass` - `(req : classID : Class._id)` - UNTESTED
app.delete('/deleteClass', async (req, res) => {
    try {
        const classID = req.body.classID;
        console.log("/deleteClass ID: " + classID);

        await Class.findByIdAndDelete(classID);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});


// - `/createSet` - `(req:{parent : Folder._id, title : String, description : String}, res{})` - UNTESTED
app.post('/createSet', async (req, res) => {
    try {
        console.log(req.body)
        const parentID = req.body.parent;
        const title = req.body.title;
        const description = req.body.description;
        console.log("/createSet Parent: " + parentID + " Title: " + title + " Desc: " + description);

        const flashcards = [];

        const set = new Set({ title, description, flashcards });
        set.save();

        // Add to folder.
        const parent = await Folder.findById(parentID);
        let sets = parent.sets;
        sets.push(set);

        await Folder.findByIdAndUpdate(parentID, {
            sets: sets
        });

        res.send(set);
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

// - `/getSet` - `(req:(setID : Set._id), res(Set : Set, flashcards : [Flashcard]))` - UNTESTED
app.get('/getSet', async (req, res) => {
    try {
        console.log(JSON.stringify(req.query));
        const id = req.query.setID;

        console.log("/getSet ID: " + id);

        const set = await Set.findById(id);

        let flashcards = [];

        for (const cardID of set.flashcards) {
            const flashcard = await Flashcard.findById(cardID)
            flashcards.push(flashcard);
        }

        res.send({ set: set, flashcards: flashcards });
    }
    catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
})

// - `/editSet` - `(req:{setID : Set._id, title : String, description : String}, res{})` - UNTESTED
app.patch('/editSet', async (req, res) => {
    try {
        const setID = req.body.setID;
        const title = req.body.title;
        const description = req.body.description;
        console.log("/editSet ID: " + setID + " title: " + title + " description: " + description);

        const card = await Flashcard.findByIdAndUpdate(setID, {
            title: title,
            description: description
        });

        res.send(card);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});

// `/addCard` - `(req:{setID : Set._id, term : String, definition : String}, res:{_id : Flashcard._id})` - UNTESTED
app.post('/addCard', async (req, res) => {
    try {
        const setID = req.body.setID;
        const term = req.body.term;
        const definition = req.body.definition;
        const profficiency = 0;
        console.log("/addCard SetID: " + setID + " Term : " + term + " Def: " + definition);

        const flashcard = new Flashcard({term, definition, profficiency});
        console.log("/addCard created")
        await flashcard.save();
        console.log("/addCard saved")

        const set = await Set.findById(setID);
        console.log("/addCard found set")
        let flashcards = set.flashcards;
        flashcards.push(flashcard._id);
        console.log("/addCard added new card")

        await Set.findByIdAndUpdate(setID, {
            flashcards : flashcards
        });

        res.send(flashcard);
    }
    catch (error) {
        console.log(`/addSet err`)
        res.status().send(error);
        console.log(error);
    }
});

// `/removeCard` = `(req:{setID : Set._id, flashcard : Flashcard._id}, res{})` - UNTESTED
app.delete('/removeCard', async (req, res) => {
    try {
        const setID = req.body.setID;
        const flashcardID = req.body.flashcardID;
        console.log("/removeCard setID: " + setID + " flashcardID: " + flashcardID);

        const set = await Set.findById(setID);

        let flashcards = set.flashcards;
        const index = flashcards.indexOf(flashcardID);
        flashcards.splice(index, 1);

        await Flashcard.findByIdAndDelete(flashcardID);
        await Set.findByIdAndUpdate(setID, {
            flashcards: flashcards
        })
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});

// - `/deleteSet` - `(req:{setID : Set._id}, res{})` - UNTESTED
app.delete('/deleteSet', async (req, res) => {
    try {
        const setID = req.body.setID;
        console.log("/deleteSet id: " + setID);

        deleteSet(setID);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});


// - `/getCard` - `(req:{cardID : Flashcard._id}, res{Flashcard})` - UNTESTED
app.get('/getCard', async (req, res) => {
    try {
        const cardID = req.body.cardID;

        const card = await Flashcard.findById(cardID);

        res.send(card);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
})

// - `/editCard` - `(req:{flashcardID : Flashcard._id term : String, definition : Stringt}, res{})` - UNTESTED
app.patch('/editCard', async (req, res) => {
    try {
        const cardID = req.body.flashcardID;
        const term = req.body.term;
        const definition = req.body.definition;
        console.log("/editCard ID: " + cardID + " term: " + term + " definition: " + definition);

        const card = await Flashcard.findByIdAndUpdate(cardID, {
            term: term,
            definition: definition
        });

        res.send(card);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});

// - `/updateProfficiency` - `(req:{cardID : Flashcard._id, profficiency : Number}, res{})` - UNTESTED
app.patch('/updateProfficiency', async (req, res) => {
    try {
        const cardID = req.body.flashcardID;
        const profficiency = req.body.profficiency;
        console.log("/editCard ID: " + cardID + " prof: " + profficiency);

        const card = await Flashcard.findByIdAndUpdate(cardID, {
            profficiency: profficiency
        });

        res.send(card);
    }
    catch (error) {
        res.status().send(error);
        console.log(error);
    }
});


// Helper Methods:

/**
 * Creates a root folder for a new User or Class.
 * 
 * @param {String} name 
 * @returns A new root folder, initialized correctly.
 */
async function createRootFolder(name) {
    const title = name + "RootFolder";
    const parent = null;
    const children = [];
    const sets = []

    const newFolder = new Folder({ title, parent, children, sets });
    const root = await newFolder.save();
    return root;
}

/**
 * UNTESTED: Recursivly deletes all child folders, and sets of a given folder.
 * 
 * @param {Folder._id} id 
 */
async function deleteFolder(id) {
    const folder = await Folder.findById(id);

    // delete children
    for (const child of folder.children) {
        deleteFolder(child._id);
    }

    // Delete sets
    for (const set of folder.sets) {
        const set = await Set.findByIdAndDelete(set);

        deleteSet(set._id);
    }

    // Delete from DB
    await Folder.findByIdAndDelete(folder);
}

/**
 * UNTESTED: Deletes the passed set and all flashcards within the set.
 * @param {Set._id} id 
 */
function deleteSet(id) {

    const set = Set.findById(id)

    for (const card of set) {
        Flashcard.findByIdAndDelete(card._id);
    }

    Set.findByIdAndDelete(id);
}
