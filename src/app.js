const express = require("express");
require("./db/mongoose");
const userRouter = require('./routers/userRoutes');
const taskRouter = require('./routers/taskRoutes');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
