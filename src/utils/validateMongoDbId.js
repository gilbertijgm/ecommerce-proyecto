import { Types } from "mongoose";

export const validateMongoDbId = (id) => {
  // aseguro de que se proporcione un valor para el ID
  if (!id) {
    throw new Error("ID is required");
  }
  //verifico que el ID sea una cadena de texto antes de intentar validar si es un ObjectId válido
  if (typeof id !== 'string') {
    throw new Error("ID must be a string");
  }
  //ID es inválido
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
};