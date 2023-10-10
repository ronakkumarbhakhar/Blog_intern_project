const express = require('express');
const statRouter=require('./router/statRouter');
const searchRouter=require('./router/searchRouter');
const cors=require('cors');
require('dotenv').config()
const app= express();

app.use(express.json());
app.use(cors());

app.use('/api/blog-stats',statRouter);
app.use('/api/blog-search',searchRouter);

let PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is running on port:${PORT}`);
})

