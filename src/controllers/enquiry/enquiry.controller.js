import { enquiryModel } from "../../models/enquiry/enquiry.model.js";
import validator from 'validator';

export const getAllEnquiry = async (req, res) => {
    try {
        // Consultar todos los enquiry
        const enquiry = await enquiryModel.find({});

        // Verificar si se encontraron brands
        if (!enquiry || enquiry.length === 0) {
            return res.status(404).json({ success: false, msg: 'No enquiry found' });
        }

        // Enviar una respuesta con los enquiry encontrados
        res.status(200).json({ success: true, totalEnquiry: enquiry.length, enquiry });
    } catch (error) {
        // Manejar errores
        console.error('Error in enquiry:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;
        // Consultar el enquiry por su ID
        const enquiry = await enquiryModel.findById(id);

        // Verificar si se encontró el enquiry
        if (!enquiry) {
            return res.status(404).json({ success: false, msg: 'enquiry not found' });
        }


        // Si se encuentra el enquiry, enviar una respuesta exitosa con el enquiry 
        res.status(200).json({ success: true, enquiry: enquiry });
    } catch (error) {
        // Manejar errores
        console.error('Error in get enquiry by id:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const createEnquiry = async (req, res) => {
    try {
        const { email, name, mobile, comment } = req.body;

        // Validación de campos requeridos
        if (!email || !name || !mobile || !comment) {
            return res.status(400).json({ success: false, msg: 'All fields are required' });
        }

        // Validación del formato del correo electrónico
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, msg: 'Invalid email format' });
        }

        // Verificar si ya existe una enquiry con el mismo título
        const existingenquiry = await enquiryModel.findOne({ title: req.body.name });
        if (existingenquiry) {
            return res.status(409).json({ success: false, msg: 'enquiry with this title already exists' });
        }

        const newEnquiry = await enquiryModel.create(req.body);

        // Enviar una respuesta ok, con el enquiry creado
        res.status(200).json({
            success: true,
            message: "enquiry created successfully",
            newEnquiry
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in create enquiry:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const updateEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['status'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Buscar el enquiry  por ID y actualizarlo con los datos proporcionados en el cuerpo de la solicitud
        const updatedEnquiry = await enquiryModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el enquiry  se encontró y se actualizó correctamente
        if (!updatedEnquiry) {
            return res.status(404).json({ success: false, msg: 'enquiry  not found' });
        }

        // Enviar una respuesta con el enquiry actualizado
        res.status(200).json({
            success: true,
            message: "enquiry  updated successfully",
            brand: {
                id: updatedEnquiry._id,
                status: updatedEnquiry.status
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in updatedEnquiry:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteEnquiry = await enquiryModel.findByIdAndDelete(id);

        // Enviar una respuesta ok, con el enquiry eliminado
        res.status(200).json({
            success: true,
            message: "enquiry deleted successfully",
            enquiry: {
                id: deleteEnquiry._id,
                name: deleteEnquiry.name
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in delete enquiry:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

