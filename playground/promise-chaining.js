require("../src/db/mongoose");
const Task = require("../src/models/taskModel");

// Task.findByIdAndDelete("5ed8cbe2b5e21a0575942").then((result) => {
//     console.log(result);
//     return Task.countDocuments({ completed: false })
//         .then((count) => console.log(count))
//         .catch((error) => {
//             console.log(error);
//         });
// });

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});
    return (task, count);
};

deleteTaskAndCount("5eda159d28f62504f168ee8a").then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
});
