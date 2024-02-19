import {Role} from "../models/Role.js";
import {User} from "../models/User.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } from "../config.js";

export const createRoles = async () => {
    try {
        // Count Rows
        const count = await Role.count();

        // Check for existing roles
        if (count > 0) return;

        // Create default Roles
        const values = await Promise.all([
            Role.create({ nombre: "user" }),
            Role.create({ nombre: "moderator" }),
            Role.create({ nombre: "admin" }),
        ]);

        console.log(values);
    } catch (error) {
        console.error(error);
    }
};


export const createAdmin = async () => {
    try {
        // Check for an existing admin user
        const userFound = await User.findOne({ where: { correo: ADMIN_EMAIL } });
        console.log("User found:", userFound);

        if (userFound) {
            console.log("Admin user already exists");
            return;
        }

        // Get the 'admin' role
        const adminRole = await Role.findOne({ where: { nombre: 'admin' } });

        // Create a new admin user
        const newUser = await User.create({
            username: ADMIN_USERNAME,
            correo: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
        });

        // Associate the 'admin' role with the new user
        await newUser.addRole(adminRole);

        console.log(`New user created: ${newUser.correo}`);
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};