var express = require('express');
var router = express.Router();
const indexController = require('../controllers/item');
const categoryController = require('../controllers/category');
const cartController = require('../controllers/cart');
const orderController = require('../controllers/order');
const setupController = require('../controllers/setup');
const searchController = require('../controllers/search');
const auth = require('../middleware/auth');
const authController = require('../controllers/auth');

/* GET home page. */
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//item
router.get('/items', indexController.viewItems);
router.post('/item', auth.authenticateToken, auth.isAdmin, indexController.insertItem);
router.put('/item/:id', auth.authenticateToken, auth.isAdmin, indexController.editItem);
router.delete('/item/:id', auth.authenticateToken, auth.isAdmin, indexController.deleteItem);

//category
router.get('/category', categoryController.viewCategory);
router.post('/category', auth.authenticateToken, auth.isAdmin, categoryController.insertCategory);
router.put('/category/:id', auth.authenticateToken, auth.isAdmin, categoryController.editCategory);
router.delete('/category/:id', auth.authenticateToken, auth.isAdmin, categoryController.deleteCategory);

//cart
router.get('/cart', auth.authenticateToken, auth.isRegistered, cartController.viewCart);
router.get('/allcarts', auth.authenticateToken, auth.isAdmin, cartController.viewAllCart);
router.post('/cart_item',auth.authenticateToken, auth.isRegistered, cartController.insertCart);
router.put('/cart_item/:id', auth.authenticateToken, auth.isRegistered, cartController.editCart);
router.delete('/cart_item/:id', auth.authenticateToken, auth.isRegistered, cartController.deleteCartItem);
router.delete('/cart/:id', auth.authenticateToken, auth.isRegistered, cartController.deleteCart);

//order
router.get('/orders', auth.authenticateToken, auth.isRegistered, orderController.viewOrder);
router.get('/allorders', auth.authenticateToken, auth.isAdmin, orderController.viewAllOrders);
router.post('/order/:id',auth.authenticateToken, auth.isRegistered, orderController.insertOrder);
router.put('/order/:id', auth.authenticateToken, auth.isAdmin, orderController.editOrder);
// router.delete('/cart_item/:id', auth.authenticateToken, auth.isRegistered, cartController.deleteCartItem);
// router.delete('/cart/:id', auth.authenticateToken, auth.isRegistered, cartController.deleteCart);

router.post('/setup', setupController.setup);
router.post('/search', searchController.search);

module.exports = router;
