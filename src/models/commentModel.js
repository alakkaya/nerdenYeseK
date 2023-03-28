//foto text star etkileşim((yorum bepenme )), date , fotolara true false ekle...
import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    repliedAt: {
        type: Date,
        default: Date.now
    }
});

const commentSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    commentedAt: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    },
    starForRestaurant: {
        type: Number,
        min: 0,
        max: 5
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    replies: [replySchema]

}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema)

export default Comment;