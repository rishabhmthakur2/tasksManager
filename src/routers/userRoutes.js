const express = require('express');
const router = new express.Router();
const User = require('../models/userModel');
const auth = require('../middleware/authentication');

router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("No user with that id found");
        }
        return res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpadtes = ['name','password','email','age'];
    const isValidUpdate = updates.every((update) => allowedUpadtes.includes(update));
    
    if(!isValidUpdate){
        res.status(400).send({
            error: 'Invalid update property'
        });
    }

    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update)=> user[update] = req.body[update]);

        await user.save();

        if(!user){
            return res.status(404).send("No user with that id found");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/users/:id", async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.params.id);
        if(!user){
            res.status(400).send("No user found with that id");
        }
        res.send(user);
    } catch(error){
        res.status(500).send(error);
    }
});

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(error){
        res.status(400).send(error);
    }
});

router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send();
    } catch(error){
        res.status(500).send();
    }
});

router.post('/users/logoutFromAllDevices', auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch(error){
        res.status(500).send();
    }
});

module.exports = router;

