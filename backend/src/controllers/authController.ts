// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      //Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar a senha
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Remover o password do response
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      return res.json({
        user: userWithoutPassword,
        token
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    try {
      // 1. Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }

      // 2. Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Criar novo usuário
      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name
        }
      });

      // 4. Gerar token JWT
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // 5. Retornar resposta com token (remover a senha do retorno)
      const { passwordHash: _, ...userWithoutPassword } = newUser;
      
      return res.status(201).json({
        user: userWithoutPassword,
        token
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};