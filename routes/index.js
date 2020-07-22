const express = require('express');
const router = express.Router();

const users = require('./users');
const foods = require('./foods');
const diets = require('./diets');

router.use('/users', users);
router.use('/foods', foods);
router.use('/diets', diets);


module.exports = router; 