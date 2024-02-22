import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, { expiresIn: "1d"});
}

/* 
Esta función toma un id como argumento y utiliza jwt.sign() 
para firmar un token JWT utilizando una clave secreta definida en la variable de entorno JWT_SECRET_KEY.
 El token expira después de 3 días, como se especifica en la opción expiresIn.
 El token firmado se devuelve como resultado de la función.
*/