const express = require('express');
require('./db/mongoose'); //by doing this it will run this file xD

const Task = require('./models/task');
const User = require('./models/user');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task')


const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//     res.status(502).send("Cant give you task router")
// })
app.use(express.json()); // automatically parse incoming json to an object so we can access it
app.use(userRouter);
app.use(taskRouter);



app.listen(port, () => console.log('Server is running on '+ port));

const bcrypt = require('bcryptjs');
const { findById } = require('./models/task');

// const myFunction = async () => {
//     const password = "Azeem-Subhani"
//     const hashedPassword = await bcrypt.hash(password, 8);

//     console.log(password);
//     console.log(hashedPassword);

//     const isMatch = await bcrypt.compare('Azeem-Subhani',hashedPassword);
//     console.log(isMatch);
// }
// myFunction();

const myFunction = async () => {
    const user = await User.findById('60bfad61038a0f4f90d08cad');
    console.log(user);
    console.log('--------------------');
    await user.populate('tasks').execPopulate()
    console.log(user.tasks);
}
// myFunction()