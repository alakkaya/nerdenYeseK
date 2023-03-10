import express from "express";
import * as restaurantController from "../controllers/restaurantController.js"

const router = express.Router()

router
    .route("/create")
    .post(restaurantController.createRestaurant)

router
    .route("/")
    .get(restaurantController.getAllRestaurants)
router
    .route("/:id")
    .get(restaurantController.getARestaurant)
    .put(restaurantController.updateRestaurant)
    .delete(restaurantController.deleteRestaurant)

export default router;