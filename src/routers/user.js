const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account');


const router =express.Router();

router.post('/users', async (req, res) =>{
    const user = new User(req.body);
    try{
        await user.save();
        sendWelcomeEmail(user.name, user.email)
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token});
    }
    catch(e){
        res.status(500).send(e);
    }
});
router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    }
    catch(e) {
        res.status(400).send(e);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token; 
        })
        await req.user.save();

        res.send();
    }
    catch(e) {
        res.status(500).send(e);
    }
});

router.post('/users/logoutall', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    }
    catch(e){
        res.status(500).send();
    }
})

router.get('/getusers', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    }
    catch(e) {
        res.status(400).send(e);
    }
})



router.get('/users/me', auth, async (req, res) =>{
   res.send(req.user);
    // try{
    //     const users = await User.find({});
    //     res.status(200).send(users)
    // }
    // catch{
    //     res.status(500).send(e);
    // } // by passing an empty object you'll get all the users in database

})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const user = await User.findById(_id)
            if(!user) {
                return res.status(404).send();
            }
            res.send(user);
        }
    catch(e){
        res.status(404).send(e);
    }
})
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    // console.log(updates);
    const allowedUpdate = ['Name', 'email', 'password','age'];
    const isValidOperator = updates.every( (update) => {
        return allowedUpdate.includes(update)
    })
    console.log(isValidOperator);
    if(!isValidOperator) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }
    try{
        console.log('inside try block')
        // const _id = req.params.id;
        // const user = await User.findById(_id);
        // console.log(user);
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // if(!user){
        //     return res.status(404).send();
        // } 
        res.send(req.user);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async(req,res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user){
        //     return res.status(404).send();
        // }
        sendCancelationEmail(req.user.name, req.user.email)
        await req.user.remove();
        res.send(req.user);
    }
    catch(e){
        res.status(500).send();
    }
});

const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // cb(new Error('File must be a PDF!'))
        // cb(undefined, true)
        // cb(undefined, false)
        // if(!file.originalname.endsWith('.pdf')) {
        //     return cb(new Error('File extension must be pdf!'))
        // }
        // cb(undefined, true);
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image!'))
        }
        cb(undefined, true);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar') , async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ height: 400, width: 400 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('okay')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send(200);
})
router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }
            res.set('Content-Type','image/jpg')
            res.send(user.avatar)
    }
    catch(e) {
        res.status(404).send(e)
    }
})

module.exports = router;