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
    .then(handle404)
    .then(blog => res.status(200).send(blog))
    .catch(err => handle(err, res));
});

router.patch("/blogs/:id", requireToken, (req, res) => {
  const updateBlog = {
    title: req.body.blog.title,
    logo: req.body.blog.logo,
    headerImage: req.body.blog.headerImage
  };
  fileUpload(updateBlog.headerImage)
    .then(data => {
      updateBlog.headerImage = data.Location;
      console.log(updateBlog.headerImage);
    })
    .then(
      fileUpload(updateBlog.logo).then(data => {
        updateBlog.logo = data.Location;
        console.log(updateBlog.logo);
      })
    )
    .then(() => {
      Blog.findByIdAndUpdate(
        req.params.id,
        updateBlog,
        { new: true },
        (err, todo) => {
          if (err) return res.status(500).send(err);
          return res.json(todo);
        }
      );
    })
    .catch(err => handle(err, res));
});

router.post("/blogs", requireToken, (req, res) => {
  req.body.blog.userID = req.user.id;
  fileUpload(req.body.blog.headerImage)
    .then(data => {
      req.body.blog.headerImage = data.Location;
    })
    .then(
      fileUpload(req.body.blog.logo).then(data => {
        req.body.blog.logo = data.Location;
        console.log(req.body.blog.logo);
      })
    )
    .then(data => {
      // req.body.blog.headerImage = data.Location;
      Blog.create(req.body.blog)
        .then(blog => {
          res.status(201).json(blog);
        })
        .catch(err => handle(err, res));
      console.log(data);
    })
    .catch(console.error);
});

router.delete("/blogs/:id", requireToken, (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send("Blog successfully deleted!!");
  });
});

module.exports = router;
