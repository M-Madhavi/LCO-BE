const express = require('express');
const router = express.Router();
const {signup, login, logout, forgotPassword, getLoggedInUser, changePassword, updateUserDetails, adminAllUser} = require('../controllers/user.controller');
const { isLoggedIn, customRole } = require('../middlewares/user');


router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/userdashboard').get(isLoggedIn,getLoggedInUser);
router.route('/password/update').post(isLoggedIn,changePassword);
router.route('/userdashboard/update').post(isLoggedIn,updateUserDetails);



//adminRoutes
router.route('/admin/user').get(isLoggedIn,customRole('admin'),adminAllUser);








module.exports = router;