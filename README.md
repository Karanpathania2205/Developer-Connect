# Developer-Connect
A social media platform for developers to connect. They can create their portofolio by adding their experience, education, skills and other important information of their professional career.

Users can also create small posts and like/dislike and comment on other posts.
Live Link : - https://limitless-falls-03289.herokuapp.com/



Quick Start
# clone repository
https://github.com/RoshanSureen/dev-connector.git

# Install dependencies
cd dev-connector && npm install

# create a .env file in root of your project
touch .env
In the .env file create the below 2 enviroment varieables. Make sure it is exactly as shown below. No special charecters or spaces must be there.

DB_URL=YOUR_OWN_MONGO_URI
TOKEN_SECRET=YOUR_OWN_SECRET
To run the development server:

# the development server runs on port 3000
npm run dev
To run production build:

# create code bundle
npm run build

# run production server
npm run prod
In the project a Procfile has also been provided. This file is used by Heroku.

To deploy this project to heroku see steps below:
You will need to install the heroku-cli

# Heroku-cli (paste link in browser)
https://devcenter.heroku.com/articles/heroku-cli
Afer installing heroku-cli run the following commands in terminal

# login locally
heroku login
You will be prompted to enter your email and password which is the same the email and password used when you sign up for Heroku

# create your app
heroku create

# set enviroment vareiables
heroku config:set DB_URL=YOUR_OWN_DB_URI
heroku config:set TOKEN_SECRET=YOUR_OWN_SECRET
Try to keep your production DB different from development DB

# bundle code for production
npm run build

# deploy code to heroku
git push heroku master:master

Main Technologies
Client Side
 React
 Redux
 Twitter Bootstap 4
 React-Router-DOM
Libraries used in Client-side
 axios
 classnames
 react-moment
 react-redux
 redux-thunk
 validator
Server Side
 Node.js / Express
 MongoDB
 JWT
 Passport
 Passport-jwt
Libraries used in Server-side
 bcryptjs
 bluebird
 gravatar
 mongoose
 jwt-decode
 moment
 validator
