let pool = require("./mysql.class.js").Connect()
let bcrypt = require("bcrypt")

let thisclass = {
  Login: function(username, password) {
    return new Promise(function(resolve, reject) {
      // Ensure username & password are pressent.
      if(username, password) {
        // Get a connection from the mysql connection pool.
        pool.getConnection((err, connection) => {
          // if no error from retrieving connection.
          if(!err) {
            // get the user id & password hash from the db. Limit this by one as username needs to be unique.
            connection.query("SELECT id,password FROM users WHERE username = ? LIMIT 1", [username], (err, rows) => {
              // Ensure user is pressent based on returned row count.
              if(rows.length > 0) {
                // Lets check that the plain password from user matches the users hashed password in the db.
                bcrypt.compare(password, rows[0].password, function(err, result) {
                  if(!err) {
                    // store this as a let, as we will require it shortly.
                    let userid = rows[0].id;
                    // If password matches hash, begin login actions.
                    if(result == true) {
                      connection.query("UPDATE users SET lastloggedin = CURRENT_TIMESTAMP WHERE id = ?", [rows[0].id], (err, rows) => {
                        if(!err) {
                          if(rows.affectedRows > 0) {
                            // Release connection back to pool.
                            connection.release();
                            resolve({"Result":1, "Message":"User has authenticated successfully.", "UserID":userid})
                          } else {
                            // Release connection back to pool.
                            connection.release();
                            reject({"Result":0, "Message":"Sorry, we couldnt log you in. [mysql]"})
                          }
                        } else {
                          // Release connection back to pool.
                          connection.release();
                          reject({"Result":0, "Message":"Sorry, we couldnt log you in. [mysql]"})
                        }
                      })
                    } else {
                      // Release connection back to pool.
                      connection.release();
                      reject({"Result":0, "Message":"Sorry, that password does not match our records."})
                    }
                  } else {
                    // Release connection back to pool.
                    connection.release();
                    console.log(err)
                    reject({"Result":0, "Message":"Sorry, something went wrong with the server. [hash]"})
                  }
                })
              } else {
                // Release connection back to pool.
                connection.release();
                reject({"Result":0, "Message":"Sorry, we can't find an account with that username?"})
              }
            })
          } else {
            console.log(err);
            reject({"Result":0, "Message":"Sorry, something went wrong with the server. [mysql]"})
          }
        })
      } else {
        reject({"Result":0, "Message":"Please ensure all data is pressent."})
      }
    });
  },

  Register: function(username, password, firstname, lastname) {
    return new Promise(function(resolve, reject) {
      // Ensure data is pressent.
      if(username, password, firstname, lastname) {
        pool.getConnection((err, connection) => {
          if(!err) {
            // Firstly, lets check that the username is available.
            connection.query("SELECT COUNT(id) Count FROM users WHERE username = ?", [username], (err, rows) => {
              if(!err) {
                if(rows[0].Count == 0) {
                  // Hash the password.
                  bcrypt.hash(password, 12, function(err, hash) {
                    if(!err) {
                      // insert user into database.
                      connection.query("INSERT INTO users (username, password, firstname, lastname) VALUES (?, ?, ?, ?)", [username, hash, firstname, lastname], (err, rows) => {
                        if(!err) {
                          // User has successfully been added to db.
                          connection.release()
                          resolve({"Result":1, "Message":"Your account has been created. Please login."})
                        } else {
                          connection.release()
                          console.log(err)
                          reject({"Result":0, "Message":"Sorry, something went wrong there. [mysql]"})
                        }
                      })
                    } else {
                      connection.release();
                      console.log(err)
                      reject({"Result":0, "Message":"Sorry, something went wrong there. [hash]"})
                    }
                  });
                } else {
                  // Already Exists.
                  connection.release();
                  reject({"Result":0, "Message":"Sorry, that username has been taken."})
                }
              } else {
                connection.release();
                console.log(err)
                reject({"Result":0, "Message":"Sorry, something went wrong there. [mysql]"})
              }
            })
           } else {
            connection.release();
            console.log(err)
            reject({"Result":0, "Message":"Sorry, something went wrong there. [mysql]"})
          }
        })
      } else {
        reject({"Result":0, "Message":"Please ensure all data is pressent."})
      }
    });
  },

  Info: function(id) {
    return new Promise(function(resolve, reject) {
      if(id) {
        pool.getConnection((err, connection) => {
          if(!err) {
            // run query to fetch user information based on users id. 
            connection.query("SELECT username,firstname,lastname,lastloggedin FROM users WHERE id = ? LIMIT 1", id, (err, rows) => {
              if(!err) {
                if(rows.length > 0) {
                  connection.release();
                  resolve({"Result":1, "Message":"Cookie valid, found information.", "Data":rows[0]})
                } else {
                  connection.release();
                  reject({"Result":0, "Message":"Unable to obtain user information."})
                }
              } else {
                connection.release();
                console.log(err)
                reject({"Result":0, "Message":"Sorry, something went wrong. [mysql]"})
              }
            })
          } else {
            connection.release();
            console.log(err)
            reject({"Result":0, "Message":"Sorry, something went wrong. [mysql]"})
          }
        })
      } else {
        reject({"Result":0, "Message":"Please ensure all data is pressent."})
      }
    });
  }
}


module.exports = thisclass;
