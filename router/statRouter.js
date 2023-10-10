const express = require('express')
const handler=require('../controller/statHandler');
const {statmiddleware}= require('../middleware/statMiddleware');

const Router = express.Router()

Router.use(statmiddleware);
Router.get('/',handler);

module.exports=Router;