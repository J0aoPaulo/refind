const express = require('express');
const {PrismaClient} = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

//~
// Endpoint para listar todos os itens (GET /itens)
router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        user: true,
      },
    });

    return res.status(200).json(items);
  } catch (error) {
    console.error('Erro ao listar itens:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});
// Endpoint para criar um novo item (POST /itens)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      categoryId,
      date,
      location,
      contact,
      photo,
      status,
      code, 
      userId, 
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!name || !categoryId || !date || !location || !contact || !status || !code) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser fornecidos.' });
    }

    // Verificar se a categoria existe
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(400).json({ error: 'Categoria inválida.' });
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        categoryId: parseInt(categoryId),
        date: new Date(date),
        location,
        contact,
        photo,
        status,
        code,
        userId: userId || null,
      },
      include: {
        category: true,
        user: true,
      },
    });

    return res.status(201).json({ message: 'Item criado com sucesso', item: newItem });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});
//~

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