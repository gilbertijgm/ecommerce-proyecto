import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

                const user = await UserModel.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            console.log('Not authorized token expired. Please Login Again');
            res.status(401).json({ success: false, msg: 'Not authorized token expired. Please Login Again' });
        }
    } else {
        console.log('There is no token attached to header')
        res.status(401).json({ success: false, msg: 'There is no token attached to header' });
    }
}

/*
Este middleware de autenticación authMiddleware verifica si se proporciona un token de autorización en el encabezado de la solicitud. Aquí está la explicación del código:

let token;: Se declara una variable token para almacenar el token de autorización.

if (req?.headers?.authorization?.startsWith('Bearer ')) {: Se verifica si existe un encabezado de autorización en la solicitud y si comienza con la cadena "Bearer ".

token = req.headers.authorization.split(" ")[1];: Si el encabezado de autorización existe y comienza con "Bearer ", se divide el encabezado para extraer el token y se almacena en la variable token.

try {...} catch (error) {...}: Se intenta verificar el token utilizando jwt.verify() dentro de un bloque try-catch. Si hay un error durante la verificación, se maneja en el bloque catch.

if(token) {...}: Se verifica si hay un token presente antes de intentar verificarlo.

const decoded = jwt.verify(token. proccess.env.JWT_SECRET_KEY): Se utiliza jwt.verify() para verificar y decodificar el token utilizando la clave secreta JWT almacenada en la variable de entorno JWT_SECRET_KEY. El resultado decodificado se almacena en la variable decoded.

console.log(decoded);: Se imprime en la consola el contenido decodificado del token, que generalmente incluye información como el ID de usuario, roles, etc.

catch (error) {...}: Si ocurre un error durante la verificación del token (por ejemplo, si el token es inválido o ha expirado), se maneja el error y se imprime un mensaje en la consola indicando que el token no es válido o ha expirado.

Si no se proporciona un token de autorización o si no comienza con "Bearer ", se imprime un mensaje en la consola indicando que no hay ningún token adjunto al encabezado de la solicitud.

Este middleware puede integrarse en las rutas que requieren autenticación para verificar si el usuario tiene permiso para acceder a esos recursos.
*/

export const isAdmin = async (req, res, next) => {
    try {
        // Verificar si el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ success: false, msg: 'Unauthorized' });
        }

        // Obtener el correo electrónico del usuario autenticado
        const { email } = req.user;

        // Verificar si se proporciona el correo electrónico antes de intentar buscar al usuario en la base de datos
        if (!email) {
            return res.status(400).json({ success: false, msg: 'Email is required' });
        }

        // Buscar al usuario en la base de datos por su correo electrónico
        const adminUser = await UserModel.findOne({ email });

        // Verificar si el usuario es un administrador
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ success: false, msg: 'You are not an admin' });
        }

        // Si el usuario es un administrador, llamar al siguiente middleware
        next();
    } catch (error) {
        // Manejar errores
        console.error('Error in isAdmin:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}