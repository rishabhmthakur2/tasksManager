const express = require("express");
const router = new express.Router();
const User = require("../models/userModel");
const auth = require("../middleware/authentication");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        if (
            file.originalname.endsWith(".jpg") ||
            file.originalname.endsWith(".jpeg") ||
            file.originalname.endsWith(".png")
        ) {
            return callback(undefined, true);
        } else {
            return callback(new Error("Please upload an image file."));
        }
    },
});

router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpadtes = ["name", "password", "email", "age"];
    const isValidUpdate = updates.every((update) =>
        allowedUpadtes.includes(update)
    );

    if (!isValidUpdate) {
        res.status(400).send({
            error: "Invalid update property",
        });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/users/logoutFromAllDevices", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post(
    "/users/me/avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        if (error) {
            res.status(400).send({ error: error.message });
        }
    }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error({ message: "No user find with that id" });
        }
        if (!user.avatar) {
            throw new Error({ message: "No avatar set by user" });
        }
        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send(error);
    }
});

module.exports = router;
