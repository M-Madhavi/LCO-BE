const express = require('express');
const router = express.Router();
const {signup, login, logout, forgotPassword, getLoggedInUser, changePassword, updateUserDetails, adminAllUser,managerAllUser, adminGetUser,adminUpdateOneUserDetails, adminDeleteUser} = require('../controllers/user.controller');
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
// router.route('/admin/user/:id').get(isLoggedIn,customRole('admin'),adminGetUser);
// router.route('/admin/user/:id').put(isLoggedIn,customRole('admin'),adminUpdateOneUserDetails);
router.route('/admin/user/:id')
.get(isLoggedIn,customRole('admin'),adminGetUser)
.put(isLoggedIn,customRole('admin'),adminUpdateOneUserDetails)
.delete(isLoggedIn,customRole('admin'),adminDeleteUser)

//manager only route
router.route('/manager/user').get(isLoggedIn,customRole('manager'),managerAllUser);









module.exports = router;