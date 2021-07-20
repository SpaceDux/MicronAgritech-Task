# MicronAgritech Task
You will have to create a simple frontend-backend application which uses postgreSQL (or any other database of your choice), it should have the below functionality:
- The front-end of this application will contain only two fields, username and password - fields required by the user to login to the system.
- The backend will store the user details in the postgresql database (or any other database of choice), once a request is initiated from the front-end, credentials are verified in the backend (from the database), then the user is authenticated to login.
- Once the users are logged in successfully, a welcome message should be shown to the user.
**Extra points for additional functionalities other than those mentioned above.

# How to use / install.
- Ensure NodeJS & MySQL is installed (also NPM)
- Download files, and place into a directory of your choice.
- Import the "database.sql" to MySQL
- In terminal, cd into directory
- Run the following: npm install
- Navigate to file "mysql.class.js" and modify the mysql connection infomation
- run npm start
- Navigate to http://localhost:3000

# How I completed this task (Backend)
To do this, I decided to use **NodeJS** & **MySQL**, this reason is purely down to comfort.

Immediately upon reading the task requirements, I knew that by storing user data, we're going to need to hash the password, so I have chosen to use **bcypt**.


So I started by creating a few nodejs instance "npm init -y". Once nodejs had completed the init, I then proceeded to create the "index.js" file, this will be my main.
In the main file, I began planning my HTTP endpoints. Firstly I decided to use Express as a webserver. In-order to use Express, I needed to install the package, and some middleware packages.
1. Installed Express.
1. MySQL.
1. Installed body-parser.
1. Installed cookie-parser.
1. Installed cors.

Following the installation of the required packages, I began to write my backend HTTP API endpoints.
I wrote the following routes;
1. "/api/users/login" [POST]
1. "/api/users/register" [POST]
1. "/api/users/heartbeat" [GET]
1. "/api/users/logout" [GET]

I then created a new nodejs module "mysql.class.js". Within this module is the MySQL credentials, and a mysql pool connection is established.

I designed the database schema, created a users table, within this table I have 6 columns, id, username, password, firstname, lastname, lastloggedin.

After that, I created another module "users.class.js". Here is where all the user functions are written. 
The first function I wrote is "Login".
In order to authenticate a user, we need to run a couple of checks. Firstly we need to ensure our API has received the body. If the body json data is pressent, we then need to check if the username exists in our database. To do this a simple query is required, firstly we must get a connection from the mysql pool, once this is done we simply select password from the users table where the username equals the requested. If row exists, we then need to check that the stored password hash matches the users sent plain text password. If all is correct I run another query to update the users data with a new "lastloggedin" datetime string, I then simply resolve the promise and from there, I then create a simple cookie containing the value of user id and return it (The cookie will expire after 360000ms / 6min.
I then began testing this endpoint, refining where required. To test this I used an application called "Postman", Postman is great platform for API development and testing.
Once I was happy with the test results, I moved onto the next function.
Next I wrote the "register" function, now this requires a check to ensure the username requested isn't yet taken, so we run a query to select the count of rows where username = requested username, if it does exist, the function will return a bad result with the message indicating the issue.
If the username does not exist, the function will continue to add the new user to the database, firstly hashing the users password, then run an insert query.
Again, using Postman to test this endpoint.
Following this I then created a simple info function, which would take the cookie value (which is the users id), run a query to select user information, and then return the result so we can then use this to display on our frontend.
In-order to use our api from a browser, I will need to setup basic CORS policies, to do this I will use an Express middleware "cors" and set up to allow credentials, and allow-origins of http://localhost & null

# How I completed the task (Frontend)
I considered my options, I could have used various frameworks for this, but I decided as the task says "simple", I kept everything in one place.
In-order to render out a html template, I used EJS, a lightweight yet powerful view-engine for nodejs.
I then created 4 new endpoints in our index.js. /index, /home, /register, /logout. As we're creating a basic authentication system, I simply made sure that /home was not accessible without a cookie, and also /index & /register was only accessible without a cookie.
Then I created a new file inside the views directory "index.ejs".
In here is all our html for the login page, I also do all the JavaScript within the template files to send requests to our API using JavaScript Fetch. For ease, I also used bootstrap CSS CDN.
I now have a form with 2 inputs, and 2 buttons, one button to login, and another to go-to the register page.
I began writing the Login function within the index.ejs file, when the form is submit, I need to prevent default browser behaviour, I then need to get the values from the inputs, and prepare a JSON body to send to our API. I then send a request to the api, the api returns a JSON result which has the following data; Result (int), Message (string). If the result is > 0, it will provide a successful authentication, the message will also indicate this. I output the message to the DOM with an id of "Message", simply setting the innerHTML. If the login is successful, along with the message, the page will automatically redirect you to the /home.
After Login, I wrote the register page, again very similar style, it contains 5 inputs, username, password, confirm password, firstname, lastname.
Upon form submit, I prevent the browsers default behaviour, and then get the values of all the inputs, before making a request to the api, I need to check the Password is identical to Confirm Password. Doing this will prevent the user making a mistake within their password.
Once the passwords match, I will then make a JSON object of the data and send a request to the api, I will then deal with the response from the request the same way I did previously with the login, output a message to the DOM.
Once a user has authenticated, they will be redirected to /home, on this page you will see a welcome message, full name, login request time and also a logout button.
Every 10seconds interval there is a heartbeat request sent to the server, this will tell our frontend if the users cookie is still valid, it will also return the users information.
To log the user out, I simply send a request to the /api/users/logout, the server then clears the cookie and sends a response, following the response, the user will be redirected to /index.


Thank you for your time.
Ryan Williams.
