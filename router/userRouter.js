const express = require("express");
const {
  getAllUsers,
  createUser,
  getUserById,
  deleteUserById,
  updateUserById,
  addUniqueKey,
  removeUniqueKey
} = require("../controller/userController");

const userRouter = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/user");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

userRouter.route("/").get(getAllUsers).post(upload.single("user"), createUser);

// dummy/test requests
userRouter.route("/add-constraint").patch(addUniqueKey);

// dummy/test requests
userRouter.route("/remove-constraint").delete(removeUniqueKey);

/* ADD BEFORE BELOW LINE OTHERWISE JO BHI CAME AHEAD / IT WILL TAKE AS UID AND WILL CALL updateUserById ON PATCH */

userRouter
  .route("/:uid")
  .get(getUserById)
  .delete(deleteUserById)
  .patch(upload.single("user"), updateUserById);

module.exports = userRouter;
