import { colorModel } from "../models/color.model.js";


export const getAllColor= async (req, res) => {
    try {
        // Consultar todos los colores
        const colors = await colorModel.find({});

        // Verificar si se encontraron colores
        if (!colors || colors.length === 0) {
            return res.status(404).json({ success: false, msg: 'No colors found' });
        }

        // Enviar una respuesta con los colors encontrados
        res.status(200).json({ success: true, totalColors: colors.length,  colors });
    } catch (error) {
        // Manejar errores
        console.error('Error in colors:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getColorById = async (req, res) => {
    try {
        const { id } = req.params;
        // Consultar el color por su ID
        const color = await colorModel.findById(id);

        // Verificar si se encontró el brand
        if (!color) {
            return res.status(404).send({ success: false, msg: 'color not found' });
        }


        // Si se encuentra el brand, enviar una respuesta exitosa con el brand 
        res.status(200).json({ success: true, color: color });
    } catch (error) {
        // Manejar errores
        console.error('Error in get color by id:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const createColor = async (req, res) => {
    try {
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Verificar si ya existe una color con el mismo título
        const existingcolor = await colorModel.findOne({ title: req.body.title });
        if (existingcolor) {
            return res.status(409).json({ success: false, msg: 'color with this title already exists' });
        }
        
        const newColor = await colorModel.create(req.body);

        // Enviar una respuesta ok, con el color creado
        res.status(200).json({
            success: true,
            message: "color created successfully",
            newColor
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in create color:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const updateColor = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Buscar el color  por ID y actualizarlo con los datos proporcionados en el cuerpo de la solicitud
        const updatedColor = await colorModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el color  se encontró y se actualizó correctamente
        if (!updatedColor) {
            return res.status(404).json({ success: false, msg: 'color  not found' });
        }

        // Enviar una respuesta con el color actualizado
        res.status(200).json({
            success: true,
            message: "Brand  updated successfully",
            color: {
                id: updatedColor._id,
                title: updatedColor.title,
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in updatedColor:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const deleteColor = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteColor= await colorModel.findByIdAndDelete(id);

        // Enviar una respuesta ok, con el color eliminado
        res.status(200).json({
            success: true,
            message: "color deleted successfully",
            color: {
                id: deleteColor._id,
                title: deleteColor.title
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in delete color:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

