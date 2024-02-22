import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/images/'));
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
    }


});



const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format" }, false);
    }
};

export const uploadPhoto = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});

export const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            const outputPath = path.resolve(__dirname, '../public/images/products', file.filename);
            await sharp(file.path)
                .resize({width: 300, height: 300})
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(outputPath);
                fs.unlinkSync(outputPath);
        })
    );
    next();
};

export const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            const outputPath = path.resolve(__dirname, '../public/images/blogs', file.filename);
            await sharp(file.path)
                .resize({width: 300, height: 300})
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(outputPath);
                fs.unlinkSync(outputPath);
        })
    );
    next();
};