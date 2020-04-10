# IESI User Interface

Under construction.

Visual user interface for the IESI automation framework.

## Usage

To do

## Development

### Setup

1. install nvm (https://github.com/creationix/nvm) if not installed yet
2. git clone <this repo>
3. switch to correct node version: `nvm install` (first time) or `nvm use` (later)
4. download dependencies: `npm install`
5. initialise the environment config file: `npm run init-env-config`
6. fill in the generated env config file

### Commands

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console. (except style lint errors)

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Development tips

#### enabling/disabling some dev features

Some dev features can be turned on/off by changing a flag within local storage.

##### general mechanism

* open chrome devtools
* within Local Storage (Application tab): change a boolean value of a flag within the IESI_UI_DVLP key to true or false
* refresh your browser page

##### possible stuff to enable/disable

    FLAG         (default value) : set to true if you want ...
    -----------------------------------------------------------------------------------
    ENABLE_API_LOGGING   (false) : ... console logging of each api request and response
    ENABLE_REDUX_LOGGING (false) : ... console logging of state actions and state changes
    ENABLE_STATE_STORAGE (true)  : ... the state to be stored in Browser storage (so that users do not loose anything when they for example refresh the page).
                                   Can be annoying during development, if so, toggle to false.

### Initial bootstrap of project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
