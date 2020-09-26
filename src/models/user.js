const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jtw = require('jsonwebtoken');
const Task = require('../models/task')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Enter correct email!')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Password should not contain the word "password"!')

            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Ages must be greater then 0!')
            }
        }
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
},
{
    timestamps: true
})

userSchema.pre('save', async function (next) {
    user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
})

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id})
    next();
})


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })

    if (!user) {
        throw new Error('Unable to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login!')
    }

    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jtw.sign({ _id: user._id.toString() }, process.env.JTW_SECRET);
    user.tokens = user.tokens.concat({ token: token })

    await user.save()
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


const User = mongoose.model('User', userSchema);

module.exports = User