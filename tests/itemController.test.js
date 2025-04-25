// tests/controllers/itemController.test.js
const { PrismaClient } = require('@prisma/client');
jest.mock('@prisma/client');
jest.mock('../src/utils/codeGenerator.js', () => ({
  generateUniqueCode: jest.fn().mockReturnValue('CODE123')
}));

describe('itemController', () => {
  let getItems,
      createItem,
      updateItem,
      deleteItem;
  let prisma, req, res;

  const mFindMany   = jest.fn();
  const mFindUnique = jest.fn();
  const mCreate     = jest.fn();
  const mUpdate     = jest.fn();
  const mDelete     = jest.fn();
  const mFindCat    = jest.fn();

  beforeAll(() => {
    // Mock PrismaClient to use our fakes
    prisma = {
      item: {
        findMany:   mFindMany,
        findUnique: mFindUnique,
        create:     mCreate,
        update:     mUpdate,
        delete:     mDelete,
      },
      category: {
        findUnique: mFindCat,
      }
    };
    PrismaClient.mockImplementation(() => prisma);

    // Import controller after mocking PrismaClient
    ({
      getItems,
      createItem,
      updateItem,
      deleteItem
    } = require('../src/controllers/itemsController'));
  });

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getItems', () => {
    it('deve retornar lista filtrada com sucesso 200', async () => {
      const items = [{ name: 'X' }];
      mFindMany.mockResolvedValue(items);
      req.query = { status: 'perdido', location: 'Rio', name: 'A' };

      await getItems(req, res);

      expect(mFindMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          status: 'LOST',
          location: expect.any(Object),
          name: expect.any(Object),
        })
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        count: 1,
        data: items
      }));
    });

    it('deve retornar 500 em caso de erro', async () => {
      mFindMany.mockRejectedValue(new Error());
      await getItems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Error ao processar solicitação' });
    });
  });

  describe('createItem', () => {
    beforeEach(() => {
      req.body = {
        name: 'I',
        categoryId: '1',
        date: '2025-04-24',
        location: 'L',
        contact: 'C',
        status: 'FOUND',
      };
    });

    it('deve retornar 400 se faltar campo obrigatório', async () => {
      req.body = {}; // vazio
      await createItem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Todos os campos obrigatórios devem ser fornecidos.' });
    });

    it('deve retornar 400 se categoria inválida', async () => {
      mFindCat.mockResolvedValue(null);
      await createItem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria inválida.' });
    });

    it('deve criar item sem code no body e retornar 201', async () => {
      mFindCat.mockResolvedValue({ id: 1 });
      const newItem = { code: 'CODE123', name: 'I' };
      mCreate.mockResolvedValue(newItem);

      await createItem(req, res);

      expect(mCreate).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ code: 'CODE123' })
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item criado com sucesso', item: newItem });
    });
  });

  describe('updateItem', () => {
    it('deve retornar 404 se item não existir', async () => {
      req.params.code = 'C1';
      mFindUnique.mockResolvedValue(null);

      await updateItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });

    it('deve atualizar item existente e retornar 200', async () => {
      req.params.code = 'C2';
      req.body = { name: 'Novo' };
      const existing = {
        code: 'C2', name: 'Old', date: new Date(),
        location: 'L', contact: 'C', status: 'FOUND', photo: null
      };
      mFindUnique.mockResolvedValue(existing);
      const updated = { code: 'C2', name: 'Novo' };
      mUpdate.mockResolvedValue(updated);

      await updateItem(req, res);

      expect(mUpdate).toHaveBeenCalledWith(expect.objectContaining({
        where: { code: 'C2' },
        data: expect.objectContaining({ name: 'Novo' })
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Item atualizado com sucesso',
        item: updated
      });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      req.params.code = 'C3';
      mFindUnique.mockResolvedValue({}); 
      mUpdate.mockRejectedValue(new Error());
      
      await updateItem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Erro ao processar solicitação' });
    });
  });

  describe('deleteItem', () => {
    it('deve retornar 404 se não existir', async () => {
      req.params.code = 'C4';
      mFindUnique.mockResolvedValue(null);

      await deleteItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });

    it('deve remover item existente e retornar 200', async () => {
      req.params.code = 'C5';
      mFindUnique.mockResolvedValue({ code: 'C5' });
      mDelete.mockResolvedValue({});

      await deleteItem(req, res);

      expect(mDelete).toHaveBeenCalledWith({ where: { code: 'C5' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item removido com sucesso' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      req.params.code = 'C6';
      mFindUnique.mockResolvedValue({ code: 'C6' });
      mDelete.mockRejectedValue(new Error());

      await deleteItem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Erro ao processar solicitação' });
    });
  });
});
