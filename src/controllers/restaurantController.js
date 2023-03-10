import Restaurant from "../models/restaurantModel.js";

const createRestaurant = async (req, res) => {
    try {
        const { name } = req.body
        const existingRestaurant = await Restaurant.findOne({ name })
        if (!existingRestaurant) {
            const restaurant = await Restaurant.create(req.body)
            res.status(201).json({ success: true, restaurant: restaurant._id, restaurant })
        } else {
            return res.status(400).json({
                success: false,
                message: "The restaurant is already created."
            })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({})
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
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true })

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
        const deletedRestaurant = await Restaurant.findByIdAndRemove(req.params.id)

        return res.status(200).json({
            success: true,
            message: "Your restaurant has been deleted",
            deletedRestaurant
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Restaurant couldn't deleted" + error
        })
    }
}


export {
    createRestaurant,
    getAllRestaurants,
    getARestaurant,
    updateRestaurant,
    deleteRestaurant
}