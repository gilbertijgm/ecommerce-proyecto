import { BlogModel } from "../models/blog.model.js";
import { cloudinaryUploadImgs } from "../utils/cloudinary.js";
import  fs  from 'fs';

export const getBlogs = async (req, res) => {
    try {
        // Consultar todos los blogs
        const blogs = await BlogModel.find({})
                                            .populate('likes')
                                            .populate('dislikes');;

        // Verificar si se encontraron blogs
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ success: false, msg: 'No blogs found' });
        }

        // Enviar una respuesta con los blogs encontrados
        res.status(200).json({ success: true, totalBlogs: blogs.length, blogs });
    } catch (error) {
        // Manejar errores
        console.error('Error in getBlogs:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        // Consultar el blog por su ID
        const blog = await BlogModel.findById(id)
                                                .populate('likes')
                                                .populate('dislikes');

        // Verificar si se encontró el blog
        if (!blog) {
            return res.status(404).json({ success: false, msg: 'Blog not found' });
        }

        // Actualizar el contador de vistas del blog
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 }
            },
            { new: true }
        );

        // Si se encuentra el blog, enviar una respuesta exitosa con el blog actualizado
        res.status(200).json({ success: true, blog: blog });
    } catch (error) {
        // Manejar errores
        console.error('Error in get blog by id:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const createBlog = async (req, res) => {
    try {
        // Validar los datos de entrada (por ejemplo, campos obligatorios)
        if ( !req.body.content) {
            return res.status(400).json({ success: false, msg: 'All Campos are required' });
        }

        // Crear el blog con los datos proporcionados
        const newBlog = await BlogModel.create(req.body);

        // Enviar una respuesta con el blog creado
        res.status(201).json({ success: true, msg: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        // Manejar errores
        console.error('Error in createBlog:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay datos proporcionados para actualizar
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, msg: 'No data provided for update' });
        }

        // Buscar el blog por ID y actualizarlo con los datos proporcionados en el cuerpo de la solicitud
        const updatedBlog = await BlogModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el blog se encontró y se actualizó correctamente
        if (!updatedBlog) {
            return res.status(404).json({ success: false, msg: 'Blog not found' });
        }

        // Enviar una respuesta con el blog actualizado
        res.status(200).json({ success: true, msg: 'Blog updated successfully', updatedBlog });
    } catch (error) {
        // Manejo de errores
        console.error('Error in updateBlog:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBlog = await BlogModel.findByIdAndDelete(id);

        // Verificar si el blog se encontró y se eliminó correctamente
        if (!deletedBlog) {
            return res.status(404).json({ success: false, msg: 'Blog not found' });
        }

        // Enviar una respuesta con el blog eliminado
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            deletedBlog: {
                id: deletedBlog._id,
                title: deletedBlog.title
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in deleteBlog:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const upload = async (req, res) => {
    try {
        // Verificar si hay archivos en la solicitud
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Verificar si el ID del Blog está presente en los parámetros de la solicitud
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Blog ID is missing' });
        }

        // Subir las imágenes a Cloudinary y obtener las URL de las imágenes subidas
        const uploadedUrls = [];
        for (const file of req.files) {
            const { path } = file;
            const url = await cloudinaryUploadImgs(path);
            uploadedUrls.push(url);
            // fs.unlinkSync(path);
        }

        // Actualizar el producto con las nuevas URLs de las imágenes
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            id,
            { images: uploadedUrls },
            { new: true }
        );

        // Verificar si se encontró y actualizó el Blog
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Enviar la respuesta con el Blog actualizado
        res.status(200).json({
            success: true,
            message: "Blog upload image successfully",
            blog: {
                id: updatedBlog._id,
                title: updatedBlog.title,
                description: updatedBlog.description,
                category: updatedBlog.category,
                brand: updatedBlog.brand,
                color: updatedBlog.color,
                price: updatedBlog.price,
                quantity: updatedBlog.quantity,
                images: updatedBlog.images
            }
        });
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const likeBlog = async (req, res) => {
    try {
        const { blogId } = req.body;

        // Verificar si el ID del blog está presente en la solicitud
        if (!blogId) {
            return res.status(400).json({ success: false, msg: 'Blog ID is required' });
        }

        // Buscar el blog por su ID
        const blog = await BlogModel.findById(blogId);

        // Verificar si se encontró el blog
        if (!blog) {
            return res.status(404).json({ success: false, msg: 'Blog not found' });
        }

        const loginUserId = req?.user?._id;

        // Verificar si el usuario ya ha dado dislike al blog
        const alreadyDisliked = blog?.dislikes?.find(userId => userId?.toString() === loginUserId?.toString());

        // Si el usuario ya ha dado dislike al blog, quitar su ID de la lista de dislikes
        if (alreadyDisliked) {
            const updatedBlog = await BlogModel.findByIdAndUpdate(
                blogId,
                {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false
                },
                { new: true }
            );
            return res.json(updatedBlog);
        }

        const isLiked = blog?.isLiked;

        // Si el blog ya ha sido likeado por el usuario, quitar su ID de la lista de likes
        if (isLiked) {
            const updatedBlog = await BlogModel.findByIdAndUpdate(
                blogId,
                {
                    $pull: { likes: loginUserId },
                    isLiked: false
                },
                { new: true }
            );
            return res.json(updatedBlog);
        } else {
            // Si el blog no ha sido likeado por el usuario, agregar su ID a la lista de likes
            const updatedBlog = await BlogModel.findByIdAndUpdate(
                blogId,
                {
                    $push: { likes: loginUserId },
                    isLiked: true
                },
                { new: true }
            );
            return res.json(updatedBlog);
        }
    } catch (error) {
        // Manejo de errores
        console.error('Error in likeBlog:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const dislikeBlog = async (req, res) => {
    try {
        const { blogId } = req.body;

        // Verificar si el ID del blog está presente en la solicitud
        if (!blogId) {
            return res.status(400).json({ success: false, msg: 'Blog ID is required' });
        }

        // Buscar el blog por su ID
        const blog = await BlogModel.findById(blogId);

        // Verificar si se encontró el blog
        if (!blog) {
            return res.status(404).json({ success: false, msg: 'Blog not found' });
        }

        const loginUserId = req?.user?._id;

        // Verificar si el usuario ya ha dado like al blog
        const alreadyLiked = blog?.likes?.find(userId => userId?.toString() === loginUserId?.toString());

        // Si el usuario ya ha dado like al blog, quitar su ID de la lista de likes
        if (alreadyLiked) {
            const updatedBlog = await BlogModel.findByIdAndUpdate(
                blogId,
                {
                    $pull: { likes: loginUserId },
                    isLiked: false
                },
                { new: true }
            );
            return res.json(updatedBlog);
        }

        const isDisliked = blog?.isDisliked;

        // Si el blog ya ha sido dislikeado por el usuario, quitar su ID de la lista de dislikes
        if (isDisliked) {
            const updatedBlog = await BlogModel.findByIdAndUpdate(
                blogId,
                {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false
                },
                { new: true }
            );
            return res.json(updatedBlog);
        } else {
            // Si el blog no ha sido dislikeado por el usuario, agregar su ID a la lista de dislikes
            const updatedBlog = await BlogModel.findByIdAndUpdate(
                blogId,
                {
                    $push: { dislikes: loginUserId },
                    isDisliked: true
                },
                { new: true }
            );
            return res.json(updatedBlog);
        }
    } catch (error) {
        // Manejo de errores
        console.error('Error in dislikeBlog:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}
