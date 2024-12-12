const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const formRoutes = require('./form.routes');
const topicRoutes = require('./topic.routes');

router.use('/user', userRoutes);

router.use('/form', formRoutes);

router.use('/topic', topicRoutes);

module.exports = router;