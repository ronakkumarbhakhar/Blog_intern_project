const axios=require('axios');
const lodash=require('lodash');

let searchQuery=function(d,word){
    if(lodash.includes(d.title.toLowerCase(),word.toLowerCase())){
        return true;
    }
    return false; 
}


exports.searchmiddleware=async function(req,res,next){
    try{
        let {data} = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', 
        {
            headers: {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        })
        data=data.blogs;
        let search=req.query.query;   
        // result object used for storing all analysis data
        let result={};
        result=lodash.filter(data,function(d){return searchQuery(d,search)}); // all blogs that contain specific word (word we are quering for) in title
        req.result=result; // adding data to req 
    }
    catch(error){
        let result={}
        result.error=error;
        req.result=result;
    }
    finally{
        next();
    }
}