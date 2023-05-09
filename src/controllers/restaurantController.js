import Restaurant from "../models/restaurantModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

const createRestaurant = async (req, res) => {
    const { name } = req.body;
    const existingRestaurant = await Restaurant.findOne({ name });

    let imageUrl = null;
    let imageId = null;

    if (req.files && req.files.image) {
        const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            {
                use_filename: true,
                folder: "restaurantPhotos"
            })
        imageUrl = result.secure_url;
        imageId = result.public_id;
    }

    try {
        if (!existingRestaurant) {
            const restaurant = await Restaurant.create({
                ...req.body,
                imageUrl,
                imageId,
            });

            if (req.files && req.files.image) {
                fs.unlinkSync(req.files.image.tempFilePath)
            }

            res.status(201).json({ success: true, restaurant });
        } else {
            return res.status(400).json({
                success: false,
                message: "The restaurant is already created."
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};


const getAllRestaurants = async (req, res) => {

    try {
        const restaurants = await Restaurant.find({});
        if (restaurants) {
            return res.status(200).json({
                success: true,
                length: restaurants.length,
                restaurants
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "Restaurants are not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        })
    }
}

const getARestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById({ _id: req.params.id })

        res.status(200).json({ success: true, restaurant })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        })
    }
}

const updateRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId)

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "The restaurant was not found"
            })
        }
        if (restaurant.createdBy.toString() !== req.user.id || !req.user.isRestaurantAdmin) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this restaurant"
            })
        }
        const updatedRestaurant = await Restaurant.findOneAndUpdate({ _id: restaurantId }, { $set: req.body }, { new: true })
        return res.status(200).json({
            success: true,
            message: "Your restaurant has been updated",
            updatedRestaurant
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Restaurant couldn't updated" + error
        })
    }
}

const deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId)

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "The restaurant was not found"
            })
        }
        if (restaurant.createdBy.toString() !== req.user.id || !req.user.isRestaurantAdmin) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this restaurant"
            })
        }
        await restaurant.remove()
        return res.status(200).json({
            success: true,
            message: "Your restaurant has been deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Restaurant couldn't deleted" + error
        })
    }
}

// filtreler için
//şu kategoriden şu kadar restaurant
const categoryByCount = async (req, res) => {
    try {
        const Pizza = await Restaurant.countDocuments({ category: "Pizza" })
        const Kebap = await Restaurant.countDocuments({ category: "Kebap" })
        const Lahmacun = await Restaurant.countDocuments({ category: "Lahmacun" })
        const ÇiğKöfte = await Restaurant.countDocuments({ category: "ÇiğKöfte" })
        const Tatlı = await Restaurant.countDocuments({ category: "Tatlı" })
        const Hamburger = await Restaurant.countDocuments({ category: "Hamburger" })
        const Sushi = await Restaurant.countDocuments({ category: "Sushi" })

        res.status(200).json([
            { category: "Pizza", count: Pizza },
            { category: "Kebap", count: Kebap },
            { category: "Lahmacun", count: Lahmacun },
            { category: "ÇiğKöfte", count: ÇiğKöfte },
            { category: "Tatlı", count: Tatlı },
            { category: "Hamburger", count: Hamburger },
            { category: "Sushi", count: Sushi },
        ])
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        })
    }
}
//eklenecek
const addFavoriteThisRestaurant = async (req, res) => {
    const userId = req.user.id;

    try {

    } catch (error) {
        return res.status(500).json({ success: false, error })
    }


}



//şu şehirdeki bu kategorideki restaurantlar
const categoryByCity = async (req, res) => {
    try {
        const cities = req.query.cities.split(",");

        const restaurant = await Promise.all(
            cities.map((city) => {
                return Restaurant.countDocuments({ city: city })
            })
        )

        res.status(200).json(hotel)

    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        })
    }
}

export {
    createRestaurant,
    getAllRestaurants,
    getARestaurant,
    updateRestaurant,
    deleteRestaurant,
    addFavoriteThisRestaurant,
    categoryByCount,
    categoryByCity
}