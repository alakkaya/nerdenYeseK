import express from "express";
import * as restaurantController from "../controllers/restaurantController.js"
import * as authMiddleware from "../middlewares/authMiddleware.js"



const router = express.Router()

router
    .route("/create")
    .post(authMiddleware.checkUser, restaurantController.createRestaurant)

router
    .route("/")
    .get(restaurantController.getAllRestaurants)

router
    .route("/:id")
    .get(restaurantController.getARestaurant)
    .put(authMiddleware.checkUser, restaurantController.updateRestaurant)
    .delete(authMiddleware.verifyUserOrAdmin, restaurantController.deleteRestaurant)

router
    .route("/categoryByCount")
    .get(restaurantController.categoryByCount)
router
    .route("/categoryByCity")
    .get(restaurantController.categoryByCity)

export default router;