// Cargar las variables de entorno desde el archivo 
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { checkEmailLimit } = require('./emailLimiter'); // Importa el módulo de control de límites

const app = express();

// Configuración de Nodemailer utilizando las variables de entorno
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,  // El puerto correcto para TLS
    secure: false,  // Usamos TLS (no SSL)
    auth: {
        user: process.env.SMTP_USER,  // Usar la variable de entorno para el correo
        pass: process.env.SMTP_PASS,  // Usar la variable de entorno para la contraseña
    },
    tls: {
        rejectUnauthorized: false,  // Asegura la conexión segura
    },
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para manejar el envío del formulario
app.post('/send-email', async (req, res) => {
    const { name, email, subjet, message } = req.body;

    // Verificar si el usuario ha superado el límite de mensajes
    if (!checkEmailLimit(email)) {
        return res.status(400).json({ message: 'Has alcanzado el límite de mensajes permitidos.' });
    }

    const mailOptions = {
        from: email,  // El correo del remitente
        to: process.env.SMTP_USER,  // Usar variable de entorno para el correo de destino
        subject: subjet,
        text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
    };

    try {
        // Enviar el correo
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el correo.' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;  // Esto permite que Heroku asigne el puerto automáticamente
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});