import { colorModel } from "../../models/product/color.model.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from '../../utils/validateMongoDbId.js';

export const getAllColor = asyncHandler(async (req, res, next) => {
    try {
        // Consultar todos los colores
        const colors = await colorModel.find({});

        // Verificar si se encontraron colores
        if (!colors || colors.length === 0) {
            // return res.status(404).json({ success: false, msg: 'No colors found' });
            const error = new Error('No colors found');
            error.statusCode = 400;
            throw error;
        }

        // Enviar una respuesta con los colors encontrados
        res.status(200).json({ success: true, totalColors: colors.length, colors });
    } catch (error) {
        // Manejar errores
        // console.error('Error in colors:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error);
    }
})

export const getColorById = asyncHandler(async (req, res,next) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id)
        // Consultar el color por su ID
        const color = await colorModel.findById(id);

        // Verificar si se encontró el brand
        if (!color) {
            // return res.status(404).send({ success: false, msg: 'color not found' });
            const error = new Error('color not found');
            error.statusCode = 400;
            throw error;
        }


        // Si se encuentra el brand, enviar una respuesta exitosa con el brand 
        res.status(200).json({ success: true, color: color });
    } catch (error) {
        // Manejar errores
        // console.error('Error in get color by id:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error)
    }
})

export const createColor = asyncHandler(async (req, res, next) => {
    try {
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                // return res.status(400).json({ success: false, msg: `${campo} is required` });
                // throw new Error(`${campo} is required`)
                const error = new Error(`${campo} is required`);
                error.statusCode = 400;
                throw error;
            }
        }

        // Verificar si ya existe una color con el mismo título
        const existingcolor = await colorModel.findOne({ title: req.body.title });
        if (existingcolor) {
            // return res.status(409).json({ success: false, msg: 'color with this title already exists' });
            const error = new Error('color with this title already exists');
            error.statusCode = 409;
            throw error;
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
        // console.error('Error in create color:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        // throw new Error(error)
        next(error)
    }
})

export const updateColor = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id)

        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                // return res.status(400).json({ success: false, msg: `${campo} is required` });
                const error = new Error(`${campo} is required`);
                error.statusCode = 400;
                throw error;
            }
        }

        // Verificar si ya existe una color con el mismo título
        const existingcolor = await colorModel.findOne({ title: req.body.title });
        if (existingcolor) {
            // return res.status(409).json({ success: false, msg: 'color with this title already exists' });
            const error = new Error('color with this title already exists');
            error.statusCode = 409;
            throw error;
        }

        // Buscar el color  por ID y actualizarlo con los datos proporcionados en el cuerpo de la solicitud
        const updatedColor = await colorModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el color  se encontró y se actualizó correctamente
        if (!updatedColor) {
            // return res.status(404).json({ success: false, msg: 'color  not found' });
            const error = new Error('color  not found');
            error.statusCode = 404;
            throw error;
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
        // console.error('Error in updatedColor:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error)
    }
})

export const deleteColor = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id)

        const deleteColor = await colorModel.findByIdAndDelete(id);

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
})

