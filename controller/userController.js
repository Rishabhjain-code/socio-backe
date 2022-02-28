const connection = require("../model/db");
const { v4: uuidv4 } = require("uuid");

// promise based when promise k baad some work based on that data hence await/then needed,
// without promise when no further action based on the returned obj by sql

// showing fine but no change on sql table

// DEBUGGING FUNCTIONS
function removeUniqueKey(req, res) {
  const sql = `ALTER TABLE user_table DROP CONSTRAINT Unique_user_table`;
  console.log("Inside remove constraint ", sql);
  connection.query(sql, (error, data) => {
    if (error) {
      res.json({
        message: "Failed to remove constraint to handle,email",
        error,
      });
    } else {
      res.status(200).json({
        message: "Successfully removeed constraint to handle,email",
        data,
      });
    }
  });
}

// DEBUGGING FUNCTIONS
function addUniqueKey(req, res) {
  const sql = `ALTER TABLE user_table ADD CONSTRAINT Unique_user_table UNIQUE (handle,email)`;
  console.log("Inside add constraint ", sql);
  connection.query(sql, (error, data) => {
    if (error) {
      res.json({
        message: "Failed to add constraint to handle,email",
        error,
      });
    } else {
      res.status(200).json({
        message: "Successfully added constraint to handle,email",
        data,
      });
    }
  });
}

function getAllUsers(req, res) {
  const sql = `SELECT * FROM user_table`;
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        message: "Failed To get all users",
        error,
      });
    } else {
      res.status(200).json({
        message: "got all users !!",
        data,
      });
    }
  });
}

function getUserByIdPromisified(uid) {
  return new Promise(function (resolve, reject) {
    const sql = `SELECT * FROM user_table WHERE uid = '${uid}' `;
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

async function getUserById(req, res) {
  try {
    const uid = req.params.uid;
    // console.log(uid);
    let data = await getUserByIdPromisified(uid);
    if (data.length) {
      res.status(200).json({
        message: "Got user by id",
        data: data[0],
      });
    } else {
      res.status(200).json({
        message: "No User FOUND !!!",
      });
    }
  } catch (error) {
    res.json({
      message: "Failed to get User !",
      error,
    });
  }
}

// working from body=>raw in req
// not from body=>form-data in req
function updateUserById(req, res) {
  console.log(req.body);
  const uid = req.params.uid;
  const updateObject = req.body;
  // console.log(updateObject);
  let sql = `UPDATE user_table SET `;
  for (key in updateObject) {
    sql += `${key} = '${updateObject[key]}',`;
  }
  // sql = sql.substring(0, sql.length - 1);
  if (req.file) {
    let pImage = (req.file.destination + "/" + req.file.filename).substr(7);
    sql += `pImage = "${pImage}"`;
  } else {
    sql = sql.substring(0, sql.length - 1);
  }
  sql += ` WHERE uid = '${uid}'`;
  connection.query(sql, function (error, data) {
    if (error) {
      console.log(error);
      res.json({
        message: "Failed to update",
        error,
      });
    } else {
      res.status(201).json({
        message: "updated user !!",
        data,
      });
    }
  });
}

function deleteUserById(req, res) {
  const uid = req.params.uid;
  const sql = `DELETE FROM user_table WHERE uid='${uid}' `;
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        error,
      });
    } else {
      if (data.affectedRows) {
        res.status(201).json({
          message: "Deleted user !!",
          data,
        });
      } else {
        res.json({
          message: "No user Found !",
        });
      }
    }
  });
}

function createUserPromisified(userObject) {
  return new Promise(function (resolve, reject) {
    const {
      uid,
      name,
      username,
      email,
      bio,
      phone,
      password,
      is_verifed,
      pImage,
      isPrivate
    } = userObject;

    let sql;
    if (isPrivate) {
      let defaultPImage = "images/user/default.jpeg";
      sql = `INSERT INTO user_table(uid , name ,handle, email , bio ,phone, is_public ,is_verified, pImage, password) VALUES ( '${uid}' , '${name}' ,'${username}', '${email}' , '${bio}' , '${phone}',${!isPrivate} ,'${is_verifed ? is_verifed : 0
        }','${pImage ? pImage : defaultPImage}','${password}')`;
    } else {
      sql = `INSERT INTO user_table(uid , name , handle,email , bio ,phone,is_verified,pImage,password) VALUES ( '${uid}' , '${name}' ,'${username}' , '${email}' , '${bio}','${phone}','${is_verifed ? is_verifed : 0
        }' ,'${pImage ? pImage : "images/user/default.jpeg"}','${password}')`;
    }
    console.log(sql);
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

async function createUser(req, res) {
  try {
    const uid = uuidv4();
    const { name, username, email, bio, phone, is_verifed, password,isPrivate } = req.body;
    let userObject = {
      uid,
      name,
      username,
      email,
      bio,
      phone,
      is_verifed,
      password,
      isPrivate
    };

    if (req.file) {
      let pImage = (req.file.destination + "/" + req.file.filename).substr(7);
      userObject.pImage = pImage;
    }
    let data = await createUserPromisified(userObject);
    res.status(200).json({
      message: "User Created Succssfully !!!",
      data,
    });
  } catch (error) {
    res.json({
      message: "Failed to create a user !",
      error,
    });
  }
}

module.exports.getAllUsers = getAllUsers;
module.exports.getUserById = getUserById;
module.exports.updateUserById = updateUserById;
module.exports.deleteUserById = deleteUserById;
module.exports.createUser = createUser;
module.exports.addUniqueKey = addUniqueKey;
module.exports.getUserByIdPromisified = getUserByIdPromisified;
module.exports.removeUniqueKey = removeUniqueKey;
