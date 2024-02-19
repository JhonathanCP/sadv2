import jwt from "jsonwebtoken";
import ldap from 'ldapjs';
import { User } from "../models/User.js"
import { Role } from "../models/Role.js"
import { SECRET } from "../config.js";

export const signinHandler = async (req, res) => {
    try {
        // Request body email can be an email or username
        const userFound = await User.findOne({
            where: { username: req.body.username },
            include: [{ model: Role, as: "roles" }],
        });

        if (!userFound) return res.status(400).json({ message: "User Not Found" });

        const { username, password, roles } = userFound;

        if (roles.some(role => role.nombre === 'LDAP')) {
            // Autenticación LDAP
            const ldapClient = ldap.createClient({
                url: 'ldap://your-ldap-server-url',
            });

            ldapClient.bind(`uid=${username},ou=users,dc=example,dc=com`, req.body.password, (err) => {
                ldapClient.unbind();
                if (err) {
                    return res.status(401).json({ message: 'LDAP Authentication Failed' });
                }

                // Generar y enviar token JWT
                const token = jwt.sign({ id: userFound.id, username, rol: roles[0].nombre }, SECRET, {
                    expiresIn: "7200s", // 2 hours
                });

                res.json({ token });
            });
        } else {
            // Autenticación local
            const matchPassword = await comparePassword(req.body.password, password);

            if (!matchPassword) {
                return res.status(401).json({
                    token: null,
                    message: "Invalid Password",
                });
            }

            // Generar y enviar token JWT
            const token = jwt.sign({ id: userFound.id, username, rol: roles[0].nombre }, SECRET, {
                expiresIn: "7200s", // 2 hours
            });

            res.json({ token });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};