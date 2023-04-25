import express from "express";
import * as restaurantController from "../controllers/restaurantController.js"
import * as authMiddleware from "../middlewares/authMiddleware.js"



const router = express.Router()

router
    .route("/create")
    .post(authMiddleware.verifyAdmin, restaurantController.createRestaurant)

router
    .route("/getAllRestaurants")
    .get(restaurantController.getAllRestaurants)

router
    .route("/:id")
    .get(restaurantController.getARestaurant)
    .put(authMiddleware.verifyAdmin, restaurantController.updateRestaurant)
    .delete(authMiddleware.verifyAdmin, restaurantController.deleteRestaurant)

router
    .route("/categoryByCount")
    .get(restaurantController.categoryByCount)
router
    .route("/categoryByCity")
    .get(restaurantController.categoryByCity)

export default router;