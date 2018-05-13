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
    }
})

const Auth = db.model('auth', AuthSchema)

module.exports = Auth;