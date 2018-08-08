const express = require('express')
const passport = require('passport')
const Post = require('../models/post.js')
const handle = require('../../lib/error_handler')

const custormErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

router.get('/posts', requireToken, (req, res) => {
    Post.find()
    .then(posts => {
        return posts.map(post => post.toObject())
    })
    .then(posts => res.status(200).json({posts: posts}))
    .catch(err => handle(err, res))
})

