const express=require('express');
const app=express();
const PORT=process.env.PORT || 3300;

app.use(express.json());

let tasks=[];
let current_id=1;

app.get('/tasks',(req, res)=>{
    const page=Number(req.query.page)||1;
    const limit=Number(req.query.limit)||5;
    const skip=(page-1)*limit;
    const paginated_tasks=tasks.slice(skip,skip+limit);
    res.json(paginated_tasks);
});

app.get('/tasks/:id',(req,res)=>{
    const task=tasks.find(task =>task.id===parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({Error:'Task not found'});
    }
    res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
    const {title,description}=req.body;
    if (!title || !description) {
        return res.status(400).json({Error:'Title and description are required'});
    }
    const newTask={ id:current_id++,title,description};
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id',(req, res)=>{
    const {title,description}=req.body;
    if (!title || !description){
        return res.status(400).json({Error:'Title and description are required'});
    }
    const taskIndex=tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({Error:'Task not found'});
    }
    tasks[taskIndex]={id:parseInt(req.params.id),title,description};
    res.status(200).json(tasks[taskIndex]);
});

app.delete('/tasks/:id',(req,res)=>{
    const taskIndex=tasks.findIndex(task=> task.id===parseInt(req.params.id));
    if(taskIndex===-1){
        return res.status(404).json({ Error:'Task not found' });
    }
    tasks.splice(taskIndex,1);
    res.status(204).json({message:"task deleted successfully!"});
});

app.use((err, req, res, next)=>{
    console.Error(err.stack);
    res.status(500).json({Error:'Something went wrong!'});
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
