const express = require('express');
const statRouter=require('./router/statRouter');
const searchRouter=require('./router/searchRouter');
const cors=require('cors')
const app= express();

app.use(express.json());
app.use(cors());

app.use('/api/blog-stats',statRouter);
app.use('/api/blog-search',searchRouter);

app.listen(3000,()=>{
    console.log('server is running on port 3000:')
})

