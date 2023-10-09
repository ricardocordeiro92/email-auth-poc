import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const token = await this.generateToken(user);

    await this.sendLoginEmail(email, token);

    return token;
  }

  async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      type: user.type,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async sendLoginEmail(email: string, token: string): Promise<void> {
    // Configuração do serviço de email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port:
        Number(process.env.EMAIL_PORT) || Number(process.env.EMAIL_PORT_TWO),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Link de acesso ao sistema Email_Auth_Poc',
      text: `Aqui está o link de acesso ao sistema: http://localhost:3000/auth/authenticate?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async authenticateUser(token: string): Promise<boolean> {
    try {
      // Verifique e decodifique o token JWT
      const decodedToken = this.jwtService.verify(token);

      const user = await this.userRepository.findOne({
        where: { email: decodedToken.email },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Se o token for válido, retorne true para indicar a autenticação bem-sucedida
      return true;
    } catch (error) {
      // Em caso de erro na verificação do token, retorne false
      return false;
    }
  }
}
