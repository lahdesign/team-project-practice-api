const express = require("express");
const handle = require("../../lib/error_handler");
const passport = require("passport");
const requireToken = passport.authenticate("bearer", { session: true });
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const fileUpload = require("../../lib/file-upload.js");

const Blog = require("../models/blog");

const router = express.Router();

router.get("/blogs", requireToken, (req, res) => {
  Blog.find()
    .then(blogs => {
      res.status(200).json(blogs);
    })
    .catch(err => handle(err, res));
});

router.get("/blogs/:id", requireToken, (req, res) => {
  Blog.findById(req.params.id)
    .then(blog => res.status(200).send(blog))
    .catch(err => handle(err, res));
});
// db.books.updateMany({}, { $set: { owner: req.user._id } });

router.patch("/blogs/:id", requireToken, (req, res) => {
  const updateBlog = {
    blog: {
      title: req.body.blog.title,
      logo: req.body.blog.logo,
      headerImage: req.body.blog.headerImage
    }
  };

  fileUpload(updateBlog.blog.headerImage)
    .then(data => {
      updateBlog.blog.headerImage = data.Location;
      Blog.findByIdAndUpdate(req.params.id)
        .then(handle404)
        .then(blog => {
          requireOwnership(updateBlog, blog);
          blog.update(updateBlog.blog);
        })
        .catch(err => handle(err, res));
    })
    .catch(console.error);
});

router.post("/blogs", requireToken, (req, res) => {
  req.body.blog.userID = req.user.id;
  fileUpload(req.body.blog.headerImage)
    .then(data => {
      req.body.blog.headerImage = data.Location;
      console.log(req.body.blog);
      Blog.create(req.body.blog)
        .then(blog => {
          res.status(201).json(blog);
        })
        .catch(err => handle(err, res));
      console.log(data.Location);
    })
    .catch(console.error);
});

router.delete("/blogs/:id", requireToken, (req, res) => {
  Blog.findByIdAndRemove(req.params.id)
    .then(handle404)
    .then(blog => {
      requireOwnership(req, blog);
      blog.remove();
      const blogs = Blog.find();
      res.status(200).json(blogs);
    })
    .then(() => res.status(204))
    .catch(err => handle(err, res));
});

module.exports = router;
