const express = require('express');
const router = express.Router();
const middlewares = require('../src/middlewares');
const Blog = require('../models/blog_model');
const Comment = require('../models/comments_model');
const { body, validationResult } = require('validator');
const commentRouter = require('./comment_router');

// "api/blogs" return all blogs
router.get('/', async (req, res, next) => {
  console.log('in blog get function');
  Blog.find()
    .populate('author')
    .then(blogs => {
      if (blogs.length === 0) {
        return res.status(404).json({ error: 'No blogs' });
      }
      return res.json(blogs);
    })
    .catch(err => console.log(err));
});

// "api/blogs/new" show form to make new blogs
// router.get("/new", (req, res, next) => {
//   return res.send("show form to make new blogs");
// });

('api/blogs/:blog_id/edit');
router.get(':blog_id/edit', middlewares.ensureLoggedIn, (req, res, next) => {
  res.send('Show edit form for blogs');
});

// "api/blogs/blog_id" Show single blog
router.get('/:blog_id', (req, res, next) => {
  Blog.findById(req.params.blog_id)
    .then(blog => res.json(blog))
    .catch(err => {
      if (err.toString().includes('ObjectId failed')) {
        console.log(err);
        return res.status(400).json({ error: 'Invalid ObjectId' });
      }
      return res.sendStatus(500); //.json("error");
    });
});

// "api/blogs" Add blog to DB
router.post('/', middlewares.ensureLoggedIn, (req, res, next) => {
  const { title, content } = req.body;
  // Create a new Blog
  const newBlog = new Blog({
    author: req.user.id,
    title,
    content
  });

  // Save blog to DB
  newBlog
    .save()
    .then(blog => res.json(blog))
    .catch(err => {
      if (err.toString().includes('duplicate key')) {
        return res.status(409).json({ error: 'Title already saved in DB' });
      }
      return res.sendStatus(500); //.json("error");
    });
});

// "api/blogs/:blog_id" Update a blog, then redirect
router.put('/:blog_id', middlewares.ensureLoggedIn, async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.blog_id, req.body, {
      new: true
    }).exec();
    return res.json(blog);
  } catch (error) {
    return res.status(550).json({ error: 'Error updating database' });
  }
});

// "api/blogs" Delete a blog, then redirect
router.delete('/:blog_id', middlewares.ensureLoggedIn, (req, res, next) => {
  // Get any Comments linked to Blog and delete them first
  Comment.find({ blog: req.params.blog_id })
    .then(comments => {
      if (comments) {
        comments.forEach(comment => {
          comment.delete();
        });
      }
    })
    .catch(err => console.log(err));

  // Now Delete Blog from DB
  console.log(req.params.blog_id);
  Blog.findByIdAndDelete(req.params.blog_id)
    .then(blog => {
      if (blog) {
        return res.json(blog);
      } else {
        res.status(400).json({ error: 'No blog found by that ID' });
      }
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

router.use('/:blog_id/comments', commentRouter);

module.exports = router;
