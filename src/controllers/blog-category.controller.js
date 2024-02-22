import { blogCategoryModel } from "../models/blog-category.model.js";

export const getAllBlogCategory = async (req, res) => {
    try {
        // Consultar todos los categorys
        const blogCategorys = await blogCategoryModel.find({});

        // Verificar si se encontraron blogCategorys
        if (!blogCategorys || blogCategorys.length === 0) {
            return res.status(404).json({ success: false, msg: 'No blogCategorys found' });
        }

        // Enviar una respuesta con los blogCategorys encontrados
        res.status(200).json({ success: true, totalCategorys: blogCategorys.length,  blogCategorys });
    } catch (error) {
        // Manejar errores
        console.error('Error in blogCategorys:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getBlogCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        // Consultar el category por su ID
        const blogCategory = await blogCategoryModel.findById(id);

        // Verificar si se encontró el category
        if (!blogCategory) {
            return res.status(404).json({ success: false, msg: 'Blog Category not found' });
        }


        // Si se encuentra el category, enviar una respuesta exitosa con el category 
        res.status(200).json({ success: true, blogCategory: blogCategory });
    } catch (error) {
        // Manejar errores
        console.error('Error in get blogCategory by id:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const createBlogCategory = async (req, res) => {
    try {
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Verificar si ya existe una categoría con el mismo título
        const existingBlogCategory = await blogCategoryModel.findOne({ title: req.body.title });
        if (existingBlogCategory) {
            return res.status(409).json({ success: false, msg: 'Blog Category with this title already exists' });
        }
        
        const newBlogCategory = await blogCategoryModel.create(req.body);

        // Enviar una respuesta ok, con el producto creado
        res.status(200).json({
            success: true,
            message: "Blog category created successfully",
            newBlogCategory
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in create BlogCategory:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const updateBlogCategory = async (req, res) => {
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
        const updatedBlogCategory = await blogCategoryModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el producto se encontró y se actualizó correctamente
        if (!updatedBlogCategory) {
            return res.status(404).json({ success: false, msg: 'Category not found' });
        }

        // Enviar una respuesta con el producto actualizado
        res.status(200).json({
            success: true,
            message: "Blog category updated successfully",
            blogCategory: {
                id: updatedBlogCategory._id,
                title: updatedBlogCategory.title,
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in updatedBlogCategory:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const deleteBlogCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteBlogCategory= await blogCategoryModel.findByIdAndDelete(id);

        // Enviar una respuesta ok, con el producto eliminado
        res.status(200).json({
            success: true,
            message: "Blog category deleted successfully",
            category: {
                id: deleteBlogCategory._id,
                title: deleteBlogCategory.title
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in delete blog category:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

