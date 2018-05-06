const mongoose = require('mongoose');
const db = require('../Services/mongoose');

const CommentSchema = new mongoose.Schema({
    user: String,
    dateStamp: Date,
    comment: String,
})

const PostSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    author: {
        type: String,
        required: true
    },
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    description: String,
    comments: [{
        user: String,
        dateStamp: Date,
        comment: String,
    }]
});

const Post = db.model('post', PostSchema);

module.exports = Post;