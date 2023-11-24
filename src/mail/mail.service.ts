import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  sendForgotPasswordEmail(email: string, token: string) {
    this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('MAIL_USER'),
      subject: 'Forgot Password CalypsoSpa',
      html: `Esperamos que este correo electrónico te encuentre bien.
      <br>
      <br>
      Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en CalypsoSpa. Si no has solicitado esto, por favor ignora este mensaje.
      <br>
      <br>
			Si realmente has olvidado tu contraseña y deseas restablecerla, por favor sigue el enlace a continuación:
      <br>
	  	<a href="https://calypsospa.cl/reset-password?email=${email}?token=${token}">Reset Password</a>
      <br>
      <br>
			Atentamente, CalypsoSpa.
      <br>
			<a href="https://wa.me/56991975494">+56991975494</a>`,
    });
  }
}
