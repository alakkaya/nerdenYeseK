//foto text star etkileşim((yorum bepenme )), date , fotolara true false ekle...
import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
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
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    replies: [replySchema]

}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema)

export default Comment;