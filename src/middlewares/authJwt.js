import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";

export const verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;

        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ["password"] },
        });

        if (!user) return res.status(404).json({ message: "No user found" });

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

export const isModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].nombre === "moderator") {
                next();
                return;
            }
        }

        return res.status(403).json({ message: "Require Moderator Role!" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].nombre === "admin") {
                next();
                return;
            }
        }

        return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
};

export const isAdminOrModerator = async (req, res, next) => {
    try {
        const usuario = await User.findByPk(req.userId);
        const roles = await usuario.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].nombre === "admin" || roles[i].nombre === "moderator") {
                next();
                return;
            }
        }

        return res.status(403).json({ mensaje: "Se requiere el rol de Administrador o Moderador" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ mensaje: error.message });
    }
};
