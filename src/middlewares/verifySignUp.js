import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { ROLES } from "../models/Role.js";

export const checkExistingUser = async (req, res, next) => {
    try {
        const userFound = await User.findOne({
            where: {
                username: req.body.username,
            },
        });

        if (userFound) {
            return res.status(400).json({ message: "The user already exists" });
        }

        const emailFound = await User.findOne({
            where: {
                email: req.body.correo,
            },
        });

        if (emailFound) {
            return res.status(400).json({ message: "The email already exists" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkExistingRole = async (req, res, next) => {
    if (!req.body.roles) {
        return res.status(400).json({ message: "No roles" });
    }

    try {
        for (let i = 0; i < req.body.roles.length; i++) {
            const role = await Role.findOne({
                where: {
                    nombre: req.body.roles[i],
                },
            });

            if (!role) {
                return res.status(400).json({
                    message: `Role ${req.body.roles[i]} does not exist`,
                });
            }
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
