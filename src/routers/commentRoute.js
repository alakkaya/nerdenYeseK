import express from "express";
import * as authMiddleware from "../middlewares/authMiddleware.js"
import * as commentController from "../controllers/commentController.js"
const router = express.Router();

router
    .route("/createComment/:restaurantId")
    .post(authMiddleware.authenticateToken, commentController.createComment)
router
    .route("/updateComment/:id/")
    .put(authMiddleware.authenticateToken, commentController.updateComment)

router
    .route("/deleteComment/:id/:restaurantId")
    .delete(authMiddleware.authenticateToken, commentController.deleteComment)
router
    .route("/")
    .get(commentController.getAllComment)
router
    .route("/:restaurantId")
    .get(commentController.getCommentsForRestaurant)
router
    .route("/:userId")
    .get(commentController.getCommentsForUser)

router
    .route("/:id")
    .get(authMiddleware.verifySiteAdmin, commentController.getDetailComment)

router
    .route("/getCommentsWithImage/:restaurantId")
    .get(commentController.getCommentsIncludeImage)

router
    .route("/:id/like")
    .put(authMiddleware.authenticateToken, commentController.likeComment)
router
    .route("/:id/dislike")
    .put(authMiddleware.authenticateToken, commentController.dislikeComment)

export default router;