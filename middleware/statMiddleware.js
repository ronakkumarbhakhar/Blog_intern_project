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
        //memoization is done with help of _.memoize() method of lodash
        let getAnalyticDataMemoize=_.memoize(getAnalyticData,resolver); 
        let data= await getAnalyticDataMemoize('https://intent-kit-16.hasura.app/api/rest/blogs');
        data=data.blogs;

        // sorting the collection and creating a key value pair named titleSize so that data can be sorted in asccending order of title length
        data=_.sortBy(data,function(obj){obj.titleSize=_.size(obj.title); return obj.titleSize});

        // result object used for storing all analysis data
        let result={};

        //total number of blog 
        result.totalBlogs=_.size(data); 
         // longest title
        result.longestTitle=data[result.totalBlogs-1].title;
        // all blogs that contain Privacy or privacy in title
        result.containsPrivacy=_.size(_.filter(data, containsPrivacy)); 
        // all unique blog titles and removing titleSize from all blogs as it is no longer required
        let uniqueTitles=[];
        _.forEach(data,function(obj){uniqueTitles.push(obj.title);delete obj.titleSize;});
        result.uniqueTitles=_.uniq(uniqueTitles);

        // adding data to req
        req.result=result; 
    }catch(error){
        let result={};
        result.error=error;
        req.result=result
    }finally{
        next();
    }
}