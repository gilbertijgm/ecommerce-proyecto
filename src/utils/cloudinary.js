import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({ 
  cloud_name: 'dolcknrv0', 
  api_key: '477447898749131', 
  api_secret: 'Yqq5fFql615_tMUmtt8bgrJYw4M'
});

// Función para cargar imágenes en Cloudinary
export const cloudinaryUploadImgs = async (fileToUploads) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUploads, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                });
            }
        });
    });
};

export const cloudinaryDeleteImgs = async (fileToDelete) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(fileToDelete, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                });
            }
        });
    });
};


// import { v2 as cloudinary } from 'cloudinary';

// export async function uploadImage(filePath) {
//   return await cloudinary.uploader.upload(filePath, {
//     folder: 'ecommerce'
//   })
// }
// cloudinary.config({ 
//   cloud_name: 'dolcknrv0', 
//   api_key: '477447898749131', 
//   api_secret: 'Yqq5fFql615_tMUmtt8bgrJYw4M' 
// });