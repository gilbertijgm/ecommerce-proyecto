import mongoose from "mongoose";


export const initMongoDB = async () => {
    try {
        //await mongoose.connect(process.env.MONGO_URL_ATLAS);
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Conectado a la base de datos: "${mongoose.connection.name}"`);
    } catch (error) {
        console.log(`error => ${error}`);
    }

}