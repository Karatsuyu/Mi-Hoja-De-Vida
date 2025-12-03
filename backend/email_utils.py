import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import logging

load_dotenv()

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_notification_email(username: str, email: str, message: str) -> bool:
    """
    Envía un email de notificación cuando se recibe un nuevo mensaje del formulario
    """
    try:
        # Configuración del email
        sender_email = os.getenv("MAIL_SENDER")
        sender_password = os.getenv("MAIL_PASSWORD")
        receiver_email = os.getenv("MAIL_RECEIVER")
        
        if not all([sender_email, sender_password, receiver_email]):
            logger.error("Configuración de email incompleta en variables de entorno")
            return False

        # Crear mensaje
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"💼 Nuevo mensaje desde tu Portfolio - {username}"
        msg["From"] = sender_email
        msg["To"] = receiver_email

        # Contenido HTML del email
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #b700ff; border-bottom: 2px solid #b700ff; padding-bottom: 10px;">
                📧 Nuevo Mensaje desde tu Portfolio
              </h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2c3e50;">Información del Contacto:</h3>
                <p><strong>👤 Nombre:</strong> {username}</p>
                <p><strong>📧 Email:</strong> <a href="mailto:{email}">{email}</a></p>
              </div>
              
              <div style="background: #ffffff; padding: 20px; border-left: 4px solid #b700ff; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2c3e50;">💬 Mensaje:</h3>
                <p style="white-space: pre-line; background: #f1f2f6; padding: 15px; border-radius: 5px;">
{message}
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 8px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  Este mensaje fue enviado desde el formulario de contacto de tu portfolio.<br>
                  Responde directamente a <strong>{email}</strong> para contactar al usuario.
                </p>
              </div>
            </div>
          </body>
        </html>
        """

        # Versión texto plano
        text = f"""
        NUEVO MENSAJE DESDE TU PORTFOLIO
        
        Información del Contacto:
        Nombre: {username}
        Email: {email}
        
        Mensaje:
        {message}
        
        ---
        Responde directamente a {email} para contactar al usuario.
        """

        # Adjuntar versiones del mensaje
        part_text = MIMEText(text, "plain")
        part_html = MIMEText(html, "html")
        
        msg.attach(part_text)
        msg.attach(part_html)

        # Enviar email usando Gmail SMTP
        context = ssl.create_default_context()
        
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
        
        logger.info(f"Email enviado exitosamente para mensaje de {username}")
        return True

    except smtplib.SMTPException as e:
        logger.error(f"Error SMTP al enviar email: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error inesperado al enviar email: {str(e)}")
        return False

def send_confirmation_email(user_email: str, username: str) -> bool:
    """
    Envía un email de confirmación al usuario que envió el mensaje
    """
    try:
        sender_email = os.getenv("MAIL_SENDER")
        sender_password = os.getenv("MAIL_PASSWORD")
        
        if not all([sender_email, sender_password]):
            return False

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "✅ Mensaje recibido - Julián Gutierrez Portfolio"
        msg["From"] = sender_email
        msg["To"] = user_email

        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #b700ff; text-align: center;">¡Gracias por contactarme!</h2>
              
              <p>Hola <strong>{username}</strong>,</p>
              
              <p>He recibido tu mensaje y te responderé lo antes posible. Agradezco tu interés en mi trabajo.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0;"><strong>🚀 Tiempo estimado de respuesta: 24-48 horas</strong></p>
              </div>
              
              <p>Mientras tanto, puedes:</p>
              <ul>
                <li>🔍 Explorar mis proyectos en el portfolio</li>
                <li>💼 Conectar conmigo en LinkedIn</li>
                <li>📧 Revisar mi experiencia y habilidades</li>
              </ul>
              
              <p>Saludos cordiales,<br>
              <strong>Julián Estiven Gutierrez</strong><br>
              Tecnólogo en Desarrollo de Software</p>
            </div>
          </body>
        </html>
        """

        part_html = MIMEText(html, "html")
        msg.attach(part_html)

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, user_email, msg.as_string())
        
        return True
    
    except Exception as e:
        logger.error(f"Error al enviar confirmación: {str(e)}")
        return False