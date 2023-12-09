const express = require('express');
const router = express.Router();

const { getAllResources } = require('../controllers/Resources');

router.route('/').get(getAllResources);

module.exports = router;