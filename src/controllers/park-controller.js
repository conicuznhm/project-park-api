const fs = require('fs');
const { Op } = require('sequelize');
const { Park } = require('../models');
const cloudinary = require('../utils/cloudinary');
const errorFn = require('../utils/error-fn');

exports.createPark = async (req, res, next) => {
    try {

        // if (req.user.role !== "offer") {
        //     errorFn('You are unauthorized', 401)
        // }

        const value = req.body;
        if (value.parkImage) {
            value.vehicleImage = await cloudinary.upload(value.vehicleImage)
        }

        value.userId = req.user.id;
        const park = await Park.create(value);
        res.status(201).json({ park })
    } catch (err) { next(err) }
    finally {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
    }
}

//floorAmount floorName slotAmount parkId 
// exports.createParkAuto = async (req, res, next) => {
//     try {

//         // if (req.user.role !== "offer") {
//         //     errorFn('You are unauthorized', 401)
//         // }

//         const value = req.body;
//         if (value.parkImage) {
//             value.vehicleImage = await cloudinary.upload(value.vehicleImage)
//         }

//         value.userId = req.user.id;
//         const park = await Park.create(value);
//         res.status(201).json({ park })
//     } catch (err) { next(err) }
//     finally {
//         if (req.file) {
//             fs.unlinkSync(req.file.path)
//         }
//     }
// }



exports.updatePark = async (req, res, next) => {
    try {
        // if (req.user.role !== "offer") {
        //     errorFn('You are unauthorized', 401)
        // }

        const park = await Park.findOne({ where: { id: req.params.parkId } })
        if (!park) {
            errorFn('No such park', 400);
        }
        if (park.userId !== req.user.id) {
            errorFn('You have no permission to edit this park', 403)
        }

        const value = {
            name: req.body.name,
            address: req.body.address,
            maxSlot: req.body.maxSlot,
            priceRate: req.body.priceRate,
            minReserveTime: req.body.minReserveTime,
            isAvailable: req.body.isAvailable
        }
        const result = await Park.update(value, {
            where: {
                id: req.params.parkId
            }
        })
        res.status(201).json(result)
    } catch (err) { next(err) }
}

exports.updateParkImage = async (req, res, next) => {
    try {
        // if (req.user.role !== "offer") {
        //     errorFn('You are unauthorized', 401)
        // }

        const park = await Park.findOne({ where: { id: req.params.parkId } })
        if (!park) {
            errorFn('No such park', 400)
        }
        if (park.userId !== req.user.id) {
            errorFn('You have no permission to edit', 403)
        }

        const parkId = await Park.findOne({ where: { id: req.params.parkId } })
        const image = parkId.parkImage;
        const parkPublicId = image ? cloudinary.getPublicId(image) : null;

        if (!req.file) {
            errorFn('Park image is require', 400)
        }
        else {
            const parkImage = await cloudinary.upload(req.file.path, parkPublicId)
            await Park.update({ parkImage }, { where: { id: req.params.parkId } })
            res.status(201).json({ parkImage })
        }

    } catch (err) { next(err) }
}

exports.deletePark = async (req, res, next) => {
    try {
        // if (req.user.role !== "offer") {
        //     errorFn('You are unauthorized', 401)
        // }

        const park = await Park.findOne({ where: { id: req.params.parkId } })
        if (!park) {
            errorFn('No such park', 400)
        }
        if (park.userId !== req.user.id) {
            errorFn('You have no permission to remove this park', 403)
        }
        const result = await park.destroy();
        res.status(204).json(result);

    } catch (err) { next(err) }
}

exports.getPark = async (req, res, next) => {
    try {
        const park = await Park.findAll()
        res.status(200).json(park)
    } catch (err) { next(err) }
}


exports.getParkByOfferId = async (req, res, next) => {
    try {
        const park = await Park.findAll({ where: { userId: req.user.id } })
        res.status(200).json(park)
    } catch (err) { next(err) }
}
