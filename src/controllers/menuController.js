import Restaurant from "../models/restaurantModel.js";
import Menu from "../models/menuModel.js"

const createMenu = async (req, res, next) => {
    const restaurantId = req.params.restaurantId
    const userId = req.user.id;

    try {
        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            createdBy: userId
        });

        if (!restaurant) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized to perform this action" });
        }

        const menu = await Menu.create({
            ...req.body,
            restaurant: restaurantId
        });

        await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $push: { menu: menu._id } },
            { new: true }
        );

        res.status(201).json(menu);
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const updateMenu = async (req, res, next) => {
    const menuId = req.params.id;
    const restaurantId = req.params.restaurantId;
    const userId = req.user.id; // get the user ID from the authentication middleware

    try {
        // check if the user is the owner of the restaurant
        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            createdBy: userId
        });

        if (!restaurant) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized to perform this action" });
        }

        const menuItem = req.body.products;

        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId,
            { $push: { products: menuItem } },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Menu item added successfully", updatedMenu });

    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};


const deleteMenu = async (req, res, next) => {
    const menuId = req.params.id;
    const restaurantId = req.params.restaurantId;
    const userId = req.user.id; // get the user ID from the authentication middleware

    try {
        // check if the user is the owner of the restaurant
        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            createdBy: userId
        });

        if (!restaurant) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized to perform this action" });
        }

        await Menu.findByIdAndDelete(menuId);

        await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $pull: { menu: menuId } }
        );

        res.status(200).json({ success: true, message: "The menu deleted succesfully." });
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
}

const getDetailMenu = async (req, res, next) => {
    try {
        const menu = await Menu.findById(req.params.id)

        res.status(200).json({ success: true, menu })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const getAllMenu = async (req, res, next) => {
    try {
        const menu = await Menu.find({})

        res.status(200).json({ success: true, menu })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}



export {
    createMenu,
    updateMenu,
    deleteMenu,
    getDetailMenu,
    getAllMenu
}