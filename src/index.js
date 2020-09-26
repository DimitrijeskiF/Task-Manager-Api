const express = require('express');
require('./db/mongoose.js');

const app = express();
const port = process.env.PORT;
const userRouter = require('./routers/user.js');
const taskRouter = require('../src/routers/task.js');



app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is running on ' + port);
})


