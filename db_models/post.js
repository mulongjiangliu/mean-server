const mongoose = require('mongoose');
const db = require('../core/mongoose');
const {ObjectId} = mongoose.Schema.Types;

const CommentSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "Auth"
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const PostSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "Auth"
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    comments: [CommentSchema]
}, {
    timestamps: true,
});


const Post = db.model('Post', PostSchema);
const Comment = db.model("Comment", CommentSchema);

module.exports = Post;