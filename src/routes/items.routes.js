const express = require('express');
const {PrismaClient} = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Rota para atualizar item pelo codigo
router.put('/:code', async (req, res) => {
  console.log('Iniciando atualizacao para codigo:', req.params.code)
  try {
    const {code} = req.params;
    console.log('Procurando item com código:', code);
    
    const {
      name, 
      date, 
      location, 
      contact,
      status,
      categoryId,
      photo
    } = req.body;

    const existingItem = await prisma.item.findUnique({
      where: {code}
    });
    if(!existingItem) {
      return res.status(404).json({error: 'item not found'})
    }

    const updateItem = await prisma.item.update({
      where: {code},
      data: {
        name, 
        date: date ? new Date(date) : undefined,
        location,
        contact,
        status: status,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        photo
      },
      include: {category: true}
    });
    return res.status(200).json({
      message: 'Item updated successfully',
      item: updateItem
    });

  } catch (error){
    console.error('Error updating item:', error);
    return res.status(500).json({error: 'Error processing request'});
  }
});

module.exports = router;