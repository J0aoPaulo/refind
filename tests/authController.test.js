const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('@prisma/client');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    let prisma, register, login, req, res;
  
    beforeAll(() => {
      prisma = {
        user: {
          findUnique: jest.fn(),
          create: jest.fn(),
        },
      };
      PrismaClient.mockImplementation(() => prisma);
  
      ({ register, login } = require('../src/controllers/authController'));
    });

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('retorna 400 se usuário já existe', async () => {
      req.body = { email: 'a@a.com' };
      prisma.user.findUnique.mockResolvedValue({ id: 1 });
      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário já existe com este email.' });
    });

    it('cria novo usuário e retorna 201', async () => {
      req.body = { name: 'T', phone: '123', email: 'a@a.com', password: 'p', role: 'USER' };
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('h');
      prisma.user.create.mockResolvedValue({
        id: 1, name: 'T', phone: '123', email: 'a@a.com', role: 'USER'
      });

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('p', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'T', phone: '123', email: 'a@a.com',
          password: 'h', role: 'USER'
        }
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1, name: 'T', phone: '123', email: 'a@a.com', role: 'USER'
      });
    });
  });

  describe('login', () => {
    it('401 se usuário não encontrado', async () => {
      req.body = { email: 'a@a.com', password: 'p' };
      prisma.user.findUnique.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
    });

    it('401 se senha inválida', async () => {
      req.body = { email: 'a@a.com', password: 'p' };
      prisma.user.findUnique.mockResolvedValue({ password: 'h' });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
    });

    it('retorna token quando credenciais válidas', async () => {
      req.body = { email: 'a@a.com', password: 'p' };
      const user = { id: 1, role: 'USER', password: 'h' };
      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('tok');

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, role: 'USER' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );
      expect(res.json).toHaveBeenCalledWith({ message: 'Login bem-sucedido!', token: 'tok' });
    });
  });
});