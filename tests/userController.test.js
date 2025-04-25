// tests/userController.test.js
jest.mock('@prisma/client');
jest.mock('bcrypt');

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

describe('User Controller', () => {
  let prisma;
  let createAdmin, getAllUsers, getUserById, updateUserById, deleteUserById;
  let req, res;

  beforeAll(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      }
    };
    PrismaClient.mockImplementation(() => prisma);

    ({
      createAdmin,
      getAllUsers,
      getUserById,
      updateUserById,
      deleteUserById
    } = require('../src/controllers/userController'));
  });

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    jest.clearAllMocks();
  });

  describe('createAdmin', () => {
    it('cria admin sem senha', async () => {
      req.body = { name:'A', phone:'1', email:'a@a.com' };
      prisma.user.create.mockResolvedValue({ id:'1' });
      await createAdmin(req, res);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id:'1' });
    });

    it('hash de senha quando fornecida', async () => {
      req.body = { name:'A', phone:'1', email:'a@a.com', password:'p' };
      bcrypt.hash.mockResolvedValue('h');
      prisma.user.create.mockResolvedValue({ id:'1' });
      await createAdmin(req, res);
      expect(bcrypt.hash).toHaveBeenCalledWith('p', expect.any(Number));
      expect(res.json).toHaveBeenCalledWith({ id:'1' });
    });

    it('trata erro com 400', async () => {
      req.body = { name:'A', phone:'1', email:'a@a.com' };
      prisma.user.create.mockRejectedValue(new Error('fail'));
      await createAdmin(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error:"Erro ao criar usuário", details:'fail' });
    });
  });

  describe('getAllUsers', () => {
    it('retorna todos usuários', async () => {
      prisma.user.findMany.mockResolvedValue([{ id:'1' }]);
      await getAllUsers(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id:'1' }]);
    });

    it('trata erro com 500', async () => {
      prisma.user.findMany.mockRejectedValue(new Error());
      await getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error:"Erro ao processar solicitação" });
    });
  });

  describe('getUserById', () => {
    it('200 se achar', async () => {
      req.params.id = '1';
      prisma.user.findUnique.mockResolvedValue({ id:'1' });
      await getUserById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id:'1' });
    });

    it('404 se não achar', async () => {
      req.params.id = '1';
      prisma.user.findUnique.mockResolvedValue(null);
      await getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error:"Usuário não encontrado" });
    });

    it('trata erro com 500', async () => {
      req.params.id = '1';
      prisma.user.findUnique.mockRejectedValue(new Error());
      await getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error:"Erro ao processar solicitação" });
    });
  });

  describe('updateUserById', () => {
    it('atualiza e retorna 200', async () => {
      req.params.id = '1';
      req.body = { name:'N', phone:'2', email:'n@n.com', role:'USER' };
      prisma.user.update.mockResolvedValue({ id:'1' });
      await updateUserById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id:'1' });
    });

    it('trata erro com 400', async () => {
      req.params.id = '1';
      req.body = { name:'N', phone:'2', email:'n@n.com', role:'USER' };
      prisma.user.update.mockRejectedValue(new Error('fail'));
      await updateUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error:"Erro ao atualizar usuário", details:'fail' });
    });
  });

  describe('deleteUserById', () => {
    it('deleta e retorna 204', async () => {
      req.params.id = '1';
      prisma.user.delete.mockResolvedValue({});
      await deleteUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('trata erro com 500', async () => {
      req.params.id = '1';
      prisma.user.delete.mockRejectedValue(new Error());
      await deleteUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error:"Erro ao processar solicitação" });
    });
  });
});
