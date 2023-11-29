const express = require('express');
const router = express.Router();

const {
    getAllResources,
    getUserResources,
    getResources,
    createResources,
    updateResources,
    deleteResources
} = require('../controllers/Resources');

router.route('/').post(createResources).get(getUserResources).get(getAllResources);
router.route('/:id').get(getResources).delete(deleteResources).patch(updateResources);

module.exports = router;