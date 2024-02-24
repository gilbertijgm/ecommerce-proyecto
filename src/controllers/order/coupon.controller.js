import { CouponModel } from "../../models/order/coupon.model.js";

export const getAllCoupon = async (req, res) => {
    try {
        // Consultar todos los brands
        const coupons = await CouponModel.find({});

        // Verificar si se encontraron brands
        if (!coupons || coupons.length === 0) {
            return res.status(404).json({ success: false, msg: 'No coupons found' });
        }

        // Enviar una respuesta con los brands encontrados
        res.status(200).json({ success: true, totalCoupons: coupons.length, coupons });
    } catch (error) {
        // Manejar errores
        console.error('Error in brands:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getCouponById = async (req, res) => {
    try {
        const { id } = req.params;
        // Consultar el coupon por su ID
        const coupon = await CouponModel.findById(id);

        // Verificar si se encontró el brand
        if (!coupon) {
            return res.status(404).json({ success: false, msg: 'coupon not found' });
        }


        // Si se encuentra el coupon, enviar una respuesta exitosa con el coupon 
        res.status(200).json({ success: true, coupon: coupon });
    } catch (error) {
        // Manejar errores
        console.error('Error in get coupon by id:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}


export const createCoupon = async (req, res) => {
    try {
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title', 'expiry', 'discount'];
        for (const campos of camposRequeridos) {
            if (!req.body[campos]) {
                return res.status(400).json({ success: false, msg: `${campos} is required` });
            }
        }

        // Verificar si ya existe un pructo con el mismo título
        const existingCoupon = await CouponModel.findOne({ title: req.body.title });
        if (existingCoupon) {
            return res.status(409).json({ success: false, msg: 'Coupon with this title already exists' });
        }


        // Crear el blog con los datos proporcionados
        const newCoupon = await CouponModel.create(req.body);

        // Enviar una respuesta con el blog creado
        res.status(201).json({ success: true, msg: 'Coupon created successfully', coupon: newCoupon });
    } catch (error) {
        // Manejar errores
        console.error('Error in createCoupon:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar si los campos requeridos están presentes en el cuerpo de la solicitud
        const camposRequeridos = ['title', 'expiry', 'discount'];
        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ success: false, msg: `${campo} is required` });
            }
        }

        // Buscar el Coupon   por ID y actualizarlo con los datos proporcionados en el cuerpo de la solicitud
        const updatedCoupon = await CouponModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verificar si el Coupon   se encontró y se actualizó correctamente
        if (!updatedCoupon) {
            return res.status(404).json({ success: false, msg: 'Coupon   not found' });
        }

        // Enviar una respuesta con el Brand actualizado
        res.status(200).json({
            success: true,
            message: "Brand  updated successfully",
            coupon: {
                id: updatedCoupon._id,
                title: updatedCoupon.title,
                expiry: updatedCoupon.expiry,
                discount: updatedCoupon.discount
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in updatedBrand:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteCoupon= await CouponModel.findByIdAndDelete(id);

        // Verificar si se encontró el brand
        if (!deleteCoupon) {
            return res.status(404).json({ success: false, msg: 'coupon not found' });
        }

        // Enviar una respuesta ok, con el Coupon eliminado
        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
            Coupon: {
                id: deleteCoupon._id,
                title: deleteCoupon.title
            }
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in delete Brand:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}
