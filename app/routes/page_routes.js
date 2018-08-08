const express = require("express");
const handle = require("../../lib/error_handler");
const passport = require("passport");
const requireToken = passport.authenticate("bearer", { session: true });
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const fileUpload = require("../../lib/file-upload.js");

const Page = require("../models/page.js");

const router = express.Router();

router.get("/pages", requireToken, (req, res) => {
  Page.find()
    .then(pages => {
      res.status(200).json(pages);
    })
    .catch(err => handle(err, res));
});

router.get("/pages/:id", requireToken, (req, res) => {
  Page.findById(req.params.id)
    .then(handle404)
    .then(page => res.status(200).send(page))
    .catch(err => handle(err, res));
});

router.patch("/pages/:id", requireToken, (req, res) => {
  const updatePage = {
    photo: req.body.page.photo,
    description: req.body.page.description,
    title: req.body.page.title,
    blogID: req.body.page.blogID
  };
  if (updatePage.photo != "") {
    fileUpload(updatePage.photo)
      .then(data => {
        updatePage.photo = data.Location;
        console.log(updatePage.photo);
      })
      .then(() => {
        Page.findByIdAndUpdate(
          req.params.id,
          updatePage,
          { new: true },
          (err, todo) => {
            if (err) return res.status(500).send(err);
            return res.json(todo);
          }
        );
      })
      .catch(err => handle(err, res));
  } else {
    Page.findByIdAndUpdate(
      req.params.id,
      updatePage,
      { new: true },
      (err, todo) => {
        if (err) return res.status(500).send(err);
        return res.json(todo);
      }
    );
  }
});

router.post("/pages", requireToken, (req, res) => {
  const createPage = {
    photo: req.body.page.photo,
    description: req.body.page.description,
    title: req.body.page.title,
    blogID: req.body.page.blogID
  };

  if (createPage.photo != "") {
    fileUpload(createPage.photo)
      .then(data => {
        createPage.photo = data.Location;
      })
      .then(data => {
        Page.create(createPage)
          .then(page => {
            res.status(201).json(page);
          })
          .catch(err => handle(err, res));
      })
      .catch(console.error);
  } else {
    Page.create(createPage)
      .then(page => {
        console.log(data);
        res.status(201).json(page);
      })
      .catch(err => handle(err, res));
  }
});

router.delete("/pages/:id", requireToken, (req, res) => {
  Page.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send("Page successfully deleted!!");
  });
});

module.exports = router;
