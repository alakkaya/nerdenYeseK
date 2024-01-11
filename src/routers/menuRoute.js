import express from "express";
import * as menuController from "../controllers/menuController.js"
import * as authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router({ mergeParams: true })


router
    .route("/createMenu/:restaurantId")
    .post(authMiddleware.verifyRestaurantAdmin, menuController.createMenu)

router
    .route("/updateMenu/:id/:restaurantId")
    .put(authMiddleware.verifyRestaurantAdmin, menuController.updateMenu)

router
    .route("/deleteMenu/:id/:restaurantId")
    .delete(authMiddleware.verifyRestaurantAdmin, menuController.deleteMenu)

router
    .route("/")
    .get(menuController.getAllMenu)

router
    .route("/:id")
    .get(menuController.getDetailMenu)






export default router;