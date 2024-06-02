const express = require('express');
const router = express.Router();
const {addProduct,getAllProducts}  = require('../controllers/productController')
const { isLoggedIn, customRole } = require('../middlewares/user');

//Admin routes
router.route('/admin/product/add').post(isLoggedIn,customRole('admin'),addProduct);

//user routes
router.route('/admin/product/allproducts').get(getAllProducts);


module.exports = router