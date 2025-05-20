import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../prisma/client.js'; // Ajuste o caminho conforme necessário
import { authController } from '../authController.js'; // Note a extensão .js

// Mocks
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../prisma/client.js', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('authController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((result) => {
        responseObject = result;
        return mockResponse as Response;
      }),
    };

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar 401 se o usuário não existir', async () => {
      mockRequest.body = { email: 'nonexistent@test.com', password: 'password' };
      prisma.user.findUnique.mockResolvedValue(null);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject).toEqual({ error: 'Credenciais inválidas' });
    });

    // ... (restante dos testes de login)
  });

  describe('register', () => {
    it('deve retornar 400 se o email já estiver em uso', async () => {
      mockRequest.body = { 
        email: 'existing@test.com', 
        password: 'password', 
        name: 'Test User' 
      };
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@test.com',
        password: 'hashedpassword',
        name: 'Existing User'
      });

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({ error: 'Email já está em uso' });
    });

    // ... (restante dos testes de registro)
  });
});