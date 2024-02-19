import { Group } from "../models/Group.js"
import { Report } from "../models/Report.js"
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

export const getGroups = async (req, res) => {
    try {
        const groups = await Group.findAll()
        res.json(groups)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getGroup = async (req, res) => {
    try {
        const {id} = req.params
        const group = await Group.findByPk(id)
        res.json(group)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const createGroups = async (req, res) => {
    try {
        const {nombre, descripcion, icono, activo} = req.body
        const group = new Group()
        group.nombre = nombre
        group.descripcion = descripcion
        group.icono = icono
        group.activo = activo
        await group.save()
        res.json(group)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const updateGroups = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, icono, activo } = req.body;

        // Buscar el grupo por su ID
        const group = await Group.findByPk(id);

        // Verificar si se encontró el grupo
        if (!group) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        // Actualizar los campos del grupo
        if (nombre){
            group.nombre = nombre;
        } 
        group.descripcion = descripcion;
        group.icono = icono; // Corregir aquí: usar 'icono' en lugar de 'descripcion'
        group.activo = activo

        // Guardar los cambios en la base de datos
        await group.save();

        // Devolver el grupo actualizado
        res.json(group);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteGroups = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findByPk(id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        await Group.destroy({
            where: {
                id
            }
        });

        res.status(200).json({ message: 'Deleted successfully', deletedGroup: group });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getGroupReports = async (req, res) => {
    try {
        const {id} = req.params
        const reports = await Report.findAll({
            where: {groupId: id}
        })

        res.json(reports)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

export const getGroupsByUser = async (req, res) => {
    try {
        const token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.id;

        // Buscar usuario por su ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Obtener grupos y reportes del usuario
        const groups = await user.getGroups({ where: { activo: true }, order: [['id', 'ASC']] });

        // Construir la respuesta
        const response = {
            groups: groups,
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching user information" });
    }
};

export const getReportsByUserAndGroup = async (req, res) => {
    const {id} = req.params
    try {
        const token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.id;

        // Buscar usuario por su ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Obtener grupos y reportes del usuario
        const reports = await user.getReports({ where: { activo: true, groupId: id  }, order: [['id', 'ASC']] });

        // Construir la respuesta
        const response = {
            reports: reports
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching user information" });
    }
};
