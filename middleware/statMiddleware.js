const axios=require('axios');
const _=require('lodash');



//  getAnalyticData() function is passed to _.memoize() method for caching
async function getAnalyticData(url){
    let {data} = await axios.get(url, 
    {
        headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
    });
    return data;
} 

// resolver function to be passed as resolver in _.memoize() method
function resolver(...args) {
    const now = new Date();
    const key = Math.floor(now.getSeconds() / 10 ) * 10;
    return key;
  }

// containsPrivacy function is used to check if blog contains privacy word in its title
let containsPrivacy=function(d){
    if(_.includes(d.title.toLowerCase(),"privacy")){
        return true;
    }
    return false; 
}

//  middleware function
exports.statmiddleware=async function(req,res,next){
    // try catch finally used for error handling
    try{
        let getAnalyticDataMemoize=_.memoize(getAnalyticData,resolver); //memoization is done with help of _.memoize() method of lodash
        let data= await getAnalyticDataMemoize('https://intent-kit-16.hasura.app/api/rest/blogs');

        data=data.blogs;

        // creating a key value pair named titleSize so that data can be sorted in asccending order of title length
        _.forEach(data,function(obj){obj.titleSize=_.size(obj.title)})

        // sorting the collection
        data=_.sortBy(data,function(d){return d.titleSize});

        // result object used for storing all analysis data
        let result={};

        result.count=_.size(data); //total number of blog 
        result.longestTitle=data[result.count-1]; // log with longest title
        result.containsPrivacy=_.filter(data, containsPrivacy); // all blogs that contain Privacy or privacy in title
        result.unique=_.uniqBy(data,'title');// all blogs with unique titles

        _.forEach(data,function(obj){delete obj.titleSize}) // removing titleSize from all blogs as it is no longer required
        req.result=result; // adding data to req
    }catch(error){
        let result={};
        result.error=error;
        req.result=result
    }finally{
        next();
    }
}