const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemsController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', itemController.getItems);
router.post('/', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), itemController.createItem);
router.put('/:code', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), itemController.updateItem);
router.delete('/:code', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), itemController.deleteItem); 

module.exports = router;