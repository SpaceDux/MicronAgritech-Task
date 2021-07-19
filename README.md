# MicronAgritech Task
You will have to create a simple frontend-backend application which uses postgreSQL (or any other database of your choice), it should have the below functionality:
- The front-end of this application will contain only two fields, username and password - fields required by the user to login to the system.
- The backend will store the user details in the postgresql database (or any other database of choice), once a request is initiated from the front-end, credentials are verified in the backend (from the database), then the user is authenticated to login.
- Once the users are logged in successfully, a welcome message should be shown to the user.
**Extra points for additional functionalities other than those mentioned above.

# How I completed this task
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
1. "/api/users/login"
1. "/api/users/register"
1. "/api/users/heartbeat"
1. "/api/users/logout"

I then created a new nodejs module "mysql.class.js". Within this module is the MySQL credentials, and a mysql pool connection is established.

After that, I created another module "users.class.js". Here is where all the user functions are written. 
The first function I wrote is "Login".
In order to authenticate a user, we need to run a couple of checks. Firstly we need to ensure our API has received the body. If the body json data is pressent, we then need to check if the username exists in our database. To do this a simple query is required, firstly we must get a connection from the mysql pool, once this is done we simply select password from the users table where the username equals the requested. If row exists, we then need to check that the stored password hash matches the users sent plain text password. If all is correct I run another query to update the users data with a new "lastloggedin" datetime string, I then simply resolve the promise and from there, I create a simple cookie containing the value of user id and return it.`
