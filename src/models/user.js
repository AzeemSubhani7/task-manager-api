const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');
const { Binary } = require('mongodb');

const userSchema =new mongoose.Schema(
    {
    name: {
    type: String,
    trim: true  
    },
    email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
        if(!validator.isEmail(value)){
            throw new Error("Not an email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim : true,
        minlength: 7,
        validate(value) {
        if(value.includes('password')){
            throw new Error("Password cannot contain password!");
            }
        }
    },
    age: {
        type: Number,
        default: 18
},  
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id:user._id.toString() }, process.env.SECRET);
    
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error('Unable to login!');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Unable to login!');
    }

    return user;
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    // if user is created and password is one of the things that has changed!
    if (user.isModified('password')) { //this will be true when user is first created!
        user.password = await bcrypt.hash(user.password, 8);
    }

    next(); //
})
userSchema.pre('remove', async function(next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;