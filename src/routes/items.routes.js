const express = require('express');
const {PrismaClient} = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();


// Rota para atualizar item pelo codigo
router.put('/:code', async (req, res) => {
  try {
    const {code} = req.params;   
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
      return res.status(404).json({error: 'Item não encontrado'})
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
      message: 'Item atualizado com sucesso',
      item: updateItem
    });

  } catch (error){
    console.error('Error updating item:', error);
    return res.status(500).json({error: 'Erro ao processar solicitação'});
  }
});

router.delete('/:code', async (req, res) => {
  try {
    const {code} = req.params;

    const existingItem = await prisma.item.findUnique({
      where: {code}
    });

    if(!existingItem){
      return res.status(404).json({error: "Item não encontrado"})
    }

    await prisma.item.delete({
      where: {code}
    });

    return res.status(200).json({
      message: "Item removido com sucesso"
    });
    
  } catch (error) {
    console.error('Erro ao remover item:', error);
    return res.status(500).json({error: "Erro ao processar solicitação"})
  }
})

module.exports = router;