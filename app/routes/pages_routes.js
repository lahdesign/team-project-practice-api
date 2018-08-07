const express = require("express");
const handle = require("../../lib/error_handler");
const passport = require("passport");
const requireToken = passport.authenticate("bearer", { session: true });
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const fileUpload = require("../../lib/file-upload.js");

const Page = require("../models/pag");

const router = express.Router();

router.get("/Pages", requireToken, (req, res) => {
  Page.find()
    .then(pages => {
      res.status(200).json(pages);
    })
    .catch(err => handle(err, res));
});

router.get("/pages/:id", requireToken, (req, res) => {
  Page.findById(req.params.id)
    .then(page => res.status(200).send(blog))
    .catch(err => handle(err, res));
});
// db.books.updateMany({}, { $set: { owner: req.user._id } });

router.patch("/pages/:id", requireToken, (req, res) => {
  console.log(req.params.id);
  fileUpload(req.body.page.headerImage)
    .then(data => {
      req.body.page.headerImage = data.Location;
      Page.findByIdAndUpdate(req.params.id)
        .then(handle404)
        .then(page => {
          requireOwnership(req, blog);
          page.update(req.page.blog);
          const editedBlog = Page.find();
          res.status(200).json(editedPage);
        })
        .catch(err => handle(err, res));
    })
    .catch(console.error);
});

router.post("/pages", requireToken, (req, res) => {
  req.body.page.userID = req.user.id;
  fileUpload(req.body.page.headerImage)
    .then(data => {
      req.body.page.headerImage = data.Location;
      Page.create(req.body.page)
        .then(page => {
          res.status(201).json(page);
        })
        .catch(err => handle(err, res));
      console.log(data);
    })
    .catch(console.error);
});

router.delete("/pages/:id", requireToken, (req, res) => {
  Page.findByIdAndRemove(req.params.id)
    .then(handle404)
    .then(page => {
      requireOwnership(req, page);
      page.remove();
      const pages = Page.find();
      res.status(200).json(pages);
    })
    .then(() => res.status(204))
    .catch(err => handle(err, res));
});

module.exports = router;
