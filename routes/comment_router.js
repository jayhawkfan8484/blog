const express = require("express");
const router = express.Router({ mergeParams: true });
const { body, validationResult } = require("express-validator");
const commentRouter = require("./comment_router");
const Comment = require("../models/comments_model");
const Blog = require("../models/blog_model");
const middlewares = require("../src/middlewares");

// "api/blogs/:blog_id/comments" return all comments from a blog
router.get("/", (req, res, next) => {
  console.log(req.params.blog_id);
  Comment.find({ blog: req.params.blog_id })
    .then(comments => {
      if (comments.length > 0) {
        return res.json(comments);
      } else {
        return res.status(404).json({ error: "No comments with that blog ID" });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// "api/blogs/:blog_id/comments/new" show form to make new comments for a blog
// router.get("/new", (req, res, next) => {
//   return res.send("show form to make new comments for a blog");
// });

// "api/blogs/:blog_id/comments/:comment_id/edit"
// Show edit form for comments
// router.get(":comment_id/edit", (req, res, next) => {
//   res.send("Show edit form for comments");
// });

// "api/blogs/:blog_id/comments/id" Show single comment
router.get("/:comment_id", (req, res, next) => {
  Comment.findById(req.params.comment_id)
    .then(comment => {
      if (comment) {
        return res.json(comment);
      } else {
        return res.status(400).json({ error: "No comment found by that ID" });
      }
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

// "api/blogs/:blog_id/comments" Add comment to DB, then redirect
router.post(
  "/",
  [
    body("author", "author must be between 3 and 30 characters")
      .trim()
      .isLength({ min: 3 })
      .isLength({ max: 30 }),
    body("content", "content must be between 3 and 750 characters")
      .trim()
      .isLength({ min: 3 })
      .isLength({ max: 750 })
  ],
  (req, res, next) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      // There are validation errors, send them to client
      const msgs = errors.map(error => {
        return { error: error.msg };
      });
      return res.status(400).json(msgs);
    }

    const newComment = new Comment({
      author: req.body.author,
      content: req.body.content,
      blog: req.params.blog_id
    });

    newComment
      .save()
      .then(comment => res.json(comment))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  }
);

// "api/blogs/:blog_id/comments/:comment_id" Update a comment, then redirect
// router.put("/:comment_id", middlewares.ensureLoggedIn, (req, res, next) => {
//   res.send("update a comment, then redirect");
// });

// "api/blogs/:blog_id/comments" Delete a comment, then redirect
router.delete("/:comment_id", middlewares.ensureLoggedIn, (req, res, next) => {
  Comment.findByIdAndDelete(req.params.comment_id)
    .then(comment => {
      if (comment) {
        return res.json(comment);
      } else {
        res.status(400).json({ error: "No comment found by that ID" });
      }
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

module.exports = router;
