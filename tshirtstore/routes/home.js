const express = require('express');
const router = express.Router();

const {home,homeDummy} = require('../controllers/homeController')
//go through express docs router.use()
router.route('/').get(home);
router.route('/dummy').get(homeDummy);






module.exports = router;