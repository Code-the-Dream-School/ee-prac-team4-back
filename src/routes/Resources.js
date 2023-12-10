const express = require('express');
const router = express.Router();

const {
    getUserResources,
    getResources,
    createResources,
    updateResources,
    deleteResources
} = require('../controllers/Resources');

router.route('/').post(createResources).get(getUserResources);
router.route('/:id').get(getResources).delete(deleteResources).patch(updateResources);

module.exports = router;