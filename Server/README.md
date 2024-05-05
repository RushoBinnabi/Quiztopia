# Run instructions:
If everything is set up as expected, you should be able to type `node index.js` into your terminal from `Quiztopia/Server/`

# Database calls:
## Schema:

### User
Data:
- `_id`
- `firstName : String` - The User's first name.
- `lastName : String` - The User's last name.
- `username : String` - The User's username.
- `password : String` - The User's password.
- `rootFolder : Folder` - The root folder containing the user's flashcard sets and folders.
- `classes : [Class]` - A list of the user's classes.

Database Calls:
- `/createUser` - `(req:{firstName : String, lastName : String, username : String, password : String}, res{})` - Creates a new user using the provided information. Returns error if a user with the same username already exists.
- `/getUsers` - `(req:{userIDs : [User._id]}, res{userList : [User]})` - UNTESTED: Returns a list of Users. Does not return the passwords of the returned Users.
- `/getUser` - `(req:{userID : User._id}, res{retUser : User})` - UNTESTED: Returns the specified User.
- `/getUserByUsername` - `(req:{username : String}, res{User})` - UNTESTED: Returns the specified User, not including the password.
- `/loginUser` - `(req:{username : String, password : String}, res{User})` - UNTESTED: Returns the specified user, if applicable.
- `/deleteUser` - `(req:{userID : User._id}, res{})` - UNTESTED
- `/___` - `(req:{}, res{})` - // If you need other calls, lmk.


### Folder
Data:
- `_id`
- `title : String` - The name of the folder.
- `parent : Folder` - The parent folder of this folder. If it is the root folder, store self.
- `children : [Folder]` - The child folders of this folder.
- `sets : [Set]` - The Sets stored in this folder.

Database Calls:
- `/createFolder` - `(req : {title : String, parentID : Folder._id}, res{folder : Folder})` - UNTESTED
- `/getFolderByID` - `(req : {folderID : Folder._id}, res : {title : String, parent : SmallFolder, children : [SmallFolder], sets : [SmallSet]})` - UNTESTED
- `/moveFolder` - `(req : {thisFolderID: Folder._id, newParentID : Folder._id}, res {})` - UNTESTED
- `/moveSet` - `(req : {set: Set._id, oldParentID : Folder._id, newParentID : Folder._id}, res {})` - UNTESTED
- `/deleteFolder` - `(req:{deletedID : Folder._id}, res{})` - UNTESTED
- `/___` - `(req:{}, res{})` - // If you need other calls, lmk.

SmallFolder = `{title : String, folderID : Folder._id}`


### Class
Data:
- `_id`
- `root : Folder` - The root folder of the class that contains each folder, and set in the Class.
- `owner : User` - The owner of the class.
- `teachers : [User]` - The Users that are given admin access for grading and examination.
- `students : [User]` - The Users that are allowed to view the class.

Database Calls:
- `/createClass` - `(req : {title : String, description : String, owner : User._id}, res {Class})` - UNTESTED
- `/getClass` - `(req : {classID : Class._id}, res {})` - UNTESTED
- `/addStudent` - `(classID : Class._id, studentID : [User._id])` - UNTESTED
- `/editTeachers` - `(req : {teachers : [User._id]}, res {})` - UNIMPLEMENTED
- `/addTeacher` - `(req : {teachers : [User._id]}, res {})` - UNTESTED
- `/removeStudent` - `(req : {classID : Class._id, studentID : [User._id]}, res {})` - UNTESTED
- `/removeTeacher` - `(req : {classID : Class._id, studentID : [User._id]}, res {})` - UNTESTED
- `/deleteClass` - `(req : classID : Class._id)` - UNTESTED
- `/___` - `(req:{}, res{})` - // If you need other calls, lmk.

### Set
Data:
- `_id`
- `title : String` - The name of this flashcard set.
- `description : String` - An optional description describing this set.
- `flashcards : [Flashcard]` - The flashcards in this set.

Database Calls:
- `/createSet` - `(req:{parent : Folder._id, title : String, description : String, flashcards : [Flashcard]}, res{})` - UNTESTED
- `/getSet` - `(req:(id : Set._id), res(Set : Set, flashcards : [Flashcard]))` - UNTESTED
- `/editSet` - `(req:{setID : Set._id, title : String, description : String}, res{})` - UNTESTED
- `/addCard` - `(req:{setID : Set._id, term : String, definition : String}, res:{_id : Flashcard._id})` - UNTESTED
- `/removeCard` - `(req:{setID : Set._id, flashcard : Flashcard._id}, res{})` - UNTESTED
- `/deleteSet` - `(req:{setID : Set._id}, res{})` - UNTESTED
- `/___` - `(req:{}, res{})` - // If you need other calls, lmk.

SmallSet : `{title : String, _id : Set._id}`

### Flashcard
Data:
- `_id`
- `term : String` - The front of the flashcard.
- `definition : String` - The back of the flashcard.
- `profficiency : number` - // TODO: figure out how to map to each user.

Database Calls:
- `/getCard` - `(req:{cardID : Flashcard._id}, res{Flashcard})` - UNTESTED
- `/editCard` - `(req:{flashcardID : Flashcard._id term : String, definition : Stringt}, res{})` - UNTESTED
- `/updateProfficiency` - `(req:{cardID : Flashcard._id, profficiency : Number}, res{})` - UNTESTED
- `/___` - `(req:{}, res{})` - // If you need other calls, lmk.
