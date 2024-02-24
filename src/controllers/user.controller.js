import { UserModel } from "../models/user.model.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.js";
import validator from 'validator';
import asyncHandler from "express-async-handler";

export const getAllUser = asyncHandler(async (req, res, next) => {
    try {
        //muestre todas las propiedades menos password .select('-password');
        const usersFound = await UserModel.find({}).select('-password');

        // Validar si hay usuarios encontrados
        if (!usersFound || usersFound.length === 0) {
            // return res.status(404).json({ success: false, msg: 'No users found' });
            const error = new Error('No users found')
            error.statusCode = 404;
            throw error;
        }

        // Si se encuentran usuarios, enviar la respuesta JSON
        res.json({ usersFound });
    } catch (error) {
        // Manejar errores
        // console.error('Error in getAllUser:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error);
    }
})

export const getUserById = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        //muestre todas las propiedades menos password .select('-password');
        const userFound = await UserModel.findById(id).select('-password');

        // Validar si hay usuarios encontrados
        if (!userFound || userFound.length === 0) {
            // return res.status(404).json({ success: false, msg: 'No users found' });
            const error = new Error('No user found')
            error.statusCode = 404;
            throw error;
        }


        // Si se encuentran usuarios, enviar la respuesta JSON
        res.json({ userFound });


    } catch (error) {
        // Manejar errores
        // console.error('Error in get user by id:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error);
    }
}
)

export const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { email, firstname, lastname, password } = req.body;

        // Validación de campos requeridos
        if (!email || !firstname || !lastname || !password) {
            // return res.status(400).json({ success: false, msg: 'All fields are required' });
            const error = new Error('All fields are required')
            error.statusCode = 400;
            throw error;
        }

        // Validación del formato del correo electrónico
        if (!validator.isEmail(email)) {
            // return res.status(400).json({ success: false, msg: 'Invalid email format' });
            const error = new Error('Invalid email format')
            error.statusCode = 400;
            throw error;
        }

        // Verificamos si el usuario ya existe por medio de su email
        const findUser = await UserModel.findOne({ email });
        if (findUser) {
            // return res.status(409).json({ success: false, msg: 'Email already exists' });
            const error = new Error('Email already exists')
            error.statusCode = 409;
            throw error;
        }

        // Crear un nuevo usuario
        const newUser = await UserModel.create(req.body);

        return res.status(201).json(newUser);
    } catch (error) {
        // Manejo de errores
        // console.error('Error in register user:', error);
        // return res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error);    
    }
}
)

export const updateUser = asyncHandler(async (req, res, next) => {
    try {
        //validacion del email
        const { email } = req.body;
        const {id} = req.params;
        validateMongoDbId(id);
        if (!validator.isEmail(email)) {
            // return res.status(400).json({ success: false, msg: 'Invalid email format' })
            const error = new Error('Invalid email format')
            error.statusCode = 400;
            throw error;
        }

        // Verificar si el usuario que se intenta actualizar existe
        const user = await UserModel.findById(id);
        if (!user) {
            // return res.status(404).json({ success: false, msg: 'User not found' });
            const error = new Error('User not found')
            error.statusCode = 404;
            throw error;
        }

        // Validar los datos de entrada antes de intentar realizar la actualización

        /*obtengo todas las claves (propiedades) del objeto req.body y las guarda en una matriz llamada updates. 
        Esto es útil porque req.body contendrá solo las propiedades que se están intentando actualizar en el usuario. */
        const updates = Object.keys(req.body);

        /*defino una matriz llamada allowedUpdates que contiene todas las propiedades que están permitidas para ser actualizadas en el usuario. 
        Estas son las propiedades que el usuario debe poder actualizar según las reglas de tu aplicación. */
        const allowedUpdates = ['firstname', 'lastname', 'email', 'mobile'];

        /*utiliza el método every() de JavaScript para verificar si todas las actualizaciones intentadas 
        (almacenadas en la matriz updates) están permitidas según la matriz allowedUpdates. 
        El método includes() se utiliza para verificar si cada actualización intentada está presente en la matriz 
        allowedUpdates. Si todas las actualizaciones intentadas están permitidas, isValidOperation será verdadero; 
        de lo contrario, será falso. */
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));


        if (!isValidOperation) {
            // return res.status(400).json({ success: false, msg: 'Invalid updates' });
            const error = new Error('Invalid updates')
            error.statusCode = 400;
            throw error;
        }

        // Realizar la actualización del usuario
        const { _id } = req.user;
        const updateUser = await UserModel.findByIdAndUpdate(_id, req.body, {
            new: true
        });

        res.json(updateUser);
    } catch (error) {
        //manejo de errores
        // console.log('Error in updating user: ', error);
        // return res.status(500).json({ succcess: false, msg: 'Internal server error' });
        next(error);
    }
})

export const deleteUser = asyncHandler(async (req, res, next) => {
    try {
        const {id} = req.params;
        validateMongoDbId(id)
        const user = await UserModel.findByIdAndDelete(id);

        // Verificar si el usuario existe antes de intentar eliminarlo
        if (!user) {
            // return res.status(404).json({ success: false, msg: 'User not found' });
            const error = new Error('User not found')
            error.statusCode = 404;
            throw error;
        }

        // Si se elimina correctamente, enviar una respuesta de estado 204 (Sin contenido)
         res.status(200).send({message:"user deleted successfully"})
    } catch (error) {
        // Manejar errores
        // console.error('Error in deleteUser:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error);
    }
})

export const saveAddress = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        

        // Buscar al usuario por su ID y actualizar su address
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
                address: req?.body?.address,
            },
            { new: true }
        );

        // Verificar si el usuario se encuentra y se ha guardado correctamente
        if (!updatedUser) {
            // return res.status(404).json({ success: false, msg: 'User not found' });
            const error = new Error('User not found')
            error.statusCode = 404;
            throw error;
        }

        // Enviar una respuesta de éxito
        res.json({ success: true, msg: 'address saved successfully', address: updatedUser.address });
    } catch (error) {
        // Manejar errores
        // console.error('Error in saved address:', error);
        // res.status(500).json({ success: false, msg: 'Internal server error' });
        next(error);
    }
})