/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Endpoints de itens
 */

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemsController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retorna todos os itens
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Lista de itens
 */
router.get('/', itemController.getItems);

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Cria um novo item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), itemController.createItem);

/**
 * @swagger
 * /items/{code}:
 *   put:
 *     summary: Atualiza um item existente
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Código do item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       404:
 *         description: Item não encontrado
 */
router.put('/:code', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), itemController.updateItem);

/**
 * @swagger
 * /items/{code}:
 *   delete:
 *     summary: Deleta um item existente
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Código do item
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *       404:
 *         description: Item não encontrado
 */
router.delete('/:code', verifyToken, authorizeRoles(['ADMIN', 'OWNER']), itemController.deleteItem);

module.exports = router;
