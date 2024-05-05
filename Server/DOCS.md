# Documentation:

## Express:

When wrting a get instead of using `req.body` use `req.query`.

For example if previously you had:
```js
app.get("/getUser", async (req, res) => {
    const userID = req.body.userID;
    const retUser = await User.findById(userID);
    let user = {
        firstName: retUser.firstName,
        lastName: retUser.lastName,
        username: retUser.username,
        _id: retUser._id
    }

    res.send(user);
})
```

You would need to do:
```js
app.get("/getUser", async (req, res) => {
    const userID = req.query.userID;
    const retUser = await User.findById(userID);
    let user = {
        firstName: retUser.firstName,
        lastName: retUser.lastName,
        username: retUser.username,
        _id: retUser._id
    }

    res.send(user);
})
```

Also when responding back to the client, use res, instead of req.
For example instead of `req.send(data)`, do `res.send(data)`.

## Mongoose (mongo):

When creating new mongo objects with `new ObjectName(...)`, use `new ObjectName({...})`.
For example if you are doing `new Class(title, description)`, do `new Class({title, description})`.
