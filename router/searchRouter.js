const express = require("express");

const {
} = require("../controller/searchController");

const searchRouter = express.Router();
const upload = multer({ storage: storage, fileFilter: fileFilter});

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
