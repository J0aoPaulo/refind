const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, authorizeRoles(['ADMIN','OWNER']), userController.getAllUsers);
router.post('/admin', verifyToken, authorizeRoles(['OWNER']), userController.createAdmin);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUserById);
router.delete('/:id', verifyToken, authorizeRoles(['ADMIN','OWNER']), userController.deleteUserById);

module.exports = router;