const express = require("express");
require("./db/mongoose");
const userRouter = require('./routers/userRoutes');
const taskRouter = require('./routers/taskRoutes');
const multer = require('multer');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server listening on port: " + port);
});

