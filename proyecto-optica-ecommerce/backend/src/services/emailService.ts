import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter;

// Inicializar transporter
const initTransporter = async () => {
  if (transporter) return transporter;

  // Si hay configuración SMTP, usarla
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('📧 Email configurado con SMTP:', process.env.SMTP_HOST || 'smtp.gmail.com');
  } else {
    // Usar Ethereal para desarrollo (emails de prueba)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 Email configurado con Ethereal (desarrollo)');
    console.log('   Usuario:', testAccount.user);
    console.log('   Ver emails en: https://ethereal.email/login');
  }

  return transporter;
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transport = await initTransporter();
    const info = await transport.sendMail({
      from: `"Liney Visión" <${process.env.SMTP_USER || 'noreply@lineyvision.com'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    // Si es Ethereal, mostrar URL para ver el email
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Preview URL:', previewUrl);
    }

    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .button:hover { background: #4f46e5; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Recuperar Contraseña</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${name}</strong>,</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Liney Visión.</p>
          <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
          </p>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #6366f1;">${resetUrl}</p>
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este correo.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Liney Visión. Todos los derechos reservados.</p>
          <p>Este es un correo automático, por favor no respondas.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🔐 Recuperar contraseña - Liney Visión',
    html,
  });
};
