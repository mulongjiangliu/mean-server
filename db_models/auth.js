const mongoose = require('mongoose');
const db = require('../core/mongoose');

const AuthSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        default: ""
    },
    protrait: {
        type: Buffer,
        default: new Buffer(0)
    },
    age: {
        type: Number,
        default: 0,
        min: 0,
        max: 130
    },
    gender: {
        type: Number,
        default: 0, // 0 for unkown, 1 for man, 2 for woman
        min: 0
    }, 
    region: {
        type: String,
        default: ""
    },
    whatsup: {
        type: String,
        default: ""
    },
});

const Auth = db.model('Auth', AuthSchema)

module.exports = Auth;