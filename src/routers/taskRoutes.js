const express = require('express');
const router = new express.Router();
const Task = require('../models/taskModel');

router.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        return res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        if (!tasks) {
            return res.status(404).send("No tasks found");
        }
        res.send(tasks);
    } catch (error) {
        res.status(500).send();
    }
});

router.get("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send("No task with that id found");
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch("/tasks/:id", async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpadtes = ['description','completed'];
    const isValidUpdate = updates.every((update) => allowedUpadtes.includes(update));
    
    if(!isValidUpdate){
        res.status(400).send({
            error: 'Invalid update property'
        });
    }

    try {
        const task = await Task.findById(req.params.id);
        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();
        
        if(!task){
            return res.status(404).send("No task with that id found");
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/tasks/:id", async (req, res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            res.status(400).send("No task found with that id");
        }
        res.send(task);
    } catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;