const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/userModel");
const {UserOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "Rishabh",
            email: "rishabhmthakur2@gmail.com",
            password: "DragonWar@123",
        })
        .expect(201);

    const user = await User.findById(response.body.user._id);

    expect(user).not.toBe(null);

    expect(response.body).toMatchObject({
        user: {
            name: "Rishabh",
            email: "rishabhmthakur2@gmail.com",
        },
    });
});

test("Should login existing user", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: UserOne.email,
            password: UserOne.password,
        })
        .expect(200);
    const user = await User.findById(UserOne._id);
    expect(user.tokens[1].token).toBe(response.body.token);
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
    const user = await User.findById(UserOne._id);
    expect(user).toBe(null);
});

test("Should not delete account for unauthenticated user", async () => {
    await request(app).delete("/users/me").send().expect(401);
});

test("Should upload Avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${UserOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg");
    const user = await User.findById(UserOne._id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${UserOne.tokens[0].token}`)
        .send({
            name: "Rishabh Thakur",
        })
        .expect(200);
    expect(UserOne.name).not.toBe(response.body.name);
});

test("Should not update invalid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${UserOne.tokens[0].token}`)
        .send({
            location: "Delhi",
        })
        .expect(400);
});
