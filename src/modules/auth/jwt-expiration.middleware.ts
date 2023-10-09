import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtExpirationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Obtenha o token JWT da solicitação (por exemplo, do cabeçalho 'Authorization')
    const token = req.headers['authorization'];

    if (token) {
      try {
        // Verifique a validade do token
        this.jwtService.verify(token);

        // O token é válido, continue com a solicitação
        next();
      } catch (error) {
        // O token está expirado ou inválido, retorne um erro de token expirado
        return res.status(401).json({ message: 'Token expirado ou inválido' });
      }
    } else {
      // Token ausente na solicitação, retorne um erro
      return res.status(401).json({ message: 'Token ausente na solicitação' });
    }
  }
}
