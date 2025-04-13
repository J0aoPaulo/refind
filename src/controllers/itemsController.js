const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const { generateUniqueCode } = require('../utils/codeGenerator')

const getItems = async (req, res) => {
  try {
    const {categoryId, location, status, name} = req.query;
    const where = {};

    if(categoryId) where.categoryId = parseInt(categoryId);
    if(location) where.location = {contains: location, mode: 'insensitive'}
    if(status) {
      const statusMap = {
        'perdido': 'LOST',
        'encontrado': 'FOUND'
      }
      where.status = statusMap[status.toLocaleLowerCase()];
    }
   
    if(name) where.name = {contains: name, mode: 'insensitive'}

    const items = await prisma.item.findMany({
      where,
      include: {
        category: true,
        user: false,
      },
      orderBy: {date: 'desc'}
    });
      return res.status(200).json({
        success: true,
        message: items.length > 0 ? `${items.length} item(ns) encontrado(s)` : `Nenhum item encontrado com os dados informados`,
        count: items.length,
        data: items
      });

  } catch (error) {
    console.error('Erro ao filtrar itens:', error);
    return res.status(500).json({success: false, error: 'Error ao processar solicitação'})
  }
};

const createItem = async (req, res) => {
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

    if (!name || !categoryId || !date || !location || !contact || !status) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser fornecidos.' });
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(400).json({ error: 'Categoria inválida.' });
    }

    const itemCode = code || generateUniqueCode();

    const newItem = await prisma.item.create({
      data: {
        name,
        categoryId: parseInt(categoryId),
        date: new Date(date),
        location,
        contact,
        photo,
        status,
        code : ite,
        userId: userId || null,
      },
      include: {
        category: true,
        user: false,
      },
    });

    return res.status(201).json({ message: 'Item criado com sucesso', item: newItem });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};

const updateItem = async (req, res) => {
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

    const updateData = {
      name: name || existingItem.name,
      date: date ? new Date(date) : existingItem.date,
      location: location || existingItem.location,
      contact: contact || existingItem.contact,
      status: status || existingItem.status,
      photo: photo !== undefined ? photo : existingItem.photo,
    };

    if(categoryId) {
      updateData.categoryId = parseInt(categoryId);
    }

    const updateItem = await prisma.item.update({
      where: {code},
      data: updateData,
      include: {category: true, user: true}
    });

    return res.status(200).json({
      message: 'Item atualizado com sucesso',
      item: updateItem
    });

  } catch (error){
    console.error('Error updating item:', error);
    return res.status(500).json({success: false, error: 'Erro ao processar solicitação'});
  }
};

const deleteItem = async (req, res) => {
  try {
    const {code} = req.params;

    const existingItem = await prisma.item.findUnique({
      where: {code}
    });

    if(!existingItem){
      return res.status(404).json({error: "Item não encontrado"})
    }

    await prisma.item.delete({where: {code}});

    return res.status(200).json({
      message: "Item removido com sucesso"
    });
    
  } catch (error) {
    console.error('Erro ao remover item:', error);
    return res.status(500).json({success: false, error: "Erro ao processar solicitação"})
  }
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem
};
