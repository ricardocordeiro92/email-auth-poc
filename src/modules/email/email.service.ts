import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port:
        process.env.EMAIL_PORT ||
        process.env.EMAIL_PORT_TWO ||
        process.env.EMAIL_PORT_THREE ||
        process.env.EMAIL_PORT_FOUR,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendLoginEmail(email: string, link: string) {
    const mailOptions = {
      from: `${process.env.EMAIL_USERNAME}@email.com`,
      to: email,
      subject: 'Link de Acesso ao Sistema Email_Auth_Poc',
      text: `Clique no link a seguir para acessar o sistema: <a href=${link}>Link</a>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
