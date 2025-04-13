const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), categoryController.createCategory);
router.put('/:id', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), categoryController.updateCategory);
router.delete('/:id', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), categoryController.deleteCategory);

module.exports = router;
