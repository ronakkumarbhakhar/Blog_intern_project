const axios=require('axios');
const lodash=require('lodash');

let containsPrivacy=function(d){
    if(lodash.includes(d.title.toLowerCase(),"privacy")){
        return true;
    }
    return false; 
}


exports.statmiddleware=async function(req,res,next){
    try{
        let {data} = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', 
        {
            headers: {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        });
        data=data.blogs;
        // creating a key value pair named titleSize so that data can be sorted in asccending order of title length
        lodash.forEach(data,function(obj){obj.titleSize=lodash.size(obj.title)})
        // sorting the collection
        data=lodash.sortBy(data,function(d){return d.titleSize});
        // result object used for storing all analysis data
        let result={};
        result.count=lodash.size(data); //total number of blog 
        result.longestTitle=data[result.count-1]; // log with longest title
        result.containsPrivacy=lodash.filter(data, containsPrivacy); // all blogs that contain Privacy or privacy in title
        result.unique=lodash.uniqBy(data,'title');// all blogs with unique titles

        lodash.forEach(data,function(obj){delete obj.titleSize}) // removing titleSize from all blogs as it is no longer required
        req.result=result; // adding data to req
    }catch(error){
        let result={};
        result.error=error;
        req.result=result
    }finally{
        next();
    }
}