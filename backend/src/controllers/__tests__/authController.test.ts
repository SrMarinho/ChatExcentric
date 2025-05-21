import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authController } from '../authController.js';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      user: {
        findUnique: jest.fn(),
        create: jest.fn()
      }
    }))
  };
});

// Mock dos outros módulos
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockUser = {
  id: 1,
  email: 'test@example.com',
  passwordHash: 'hashedpassword',
  name: 'Test User'
};

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let prisma: PrismaClient;

  beforeEach(() => {
    // Inicializa o mock do Prisma
    prisma = new PrismaClient();
    
    // Configuração básica de Request e Response
    req = {
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    // Resetar todos os mocks
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar 401 quando o usuário não existe', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      req.body = {
        email: 'notfound@example.com',
        password: 'anypassword'
      };

      await authController.login(req as Request, res as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'notfound@example.com' }
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
    });

    it('deve retornar 401 quando a senha está incorreta', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      await authController.login(req as Request, res as Response);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
    });

    it('deve retornar 200 com usuário e token quando credenciais estão corretas', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake.jwt.token');

      req.body = {
        email: 'test@example.com',
        password: 'correctpassword'
      };

      await authController.login(req as Request, res as Response);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, email: 'test@example.com' },
        'your-secret-key',
        { expiresIn: '1h' }
      );
      
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        },
        token: 'fake.jwt.token'
      });
    });

    it('deve retornar 500 em caso de erro no servidor', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      req.body = {
        email: 'test@example.com',
        password: 'anypassword'
      };

      await authController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
  });
});