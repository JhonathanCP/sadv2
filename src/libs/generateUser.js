// utils.js

export const generatePassword = (correo, dni) => {
    const usernamePart = correo.split('@')[0]; // Tomar la parte antes del '@' en el correo
    const dniPart = dni.toString(); // Tomar los últimos 6 dígitos del DNI

    return `${usernamePart}${dniPart}`;
};

export const generateUsername = (correo) => {
    const usernamePart = correo.split('@')[0]; // Tomar la parte antes del '@' en el correo
    return `${usernamePart}`;
};