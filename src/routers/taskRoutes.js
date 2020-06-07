const express = require('express');
const router = new express.Router();
const Task = require('../models/taskModel');
const auth = require('../middleware/authentication');
require('../models/userModel');
const mongoose = require("mongoose");

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        return res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks", auth, async (req, res) => {
    try {
        const tasks = await Task.find({owner:req.user._id});
        if (!tasks) {
            return res.status(404).send("No tasks found");
        }
        res.send(tasks);
    } catch (error) {
        res.status(500).send();
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) {
            return res.status(404).send("No task with that id found");
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch("/tasks/:id", auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpadtes = ['description','completed'];
    const isValidUpdate = updates.every((update) => allowedUpadtes.includes(update));
    
    if(!isValidUpdate){
        res.status(400).send({
            error: 'Invalid update property'
        });
    }

    try {
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send("No task with that id found");
        }
        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/tasks/:id", auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            res.status(400).send("No task found with that id");
        }
        res.send(task);
    } catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;