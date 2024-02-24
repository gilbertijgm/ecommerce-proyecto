import { brandModel } from "../../models/product/brand.model.js";

export const getAllBrand= async (req, res) => {
    try {
        // Consultar todos los brands
        const brands = await brandModel.find({});

        // Verificar si se encontraron brands
        if (!brands || brands.length === 0) {
            return res.status(404).json({ success: false, msg: 'No brands found' });
        }

        // Enviar una respuesta con los brands encontrados
        res.status(200).json({ success: true, totalBrands: brands.length,  brands });
    } catch (error) {
        // Manejar errores
        console.error('Error in brands:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        // Consultar el brand por su ID
        const brand = await brandModel.findById(id);

        // Verificar si se encontró el brand
        if (!brand) {
            return res.status(404).json({ success: false, msg: 'brand not found' });
        }


        // Si se encuentra el brand, enviar una respuesta exitosa con el brand 
        res.status(200).json({ success: true, brand: brand });
    } catch (error) {
        // Manejar errores
        console.error('Error in get brand by id:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const createBrand = async (req, res) => {
    try {
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Verificar si ya existe una brand con el mismo título
        const existingbrand = await brandModel.findOne({ title: req.body.title });
        if (existingbrand) {
            return res.status(409).json({ success: false, msg: 'brand with this title already exists' });
        }
        
        const newBrand = await brandModel.create(req.body);

        // Enviar una respuesta ok, con el brand creado
        res.status(200).json({
            success: true,
            message: "brand created successfully",
            newBrand
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in create brand:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Buscar el Brand  por ID y actualizarlo con los datos proporcionados en el cuerpo de la solicitud
        const updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el Brand  se encontró y se actualizó correctamente
        if (!updatedBrand) {
            return res.status(404).json({ success: false, msg: 'Brand  not found' });
        }

        // Enviar una respuesta con el Brand actualizado
        res.status(200).json({
            success: true,
            message: "Brand  updated successfully",
            brand: {
                id: updatedBrand._id,
                title: updatedBrand.title,
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in updatedBrand:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteBrand= await brandModel.findByIdAndDelete(id);

        // Enviar una respuesta ok, con el Brand eliminado
        res.status(200).json({
            success: true,
            message: "Brand deleted successfully",
            brand: {
                id: deleteBrand._id,
                title: deleteBrand.title
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in delete Brand:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

