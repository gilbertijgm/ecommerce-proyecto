import slugify from 'slugify';
import { ProductModel } from "../models/product.model.js"
import { UserModel } from "../models/user.model.js";
// import { uploadImage } from '../utils/cloudinary.js';
import { cloudinaryDeleteImgs, cloudinaryUploadImgs } from '../utils/cloudinary.js';
import  fs  from 'fs';


export const getAllProduct = async (req, res) => {
    try {
        let query = {};

        // Filtrar por categoría si se proporciona el parámetro 'category' en la URL
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filtrar por color si se proporciona el parámetro 'color' en la URL
        if (req.query.color) {
            query.color = req.query.color;
        }

        // Filtrar por marca si se proporciona el parámetro 'brand' en la URL
        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        // Filtrar por rango de precios si se proporcionan los parámetros 'minPrice' y 'maxPrice' en la URL
        if (req.query.minPrice && req.query.maxPrice) {
            query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
        } else if (req.query.minPrice) {
            query.price = { $gte: req.query.minPrice };
        } else if (req.query.maxPrice) {
            query.price = { $lte: req.query.maxPrice };
        }

        // Parámetros de paginación
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Calcular el número de productos a saltar
        const skip = (page - 1) * pageSize;

        // Seleccionar las propiedades específicas que deseas devolver
        const projection = 'title description price category brand quantity';

        // Realizar la consulta con los filtros aplicados, seleccionar las propiedades específicas y aplicar paginación
        const productsFound = await ProductModel.find(query, projection)
            .skip(skip)
            .limit(pageSize);

        // Contar el número total de productos
        const totalProducts = await ProductModel.countDocuments(query);

        // Calcular el número total de páginas
        const totalPages = Math.ceil(totalProducts / pageSize);

        // Calcular las páginas siguientes y anteriores
        const nextPage = page < totalPages ? page + 1 : 0;
        const prevPage = page > 1 ? page - 1 : 0;

        // Generar los enlaces para la siguiente y la página anterior
        const nextLink = nextPage ? `http://localhost:8080/api/products/products?page=${nextPage}&pageSize=${pageSize}` : 0;
        const prevLink = prevPage ? `http://localhost:8080/api/products/products?page=${prevPage}&pageSize=${pageSize}` : 0;

        // Enviar una respuesta con los productos encontrados, los metadatos de paginación y los enlaces
        res.status(200).json({
            success: true,
            message: "Products filtered and paginated successfully",
            totalProducts: totalProducts,
            products: productsFound,
            info: {
                totalPages: totalPages, //total de paginas
                productsPage: productsFound.length,
                pageSize: pageSize, // docs por pagina
                prevPage: prevLink, //pagina anterior
                currentPage: page, //pagina actual
                nextPage: nextLink, //pagina siguiente
            }
        });
    } catch (error) {
        // Manejar errores
        console.error('Error in getAllProduct:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        //muestre todas las propiedades 
        const productFound = await ProductModel.findById(id)

        // Validar si hay usuarios encontrados
        if (!productFound || productFound.length === 0) {
            return res.status(404).json({ success: false, msg: 'No products found' });
        }

        // Si se encuentran usuarios enviar una respuesta ok, con el producto
        res.status(200).send({
            success: true,
            message: "Product by id",
            producto: {
                id: productFound._id,
                title: productFound.title,
                description: productFound.description,
                category: productFound.category,
                brand: productFound.brand,
                color: productFound.color,
                price: productFound.price,
                quantity: productFound.quantity
            }
        })
    } catch (error) {
        // Manejar errores
        console.error('Error in get product by id:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const createProduct = async (req, res) => {
    try {
    
        
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title', 'description', 'price', 'quantity', 'category', 'brand', 'color'];
        for (const campos of camposRequeridos) {
            if (!req.body[campos]) {
                return res.status(400).json({ success: false, msg: `${campos} is required` });
            }
        }

        // Verificar si ya existe un pructo con el mismo título
        const existingProducto = await ProductModel.findOne({ title: req.body.title });
        if (existingProducto) {
            return res.status(409).json({ success: false, msg: 'Product with this title already exists' });
        }


        //si req.boby.title exite se lo asigno a slug utilizando slugify
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        // if(req.files?.images){
        //     const result = await uploadImage(req.files.images.tempFilePath)
        //     const images = {
        //         public_id: result.public_id,
        //         secure_url: result.secure_url
        //     }

        //     req.body.images = images
        // }
        const newProduct = await ProductModel.create(req.body);

        // Enviar una respuesta ok, con el producto creado
        res.status(200).send({
            success: true,
            message: "Product created successfully",
            producto: {
                id: newProduct._id,
                title: newProduct.title,
                description: newProduct.description,
                category: newProduct.category,
                brand: newProduct.brand,
                color: newProduct.color,
                price: newProduct.price,
                quantity: newProduct.quantity,
                images: newProduct.images
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in createProduct:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title', 'description', 'price', 'quantity', 'category', 'brand', 'color'];
        for (const campos of camposRequeridos) {
            if (!req.body[campos]) {
                return res.status(400).json({ success: false, msg: `${campos} is required` });
            }
        }

        // Si req.body.title existe, asignar a slug utilizando slugify
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        // Buscar el producto por ID y actualizarlo con los datos proporcionados en el cuerpo de la solicitud
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el producto se encontró y se actualizó correctamente
        if (!updatedProduct) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }

        // Enviar una respuesta con el producto actualizado
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            producto: {
                id: updatedProduct._id,
                title: updatedProduct.title,
                description: updatedProduct.description,
                category: updatedProduct.category,
                brand: updatedProduct.brand,
                color: updatedProduct.color,
                price: updatedProduct.price,
                quantity: updatedProduct.quantity
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in updateProduct:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteProduct = await ProductModel.findByIdAndDelete(id);

        // Enviar una respuesta ok, con el producto eliminado
        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
            producto: {
                id: deleteProduct._id,
                title: deleteProduct.title
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in delete product:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const uploadImg = async (req, res) => {
    try {
        // Verificar si hay archivos en la solicitud
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Verificar si el ID del producto está presente en los parámetros de la solicitud
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Product ID is missing' });
        }

        // Subir las imágenes a Cloudinary y obtener las URL de las imágenes subidas
        const uploadedUrls = [];
        for (const file of req.files) {
            const { path } = file;
            const url = await cloudinaryUploadImgs(path);
            uploadedUrls.push(url);
            fs.unlinkSync(path);
        }

        // Actualizar el producto con las nuevas URLs de las imágenes
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { images: uploadedUrls },
            { new: true }
        );

        // Verificar si se encontró y actualizó el producto
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Enviar la respuesta con el producto actualizado
        res.status(200).json({
            success: true,
            message: "Product upload image successfully",
            producto: {
                id: updatedProduct._id,
                title: updatedProduct.title,
                description: updatedProduct.description,
                category: updatedProduct.category,
                brand: updatedProduct.brand,
                color: updatedProduct.color,
                price: updatedProduct.price,
                quantity: updatedProduct.quantity,
                images: updatedProduct.images
            }
        });
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteImg = async (req, res) => {
    try {
        const {id} = req.params;
       const deleted = cloudinaryDeleteImgs(id, "images");

       res.json({ message: "Deleted"})
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const addToWishLists = async (req, res) => {
    try {
        const { _id } = req.user;
        const { prodId } = req.body;

        const user = await UserModel.findById(_id)
        // .populate({
        //     path: 'wishlist',
        //     select: 'id title'
        // });

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Verificar si el producto ya está en la lista de deseos
        const isAlreadyAdded = user.wishlist.includes(prodId);

        if (isAlreadyAdded) {
            // Eliminar el producto de la lista de deseos
            await UserModel.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId }
                },
                { new: true }
            );
            const updatedUser = await UserModel.findById(_id).populate('wishlist', '_id title price images');
            return res.status(200).json({
                success: true,
                msg: 'Product removed from wishlist',
                wishlist: {
                    id: updatedUser._id,
                    firstname: updatedUser.firstname,
                    lastname: updatedUser.lastname,
                    email: updatedUser.email,
                    mobile: updatedUser.mobile,
                    wishlist: updatedUser.wishlist,
                    // wishlist: {
                    //     id: product._id, title: product.title
                    // }
                }
            });
        } else {
            // Agregar el producto a la lista de deseos
            await UserModel.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId }
                },
                { new: true }
            );
            // Obtener los datos del producto agregado a la lista de deseos
            //  const product = await ProductModel.findById(prodId);
            const updatedUser = await UserModel.findById(_id).populate('wishlist', '_id title price images');;
            return res.status(200).json({
                success: true,
                msg: 'Product added to wishlist',
                wishlist: {
                    id: updatedUser._id,
                    firstname: updatedUser.firstname,
                    lastname: updatedUser.lastname,
                    email: updatedUser.email,
                    mobile: updatedUser.mobile,
                    wishlist: updatedUser.wishlist,
                    // wishlist: {
                    //     id: product._id, title: product.title
                    // }
                }
            });
        }
    } catch (error) {
        console.error('Error in addToWishLists:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const rating = async (req, res) => {
    try {
        const { _id } = req.user;
        const { star, prodId, comment } = req.body;



        // Verificar si el usuario proporcionó una calificación válida
        if (typeof star !== 'number' || star < 1 || star > 5) {
            return res.status(400).json({ success: false, msg: 'Invalid star rating. Star rating must be a number between 1 and 5.' });
        }

        // Verificar si el comentario es una cadena de caracteres (opcional)
        if (comment && typeof comment !== 'string') {
            return res.status(400).json({ success: false, msg: 'Invalid comment. Comment must be a string.' });
        }

        const product = await ProductModel.findById(prodId);

        // Verificar si el producto existe
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }

        // Verificar si el usuario ya ha calificado el producto
        const alreadyRated = product.rating.find(rating => rating.postedBy.toString() === _id.toString());

        if (alreadyRated) {
            // Actualizar la calificación existente
            await ProductModel.updateOne(
                { 'rating.postedBy': _id },
                { $set: { 'rating.$.star': star, 'rating.$.comment': comment } },
                { new: true }
            );
        } else {
            // Agregar una nueva calificación
            await ProductModel.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        rating: {
                            star,
                            comment,
                            postedBy: _id
                        }
                    }
                },
                { new: true }
            );
        }

        // Calcular la calificación promedio del producto
        const allRatings = await ProductModel.findById(prodId);
        const totalRatings = allRatings.rating.length;
        const ratingSum = allRatings.rating.reduce((sum, rating) => sum + rating.star, 0);
        const averageRating = totalRatings > 0 ? Math.round(ratingSum / totalRatings) : 0;

        // Actualizar la calificación promedio del producto
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            prodId,
            { totalRating: averageRating },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error in rating:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};