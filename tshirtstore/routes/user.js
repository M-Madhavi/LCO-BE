const express = require('express');
const router = express.Router();
const {signup, login, logout, forgotPassword, getLoggedInUser, changePassword} = require('../controllers/user.controller');
const { isLoggedIn } = require('../middlewares/user');


router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/userdashboard').get(isLoggedIn,getLoggedInUser);
router.route('/password/update').post(isLoggedIn,changePassword);






module.exports = router;