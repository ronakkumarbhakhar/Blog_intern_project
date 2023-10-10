const express = require('express')
const handler = require('../controller/searchHandler')
const {searchmiddleware}=require('../middleware/searchMiddleware')

const Router = express.Router();

Router.use(searchmiddleware)
Router.get('/',handler);

module.exports =Router;