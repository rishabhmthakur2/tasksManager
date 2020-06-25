const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/userModel");

const userOneId = new mongoose.Types.ObjectId();

const UserOne = {
    _id: userOneId,
    name: "Rishabh",
    email: "rishabhmthakur@outlook.com",
    password: "DragonWar@123",
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
        },
    ],
};

const setupDatabase = async() =>{
    await User.deleteMany();
    await new User(UserOne).save();
}

module.exports = {
    userOneId,
    UserOne,
    setupDatabase
}