import { CategoryModel } from "../../models/product/prod-category.model.js";

export const getAllCategory = async (req, res) => {
    try {
        // Consultar todos los categorys
        const categorys = await CategoryModel.find({});

        // Verificar si se encontraron categorys
        if (!categorys || categorys.length === 0) {
            return res.status(404).json({ success: false, msg: 'No categorys found' });
        }

        // Enviar una respuesta con los categorys encontrados
        res.status(200).json({ success: true, totalCategorys: categorys.length,  categorys });
    } catch (error) {
        // Manejar errores
        console.error('Error in categorys:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        // Consultar el category por su ID
        const category = await CategoryModel.findById(id);

        // Verificar si se encontró el category
        if (!category) {
            return res.status(404).json({ success: false, msg: 'Blog not found' });
        }


        // Si se encuentra el category, enviar una respuesta exitosa con el category 
        res.status(200).json({ success: true, category: category });
    } catch (error) {
        // Manejar errores
        console.error('Error in get category by id:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const createCategory = async (req, res) => {
    try {
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Verificar si ya existe una categoría con el mismo título
        const existingCategory = await CategoryModel.findOne({ title: req.body.title });
        if (existingCategory) {
            return res.status(409).json({ success: false, msg: 'Category with this title already exists' });
        }
        
        const newCategory = await CategoryModel.create(req.body);

        // Enviar una respuesta ok, con el producto creado
        res.status(200).json({
            success: true,
            message: "Category created successfully",
            newCategory
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in createCategory:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Buscar el producto por ID y actualizarlo con los datos proporcionados en el cuerpo de la solicitud
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el producto se encontró y se actualizó correctamente
        if (!updatedCategory) {
            return res.status(404).json({ success: false, msg: 'Category not found' });
        }

        // Enviar una respuesta con el producto actualizado
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: {
                id: updatedCategory._id,
                title: updatedCategory.title,
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in updatedCategory:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteCategory= await CategoryModel.findByIdAndDelete(id);

        // Enviar una respuesta ok, con el producto eliminado
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category: {
                id: deleteCategory._id,
                title: deleteCategory.title
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in delete category:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

