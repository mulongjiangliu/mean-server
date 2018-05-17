const mongoose = require('mongoose');
const db = require('../core/mongoose');

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    profile: [ProfileSchema]
});

const ProfileSchema = new mongoose.Schema({
    nickname: String,
    gender: Number,
    age: Number,
    region: String,
    whatsup: String,
});

const Auth = db.model('auth', AuthSchema)

module.exports = Auth;