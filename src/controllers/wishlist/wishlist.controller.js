import { validateMongoDbId } from "../../utils/validateMongoDbId.js";
import asyncHandler from "express-async-handler";
import { UserModel } from "./../../models/user/user.model.js";



export const getWishList = asyncHandler(async (req, res, next) => {
    try {
        const { _id } = req.user;
        
        const user = await UserModel.findById(_id).populate("wishlist");

        if (!user.wishlist || user.wishlist.length === 0) {
            return res.status(200).send({ message: "No items in the wishlist" });
        }

        return res.status(200).json({
            success: true,
            // msg: 'wishlist',
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                mobile: user.mobile,
                wishlist: user.wishlist,
                // wishlist: {
                //     id: product._id, title: product.title
                // }
            }
        });
    } catch (error) {
        // Manejar errores aquí
        // console.error("Error fetching wishlist:", error);
        // res.status(500).json({ error: "Internal server error" });
        next(error);
    }
})

export const addToWishLists = asyncHandler(async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { prodId } = req.body;
        validateMongoDbId(prodId)

        const user = await UserModel.findById(_id)
        // .populate({
        //     path: 'wishlist',
        //     select: 'id title'
        // });

        if (!user) {
            // return res.status(404).json({ success: false, msg: 'User not found' });
            const error = new Error("User not found");
            error.statusCode = 400;
            throw error;
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
        // console.error('Error in addToWishLists:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error);
    }
})