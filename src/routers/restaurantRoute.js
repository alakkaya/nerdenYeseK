import express from "express";
import * as restaurantController from "../controllers/restaurantController.js"
import * as authMiddleware from "../middlewares/authMiddleware.js"



const router = express.Router()

router
    .route("/create")
    .post(restaurantController.createRestaurant)

router
    .route("/")
    .get(restaurantController.getAllRestaurants)

router
    .route("/search")
    .get(restaurantController.searchRestaurants)
//for frontend => http://localhost:5000/restaurants/search?keyword=kebap 
router
    .route("/:id")
    .get(restaurantController.getARestaurant)
    .put(authMiddleware.authenticateToken, restaurantController.updateRestaurant)
    .delete(authMiddleware.authenticateToken, restaurantController.deleteRestaurant)

router
    .route("/:id/addFavorite")
    .put(authMiddleware.authenticateToken, restaurantController.addFavoriteThisRestaurant)

router
    .route("/categoryByCount")
    .get(restaurantController.categoryByCount)
router
    .route("/categoryByCity")
    .get(restaurantController.categoryByCity)

export default router;