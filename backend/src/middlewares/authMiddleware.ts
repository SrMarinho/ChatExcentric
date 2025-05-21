import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'

interface AuthenticatedRequest extends Request {
  user: { id: string; username: string };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] 

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido!' })
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
       if(err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' })
       } 

    //    req.user = user
        console.log(user);
    
       next()
    })
}