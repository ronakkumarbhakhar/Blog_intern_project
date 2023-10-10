const handler= function(req,res){
    // console.log(req.result.count);
    // console.log(req.result.privacy);
    res.json(req.result);
}

module.exports= handler;