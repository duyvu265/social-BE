import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    icon: {
        type: String, // Hoặc có thể sử dụng một kiểu khác nếu bạn muốn lưu trữ nhiều thông tin hơn
        default: null,
    },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: {
        type: [commentSchema], 
    },
    showLikes: {
        type: Boolean,
        default: true,
    },
    showComments: {
        type: Boolean,
        default: true,
    },
    location: String,
    description: String,
    postImage: {
        type: [String],
        default: [],
    },
    userProfilePhoto: String,
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
