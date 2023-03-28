import express from "express";
import * as authMiddleware from "../middlewares/authMiddleware.js"
import * as commentController from "../controllers/commentController.js"
const router = express.Router();

router
    .route("/createComment/:restaurantId")
    .post(authMiddleware.verifyAdmin, commentController.createComment)

router
    .route("/replyComment/:commentId/")
    .post(authMiddleware.verifyAdmin, commentController.replyComment)

router
    .route("/updateComment/:id/")
    .put(authMiddleware.verifyAdmin, commentController.updateComment)

router
    .route("/deleteComment/:id/:restaurantId")
    .delete(authMiddleware.verifyAdmin, commentController.deleteComment)

router
    .route("/")
    .get(authMiddleware.verifyAdmin, commentController.getAllComment)

router
    .route("/:id")
    .get(authMiddleware.verifyAdmin, commentController.getDetailComment)

router
    .route("/getCommentsWithImage/:restaurantId")
    .get(authMiddleware.verifyAdmin, commentController.getCommentsWithImage)

router
    .route("/:id/like")
    .put(authMiddleware.verifyAdmin, commentController.likeComment)
router
    .route("/:id/dislike")
    .put(authMiddleware.verifyAdmin, commentController.dislikeComment)


export default router;