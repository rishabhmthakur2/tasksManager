const express = require("express");
require("./db/mongoose");
const User = require("./models/userModel.js");
const Task = require("./models/taskModel.js");
const userRouter = require('./routers/userRoutes');
const taskRouter = require('./routers/taskRoutes');


const app = express();
const port = process.env.PORT || 5000;

// app.use((req, res, next)=> {
//     res.status(503).send('Site under maintenance!');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server listening on port: " + port);
});

