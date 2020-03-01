const express = require("express");
const blogRouter = require("./blog_router");
const userRouter = require("./user_router");
const router = express.Router();

router.use("/blogs", blogRouter);
router.use("/users", userRouter);

module.exports = router;
