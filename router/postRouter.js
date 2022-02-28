const express = require("express");
const {
  getAllPosts,
  createPost,
  getPostById,
  deletePostById,
  updatePostById,
  updatePostCaption,
} = require("../controller/postController.js");
const postRouter = express.Router();
const path = require("path");
const multer = require("multer");

// create => json data , image

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/posts");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// only accept mimetype == image
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

postRouter.route("").get(getAllPosts).post(upload.single("post"), createPost);

postRouter.route("/update/:pid").patch(updatePostCaption);

postRouter.route("/:uid").get(getPostById);
postRouter.route("/:pid").delete(deletePostById).patch(updatePostById);

module.exports = postRouter;
