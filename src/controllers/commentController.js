import mongoose from "mongoose";
import Comment from "../models/commentModel.js";
import Restaurant from "../models/restaurantModel.js";
import User from "../models/userModel.js"
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
// sadce oluşturan k.şiş dılında admnler reestgüncellesin.
// siye yöneci ve rest sahibi içn ayrı ayrı  kaç kişi ziyaret topla kullanıcı ,,, son 30 gün istatistikler ,,, şifre resetleme endpointi falan oluştur.
const createComment = async (req, res) => {
    const restaurantId = req.params.restaurantId
    const userId = req.user.id;
    const user = await User.findById(userId)
    const restaurant = await Restaurant.findById(restaurantId)

    let imageUrl = null;
    let imageId = null;

    if (req.files && req.files.image) {
        const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            {
                use_filename: true,
                folder: "comments"
            })
        imageUrl = result.secure_url;
        imageId = result.public_id;
    }

    try {
        const comment = await Comment.create({
            text: req.body.text,
            starForRestaurant: req.body.starForRestaurant,
            imageUrl,
            imageId,
            createdBy: userId,
            restaurant: restaurantId,
            createdByName: user.name,
            createdBySurname: user.surname,
            //createdByFollowers: user.followers
            restaurantName: restaurant.name
        })

        await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $push: { comments: comment._id } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            userId,
            { $push: { comments: comment._id } },
            { new: true }
        );

        //Update restaurant rating
        await restaurant.updateRating();

        if (req.files && req.files.image) {
            fs.unlinkSync(req.files.image.tempFilePath)
        }

        res.status(201).json({ success: true, data: comment })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error })
    }
}

//can update only text and star not can't change image
const updateComment = async (req, res) => {
    const commentId = req.params.id
    const userId = req.user.id;

    try {
        const comment = await Comment.findOne({
            _id: commentId,
            createdBy: userId
        })
        if (!comment) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized to perform this action" });
        }
        const newText = req.body.text;
        const newStar = req.body.starForRestaurant;

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { $set: { text: newText, starForRestaurant: newStar } }, { new: true })

        res.status(201).json({ success: true, newData: updatedComment })

    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const deleteComment = async (req, res) => {
    const commentId = req.params.id
    const restaurantId = req.params.restaurantId;
    const userId = req.user.id;

    try {
        const comment = await Comment.findOne({
            _id: commentId,
            createdBy: userId
        })
        if (!comment) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized to perform this action" });
        }
        await Comment.findByIdAndDelete(commentId);

        await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $pull: { comments: commentId } }
        )
        //new:true ?
        await User.findByIdAndDelete(
            userId,
            { $pull: { comments: commentId } }
        );

        res.status(201).json({ success: true, message: "The comment deleted succesfully." })

    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const getDetailComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)

        res.status(200).json({ success: true, comment })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const getAllComment = async (req, res) => {
    try {
        const comment = await Comment.find({})

        res.status(200).json({ success: true, comment })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const getCommentsForRestaurant = async (req, res) => {
    try {
        const comment = await Comment.find({ restaurant: req.params.restaurantId })

        res.status(200).json({ success: true, comment })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const getCommentsForUser = async (req, res) => {
    try {
        const comment = await Comment.find({ createdBy: req.params.userId })

        res.status(200).json({ success: true, comment })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const getCommentsIncludeImage = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const restaurantObjectId = mongoose.Types.ObjectId(restaurantId);
    try {
        const comments = await Comment.find({
            restaurant: restaurantObjectId,
            imageUrl: { $ne: null },
        });
        if (comments.length === 0) {
            return res.status(200).json({ success: true, message: "No comments found" });
        }
        res.status(200).json({ success: true, comments });
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};



const likeComment = async (req, res) => {
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(req.params.id).populate("likes").populate("dislikes");

        if (!comment) {
            return res
                .status(404)
                .json({ success: false, message: "Comment not found." });
        }

        const likes = comment.likes.map(like => like.id);
        const dislikes = comment.dislikes.map(dislike => dislike.id);

        if (dislikes.includes(userId)) {
            await Comment.findByIdAndUpdate(
                { _id: req.params.id },
                { $pull: { dislikes: userId } },
                { new: true }
            );
        }

        if (!likes.includes(userId)) {
            await Comment.findByIdAndUpdate(
                { _id: req.params.id },
                { $push: { likes: userId } },
                { new: true }
            );
            res.status(200).json({ success: true, message: "The comment was liked." });
        } else {
            await Comment.findByIdAndUpdate(
                { _id: req.params.id },
                { $pull: { likes: userId } },
                { new: true }
            );
            res.status(200).json({ success: true, message: "You get back the liked" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};

const dislikeComment = async (req, res) => {
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(req.params.id).populate("likes").populate("dislikes");

        if (!comment) {
            return res
                .status(404)
                .json({ success: false, message: "Comment not found." });
        }

        const likes = comment.likes.map(like => like.id);
        const dislikes = comment.dislikes.map(dislike => dislike.id);

        if (likes.includes(userId)) {
            await Comment.findByIdAndUpdate(
                { _id: req.params.id },
                { $pull: { likes: userId } },
                { new: true }
            );
        }

        if (!dislikes.includes(userId)) {
            await Comment.findByIdAndUpdate(
                { _id: req.params.id },
                { $push: { dislikes: userId } },
                { new: true }
            );
            res.status(200).json({ success: true, message: "The comment was disliked." });
        } else {
            await Comment.findByIdAndUpdate(
                { _id: req.params.id },
                { $pull: { dislikes: userId } },
                { new: true }
            );
            res.status(200).json({ success: true, message: "You have get back your dislike" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};





export {
    createComment,
    updateComment,
    deleteComment,
    getDetailComment,
    getAllComment,
    getCommentsForRestaurant,
    getCommentsForUser,
    getCommentsIncludeImage,
    likeComment,
    dislikeComment,

};