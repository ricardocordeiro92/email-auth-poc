import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string, @Res() res: Response) {
    const token = await this.authService.login(email);

    if (token) {
      return res.status(HttpStatus.OK).json({ token });
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Usuário não encontrado' });
    }
  }

  @Get('authenticate')
  @Redirect('/')
  async authenticate(@Query('token') token: string) {
    const authenticated = await this.authService.authenticateUser(token);

    if (authenticated) {
      return { url: '/' };
    } else {
      return { url: '/error' };
    }
  }
}
