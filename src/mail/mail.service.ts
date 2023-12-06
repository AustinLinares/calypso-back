import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { Worker } from 'src/workers/entities/worker.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  sendAllowSeeAppointmentsEmail(user: User) {
    const frontUrl = this.configService.get('FRONT_URL');
    const mailUser = this.configService.get('MAIL_USER');

    this.mailerService.sendMail({
      to: user.email,
      from: mailUser,
      subject: `Solicitud de historial de citas`,
      html: `Estimado/a ${user.first_name} ${user.last_name},
      <br>
      <br>
      Esperamos que estés disfrutando de tus experiencias en CalypsoSpa. Para acceder a tu historial de citas, por favor haz clic en el siguiente enlace:
      <br>
      <br>
      <a href="${frontUrl}/appointments/history?email=${user.email}&token=${user.token}">Enlace al historial de Citas</a>
      <br>
      <br>
      Este enlace estará disponible durante las próximas 1 hora. Después de este tiempo, expirará por razones de seguridad.
      <br>
      <br>
      En tu historial de citas podrás encontrar detalles sobre tus reservas anteriores, incluyendo fechas, horas y servicios reservados. Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de atención al cliente.
      <br>
      <br>
      Agradecemos tu preferencia y esperamos seguir brindándote experiencias relajantes en CalypsoSpa.
      <br>
      <br>
      Saludos,
      El equipo de CalypsoSpa`,
    });
  }

  sendNewAppointmentEmail(appointment: Appointment) {
    const frontUrl = this.configService.get('FRONT_URL');
    const mailUser = this.configService.get('MAIL_USER');

    this.mailerService.sendMail({
      to: appointment.user.email,
      from: mailUser,
      subject: `Confirmación de Reserva en CalypsoSpa`,
      html: `¡Estimado ${appointment.user.first_name} ${
        appointment.user.last_name
      }!
      <br>
      <br>
      Gracias por elegir CalypsoSpa para tu próxima cita de bienestar. Estamos emocionados de recibirte y proporcionarte una experiencia relajante y rejuvenecedora.
      <br>
      <br>
      Detalles de la Reserva:<br>
      - Fecha: ${appointment.date.toLocaleDateString('es-CL', {
        timeZone: 'America/Santiago',
      })}<br>
      - Hora: ${appointment.start_time}<br>
      - Servicio: ${appointment.service.name}<br>
      - Room: ${appointment.room.name}<br>
      <br>
      <br>
      Si desea ver un historial de sus citas: <a href="${frontUrl}/appointments/history?email=${
        appointment.user.email
      }&token=${appointment.user.token}">Enlace al historial de Citas</a>
      <br>
      <br>
      Estamos comprometidos a proporcionarte el mejor servicio posible. Si necesitas realizar cambios en tu reserva o tienes alguna pregunta, no dudes en ponerte en contacto con nuestro equipo de atención al cliente.
      <br>
      <br>
      Esperamos verte pronto en CalypsoSpa y que disfrutes de un tiempo de relajación total.
      <br>
      <br>
      Saludos,
      El equipo de CalypsoSpa`,
    });
  }

  sendNewWorkerEmail(worker: Worker, password: string) {
    const frontUrl = this.configService.get('FRONT_URL');
    const mailUser = this.configService.get('MAIL_USER');

    this.mailerService.sendMail({
      to: worker.email,
      from: mailUser,
      subject: `Bienvenido a CalypsoSpa`,
      html: `¡Hola ${worker.first_name} ${worker.last_name}!
      <br>
      <br>
      Bienvenido a CalypsoSpa, tu destino para el máximo relax y rejuvenecimiento. Estamos emocionados de tenerte como parte de nuestra comunidad. A continuación, encontrarás tus credenciales de inicio de sesión:
      <br>
      <br>
      Nombre de Usuario: ${worker.email}
      <br>
      Contraseña: ${password}
      <br>
      <br>
      Por razones de seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.
      <br>
      <br>
      Ingresa a tu cuenta en <a href="${frontUrl}/login">Inciar Sesión</a>.
      <br>
      <br>
      Gracias por elegir CalypsoSpa. ¡Esperamos que disfrutes de una experiencia única y relajante!
      <br>
      <br>
      Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nuestro equipo de soporte.
      <br>
      <br>
      Saludos,
      El equipo de CalypsoSpa`,
    });
  }

  sendForgotPasswordEmail(email: string, token: string) {
    const frontUrl = this.configService.get('FRONT_URL');
    const mailUser = this.configService.get('MAIL_USER');

    this.mailerService.sendMail({
      to: email,
      from: mailUser,
      subject: 'Forgot Password CalypsoSpa',
      html: `Esperamos que este correo electrónico te encuentre bien.
      <br>
      <br>
      Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en CalypsoSpa. Si no has solicitado esto, por favor ignora este mensaje.
      <br>
      <br>
			Si realmente has olvidado tu contraseña y deseas restablecerla, por favor sigue el enlace a continuación:
      <br>
	  	<a href="${frontUrl}/reset-password?email=${email}&token=${token}">Reset Password</a>
      <br>
      <br>
			Atentamente, CalypsoSpa.
      <br>
			<a href="https://wa.me/56991975494">+56991975494</a>`,
    });
  }
}
