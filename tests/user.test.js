const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const User = require("../src/models/userModel");
const mongoose = require("mongoose");

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

beforeEach(async () => {
    await User.deleteMany();
    await new User(UserOne).save();
});

test("Should signup a new user", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "Rishabh",
            email: "rishabhmthakur2@gmail.com",
            password: "DragonWar@123",
        })
        .expect(201);
});

test("Should login existing user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: UserOne.email,
            password: UserOne.password,
        })
        .expect(200);
});

test("Failure for login of non-existent user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: "rishabhmthakur96@gmail.com",
            password: "123",
        })
        .expect(400);
});

test("Should get user profile", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${UserOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
    await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${UserOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should not delete account for unauthenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401);
});
