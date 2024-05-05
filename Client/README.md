# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Docs:

### Axios:

When using get `axios.get(...)` if you are passing in request parameters, like a set or user id, instead of just doing `axios.get("url", parameters)`, you would do `axios.get("url", {params: parameters})`.

For example if you did `axios.get("http://localhost:9000/getUser", { username: username })`, you would now do: `axios.get("http://localhost:9000/getUser", { params: { username: username }})`


## Note about client side pages:
If you're page is conditionally rendered (only does something if the user is logger in).
You should use the Template function, which automatically renders the content for you only if the user is logged in.

### Documentation
`function Template(title, content)`

- title is the `h1` title at the beggining of the page.
    An example would be `"login"`.
- content is the html/react that should be condionally rendered.
    An example would be `<div>content</div>`.

### Usage:
Without template:
```jsx
import React from "react";

function YourPage() {
    // see if use is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    // state management

    return (<>
        {LoggedInUser != null &&
        <div>
            <h1>Your Title</h1>
            <p>Very important content that only logged in users can see.</p>
        </div>}
        {LoggedInUser == null &&
        <div>
            <h1>Your Title</h1>
            <p>Only logged in user can see this content, please login to view this page.</p>
        </div>
        }
    </>)
}

export default YourPage;
```
With template:
```jsx
import React from "react";

function YourPage() {
    // state management

    return Template("Your Page",
        <div>
            <p>Very important content that only logged in users can see.</p>
        </div>)
}

export default YourPage;
```



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
