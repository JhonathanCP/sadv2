import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { Group } from "../models/Group.js";
import { Report } from "../models/Report.js";

import { generatePassword, generateUsername } from '../libs/generateUser.js'; // Asume que tienes una función para generar contraseñas

export const createUser = async (req, res) => {
    try {
        const { nombres, apellidos, correo, dni } = req.body;

        // Get the 'user' role
        const role = await Role.findOne({ where: { nombre: 'user' } });

        // Crear una nueva contraseña combinando correo y dni
        const password = generatePassword(correo, dni);
        const username = generateUsername(correo);

        // Crear un nuevo usuario con la contraseña generada
        const newUser = await User.create({
            nombres: nombres,
            apellidos: apellidos,
            username: username,
            correo: correo,
            dni: dni,
            password: password,
        });

        // Asignar el rol al nuevo usuario
        await newUser.addRole(role);

        console.log(`Nuevo usuario creado: ${newUser.correo}`);

        return res.status(200).json({
            id: newUser.id,
            username: newUser.username,
            correo: newUser.correo,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear el usuario" });
    }
};

export const getUsers = async (req, res) => {
try {
    const users = await User.findAll();
    return res.json(users);
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching users" });
}
};

export const getUser = async (req, res) => {
try {
    const user = await User.findByPk(req.params.id, {
    include: Role, // Incluir roles en la respuesta
    });

    if (!user) {
    return res.status(404).json({ message: "User not found" });
    }

    return res.json({
        id: user.id,
        username: user.username,
        correo: user.correo,
        groups: await user.getGroups(),
        reports: await user.getReports() // Retorna los reportes actualizados del usuario
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user" });
}
};
export const editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { nombres, apellidos, correo, dni } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar la información del usuario
        await user.update({
            nombres: nombres,
            apellidos: apellidos,
            correo: correo,
            dni: dni,
        });

        console.log(`Usuario actualizado: ${user.correo}`);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            correo: user.correo,
            nombres: user.nombres,
            apellidos: user.apellidos,
            dni: user.dni,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al editar el usuario" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Eliminar al usuario
        await user.destroy();

        console.log(`Usuario eliminado: ${user.correo}`);

        return res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};
export const addRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        await user.addRole(role);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            correo: user.correo,
            roles: await user.getRoles() // Retorna los roles actualizados del usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error adding role to user" });
    }
};

export const addReportToUser = async (req, res) => {
    try {
        const { userId, reportId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const report = await Report.findByPk(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await user.addReport(report);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            correo: user.correo,
            reports: await user.getReports() // Retorna los reportes actualizados del usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error adding report to user" });
    }
};

export const addGroupToUser = async (req, res) => {
    try {
        const { userId, groupId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await user.addGroup(group);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            correo: user.correo,
            groups: await user.getGroups() // Retorna los grupos actualizados del usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error adding group to user" });
    }
};

export const addAllPermissions = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Obtener todos los reportes y grupos existentes
        const allReports = await Report.findAll();
        const allGroups = await Group.findAll();

        // Agregar todos los reportes al usuario
        await user.addReports(allReports);

        // Agregar todos los grupos al usuario
        await user.addGroups(allGroups);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            correo: user.correo,
            reports: await user.getReports(), // Retorna los reportes actualizados del usuario
            groups: await user.getGroups() // Retorna los grupos actualizados del usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error adding all permissions to user" });
    }
};

export const removeRoleFromUser = async (req, res) => {
    try {
        const { userId, roleId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        await user.removeRole(role);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            correo: user.correo,
            roles: await user.getRoles() // Retorna los roles actualizados del usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error removing role from user" });
    }
};

export const removeReportFromUser = async (req, res) => {
    try {
        const { userId, reportId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const report = await Report.findByPk(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await user.removeReport(report);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            correo: user.correo,
            reports: await user.getReports() // Retorna los reportes actualizados del usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error removing report from user" });
    }
};

export const removeGroupFromUser = async (req, res) => {
    try {
        const { userId, groupId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await user.removeGroup(group);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            correo: user.correo,
            groups: await user.getGroups() // Retorna los grupos actualizados del usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error removing group from user" });
    }
};