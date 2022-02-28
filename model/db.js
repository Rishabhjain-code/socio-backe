const mysql = require("mysql");

const connection = mysql.createPool({
  connectionLimit: 200,
  host: "bmhg2rk7itmkvcxwlqzu-mysql.services.clever-cloud.com",
  user: "uassuzcbfxx2ownf",
  password: "DjuhPIUDkyP86Bcxxac6",
  database: "bmhg2rk7itmkvcxwlqzu",
});

connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

module.exports = connection;
