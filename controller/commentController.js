const connection = require("../model/db");
const { v4: uuidv4 } = require("uuid"); 

// comment_id,user_who_commented,post_id,comment

/* CREATE TABLE comment_table(
	comment_id varchar(255),
    user_who_commented varchar(255),
    post_id varchar(255),
    comment varchar(255)
); */

function createComment(req, res) {
  //uid denotes user that commented,pid on which post,comment = what commented
  let { uid, pid, comment } = req.body;
  const comment_id = uuidv4();
  let sql = `INSERT INTO comment_table (comment_id,user_who_commented,post_id,comment) VALUES ("${comment_id}","${uid}","${pid}","${comment}")`;
  console.log(sql);
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        message: "Cannot create Comment!!!",
        error: error,
      });
    } else {
      res.json({
        message: "Comment created Successfully",
        data: data,
      });
    }
  });
}

function getCommentsByPostId(req, res) {
  let { pid } = req.params;
  let sql = `SELECT * FROM comment_table where post_id = "${pid}"`;
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        message: "Cannot get comments by the given Post Id!!!",
        error,
      });
    } else if (data.length == 0) {
      res.json({
        message: "No comment Found !!!",
      });
    } else {
      res.json({
        message: "Got comments Successfully!!",
        data: data,
      });
    }
  });
}

function getCommentByCommentId(req, res) {
  let { comment_id } = req.params;
  let sql = `SELECT * FROM comment_table where comment_id = "${comment_id}"`;
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        message: "Cannot get comment By given Comment Id",
        error,
      });
    } else if (data.length == 0) {
      res.json({
        message: "No comment Found!!!",
      });
    } else {
      res.json({
        message: "Comment found successfully!!!",
        data: data[0],
      });
    }
  });
}

function deleteCommentByCommentId(req, res) {
  let { comment_id } = req.params;
  //   let sql = `DELETE * FROM comment_table where comment_id = "${comment_id}"`;
  let sql = `DELETE FROM comment_table where comment_id = "${comment_id}"`;
  console.log(sql);
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        message: "Cannot delete comment",
        error,
      });
    } else {
      res.json({
        message: "Deleted Comment Successfully!!!",
        data,
      });
    }
  });
}

//as comment Id Unique no need of post id here
function updateCommentByCommentId(req, res) {
  let { comment_id } = req.params;
  //   let { comment, post_id } = req.body;
  let { comment } = req.body;
  //   let sql = `UPDATE comment_table SET comment="${comment}" WHERE comment_id="${comment_id}" AND post_id="${post_id}"`;
  let sql = `UPDATE comment_table SET comment="${comment}" WHERE comment_id="${comment_id}"`;
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        message: "Cannot update comment!!! Try Again later",
        error,
      });
    } else {
      res.json({
        message: "Comment Updated Successfully!!!",
        data: data,
      });
    }
  });
}

module.exports = {
  createComment: createComment,
  getCommentByCommentId: getCommentByCommentId,
  deleteCommentByCommentId: deleteCommentByCommentId,
  updateCommentByCommentId: updateCommentByCommentId,
  getCommentsByPostId: getCommentsByPostId,
};
