const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router =express.Router();

router.post('/tasks', auth, async (req,res) =>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try{
        await task.save();
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
});

// ---------------------------------------

// Fetching resourses



// Tasks
// GET tasks?completed=true
// GET tasks?limit=3&skip=0
// GET tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) =>{
    const match = {}
    const sort = {}
    
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        // const task = await Task.find({ owner: req.user._id});
        const tasks =await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
                // sort: {
                //     createdAt:  1// Ascending order is 1 Descending order is -1 
                // }
            }
        }).execPopulate();
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send();
    } // by passing an empty object you'll get all the users in database

})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        const task = await Task.findOne({ _id: _id, owner: req.user._id });
        console.log(task)
        if(!task) {
            res.status(404).send();
        }
        res.send(task);
    }
    catch(e){
        res.status(404).send(e);
    }
});

// Updating Resources 



router.patch('/tasks/:id', auth, async (req, res) => {
    
    const updates = Object.keys(req.body);
    const allowedUpdate = ['description', 'completed'];
    
    const isValidOperator = updates.every( (update) => {
        return allowedUpdate.includes(update)
    })
    
    if(!isValidOperator) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }

    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        
        if(!task){ 
            return res.status(404).send();
        } 
        updates.forEach(update => task[update] = req.body[update])
        await task.save();
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        
        res.send(task)
    }
    catch(e){
        res.status(400).send(e);
    }
});

// Deleting Resources


router.delete('/tasks/:id', auth, async(req,res) => {
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if(!task){
            return res.status(404).send();
        }

        res.send(task)
    }
    catch(e){
        res.status(500).send();
    }
});

module.exports = router;