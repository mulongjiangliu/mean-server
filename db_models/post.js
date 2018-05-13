const mongoose = require('mongoose');
const db = require('../core/mongoose');

const CommentSchema = new mongoose.Schema({
    user: String,
    dateStamp: Date,
    comment: String,
})

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },    
    createdAt: {
        type: Date,
        default: Date.now
    },
    description: String,
    content: String,
    comments: [CommentSchema]
});

const Post = db.model('post', PostSchema);

module.exports = Post;