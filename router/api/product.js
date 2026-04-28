const express = require('express');
const {
  createCategory,
  getCategories,
} = require('../../controllers/categoryController');
const upload = require('../../helpers/multer');
const RoleCheck = require('../../middleware/roleMiddleware');
const authMiddleware = require('../../middleware/authMiddleware');
const {
  createProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
} = require('../../controllers/productController');
const { addtocart, updateCartItem, deleteCartItem, getCart } = require('../../controllers/cartControllers');
const router = express.Router();
// category routes
router.post('/createcategory', upload.single('category'), createCategory);
// router.post("/createcategory", authMiddleware, RoleCheck(["admin"]), upload.single('category'), createCategory)
router.get('/categories', getCategories);
// Product routes
router.post(
  '/create',
  upload.fields([
    { name: 'mainImg', maxCount: 1 },
    { name: 'images', maxCount: 8 },
  ]),
  createProduct,
);
router.post(
  '/update/:slug',
  upload.fields([
    { name: 'mainImg', maxCount: 1 },
    { name: 'images', maxCount: 8 },
  ]),
  updateProduct,
);
// product/productlist?page=1&limit=10&search=premium&status=pending&category=mans
router.get('/productlist', getAllProducts);
router.delete(
  '/deleteproduct/:productID',
  authMiddleware,
  RoleCheck(['admin']),
  deleteProduct,
);

// Cart Routes

router.post('/addtocart', authMiddleware, addtocart);
router.put('/updatecart', authMiddleware, updateCartItem);
router.delete('/deletecartitem/:productId', authMiddleware, deleteCartItem);
router.get('/getcart', authMiddleware, getCart);

module.exports = router;
