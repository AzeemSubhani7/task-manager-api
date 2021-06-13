const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
}).then( () => console.log('Database Connected'))
    .catch(e => console.log(e))


const Task = mongoose.model('Task',{
    description: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// const me = new User({
//     Name: 'Woody',
//     email: 'xyz@gmail.com',
//     password:'helloxDlmao',
//     age: 22
// })

// // me.save()
// //     .then(result => {console.log(result)})
// //     .catch(error => {console.log(error)});


// const task = new Task({
//     description: 'Maturbate with soap'
// });

// // task.save()
// //     .then(result => {console.log(result)})
// //     .catch(error => {console.log(error)})