const mysql = require("mysql");

var thisclass = {
  Connect: function()
  {
    //create a mysql connection pool.
    const pool = mysql.createPool({
      connectionLimit: 10,
      host     : "localhost",
      user     : "root",
      password : "",
      database : "micron",
      port : "3306"
    });

    return pool;
  }
}



module.exports = thisclass;
