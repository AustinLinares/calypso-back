import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { Worker } from 'src/workers/entities/worker.entity';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  get transporter() {
    const transporter = createTransport({
      host: 'mail.calypsospa.cl',
      port: 465,
      auth: {
        user: 'noreply-calypsospa@calypsospa.cl',
        pass: '$JXsld+.TS(d',
      },
      secure: true,
    });
    // const transporter = createTransport({
    //   host: this.configService.get('MAIL_HOST'),
    //   port: parseInt(this.configService.get('MAIL_PORT')),
    //   auth: {
    //     user: this.configService.get('MAIL_USER'),
    //     pass: this.configService.get('MAIL_PASSWORD'),
    //   },
    //   secure: true,
    // });

    return transporter;
  }

  async sendAllowSeeAppointmentsEmail(user: User) {
    const frontUrl: string = this.configService.get('FRONT_URL');
    const mailUser: string = this.configService.get('MAIL_USER');

    await this.transporter.sendMail({
      to: user.email,
      from: mailUser,
      subject: `Solicitud de historial de citas`,
      html: `Estimado/a ${user.name},
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
      En tu historial de citas podrás encontrar detalles sobre tus reservas anteriores, incluyendo fechas, horas y servicios reservados.
      <br>
      Para cualquier consulta contactarse con el siguiente numero <a href="https://wa.me/56991975494">+56 991975494</a>
      <br>
      <br>
      Agradecemos tu preferencia y esperamos seguir brindándote experiencias relajantes en CalypsoSpa.
      <br>
      <br>
      Saludos,
      El equipo de CalypsoSpa`,
    });
  }

  async sendNewAppointmentEmail(appointment: Appointment) {
    const frontUrl: string = this.configService.get('FRONT_URL');
    const mailUser: string = this.configService.get('MAIL_USER');

    await this.transporter.sendMail({
      to: appointment.user.email,
      from: mailUser,
      subject: `Confirmación de Reserva en CalypsoSpa`,
      html: `¡Estimado ${appointment.user.name}!
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
      Estamos comprometidos a proporcionarte el mejor servicio posible.
      <br>
      Para cualquier consulta contactarse con el siguiente numero <a href="https://wa.me/56991975494">+56 991975494</a>
      <br>
      <br>
      Esperamos verte pronto en CalypsoSpa y que disfrutes de un tiempo de relajación total.
      <br>
      <br>
      Saludos,
      El equipo de CalypsoSpa`,
    });
  }

  async sendNewWorkerEmail(worker: Worker, password: string) {
    const backofficeURL = this.configService.get('BACKOFFICE_URL');
    const mailUser = this.configService.get('MAIL_USER');

    await this.transporter.sendMail({
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
      Ingresa a tu cuenta en <a href="${backofficeURL}/login">Inciar Sesión</a>.
      <br>
      <br>
      Gracias por elegir CalypsoSpa. ¡Esperamos que disfrutes de una experiencia única y relajante!
      <br>
      <br>
      Para cualquier consulta contactarse con el siguiente numero <a href="https://wa.me/56991975494">+56 991975494</a>
      <br>
      <br>
      Saludos,
      El equipo de CalypsoSpa`,
    });
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    const backofficeURL = this.configService.get('BACKOFFICE_URL');
    const mailUser = this.configService.get('MAIL_USER');

    await this.transporter.sendMail({
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
    	<a href="${backofficeURL}/reset-password?email=${email}&token=${token}">Reset Password</a>
      <br>
      <br>
    	Atentamente, CalypsoSpa.
      <br>
    	<a href="https://wa.me/56991975494">+56 991975494</a>`,
    });
  }
}
