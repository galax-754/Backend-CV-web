const fs = require('fs');

// Ruta del archivo donde se guarda el conteo de correos
const COUNTS_FILE = './emailCounts.json';
let emailCount = {};

// Si existe el archivo de conteo, lo leemos
if (fs.existsSync(COUNTS_FILE)) {
    emailCount = JSON.parse(fs.readFileSync(COUNTS_FILE, 'utf8'));
}

// Límite de correos permitidos por dirección de correo
const EMAIL_LIMIT = 3;

// Función para verificar y actualizar el límite de correos enviados
const checkEmailLimit = (email) => {
    if (emailCount[email] && emailCount[email] >= EMAIL_LIMIT) {
        return false;
    }

    // Si no existe el usuario, inicializamos su contador
    if (!emailCount[email]) {
        emailCount[email] = 0;
    }

    // Incrementamos el contador de correos enviados
    emailCount[email]++;

    // Guardamos el nuevo conteo de correos en el archivo JSON
    fs.writeFileSync(COUNTS_FILE, JSON.stringify(emailCount, null, 2));
    return true;
};

module.exports = { checkEmailLimit };
