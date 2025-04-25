// tests/controllers/categoryController.test.js
const { PrismaClient } = require('@prisma/client');
jest.mock('@prisma/client');

describe('categoryController', () => {
  let getAllCategories,
      createCategory,
      getCategoryById,
      updateCategory,
      deleteCategory;
  let prisma, req, res;

  const mockFindMany   = jest.fn();
  const mockCreate     = jest.fn();
  const mockFindUnique = jest.fn();
  const mockUpdate     = jest.fn();
  const mockDelete     = jest.fn();

  beforeAll(() => {
    // Mockando o PrismaClient para usar nossos fakes
    prisma = {
      category: {
        findMany:   mockFindMany,
        create:     mockCreate,
        findUnique: mockFindUnique,
        update:     mockUpdate,
        delete:     mockDelete,
      }
    };
    PrismaClient.mockImplementation(() => prisma);

    // Importa os controllers após mockar o Prisma
    ({
      getAllCategories,
      createCategory,
      getCategoryById,
      updateCategory,
      deleteCategory
    } = require('../src/controllers/categoryController'));
  });

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn(),
      send:   jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('deve retornar lista de categorias com status 200', async () => {
      const fake = [{ id: 1, name: 'A' }];
      mockFindMany.mockResolvedValue(fake);

      await getAllCategories(req, res);

      expect(mockFindMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fake);
      // status padrão é 200, não chamamos res.status() antes de json(), 
      // por isso não esperamos uma chamada explícita a status(200)
    });

    it('deve retornar 500 em caso de erro', async () => {
      mockFindMany.mockRejectedValue(new Error('fail'));

      await getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao processar solicitação" });
    });
  });

  describe('createCategory', () => {
    it('deve criar categoria e retornar 201', async () => {
      const input = { name: 'Nova' };
      const created = { id: 2, name: 'Nova' };
      req.body = input;
      mockCreate.mockResolvedValue(created);

      await createCategory(req, res);

      expect(mockCreate).toHaveBeenCalledWith({ data: input });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.body = { name: 'X' };
      mockCreate.mockRejectedValue(new Error());

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao processar solicitação" });
    });
  });

  describe('getCategoryById', () => {
    it('deve retornar categoria existente', async () => {
      req.params.id = '5';
      const cat = { id: 5, name: 'X' };
      mockFindUnique.mockResolvedValue(cat);

      await getCategoryById(req, res);

      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(res.json).toHaveBeenCalledWith(cat);
    });

    it('deve retornar 404 se não encontrada', async () => {
      req.params.id = '99';
      mockFindUnique.mockResolvedValue(null);

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Categoria não encontrada" });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.id = '1';
      mockFindUnique.mockRejectedValue(new Error());

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao processar solicitação" });
    });
  });

  describe('updateCategory', () => {
    it('deve atualizar categoria e retornar objeto atualizado', async () => {
      req.params.id = '3';
      req.body = { name: 'Alterada' };
      const updated = { id: 3, name: 'Alterada' };
      mockUpdate.mockResolvedValue(updated);

      await updateCategory(req, res);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 3 },
        data:  { name: 'Alterada' }
      });
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('deve retornar 400 em caso de erro de validação/atualização', async () => {
      req.params.id = '3';
      req.body = { name: 'X' };
      mockUpdate.mockRejectedValue(new Error('oops'));

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Erro ao atualizar categoria" })
      );
    });
  });

  describe('deleteCategory', () => {
    it('deve deletar categoria e chamar res.send com status 204', async () => {
      req.params.id = '4';
      mockDelete.mockResolvedValue({});

      await deleteCategory(req, res);

      expect(mockDelete).toHaveBeenCalledWith({ where: { id: 4 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.id = '4';
      mockDelete.mockRejectedValue(new Error());

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao processar solicitação" });
    });
  });
});
