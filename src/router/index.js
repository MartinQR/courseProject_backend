const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const formRoutes = require('./form.routes');
const formResponseRoutes = require('./formResponse.routes');
const topicRoutes = require('./topic.routes');
const tagRoutes = require('./tag.routes.js');

router.use('/user', userRoutes);

router.use('/form', formRoutes);

router.use('/formResponse', formResponseRoutes);

router.use('/topic', topicRoutes);

router.use('/tag', tagRoutes);

module.exports = router;