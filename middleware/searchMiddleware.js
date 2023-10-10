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

// searchQuery function is used in filterQuery() function to find if query is prsent in blog title or not
let searchQuery=function(d,word){
    if(_.includes(d.title.toLowerCase(),word.toLowerCase())){
        return true;
    }
    return false; 
}

// filterQuery function is used for filtering out all blogs containg query
function filterQuery(data,search){
    return _.filter(data,function(d){return searchQuery(d,search)});
}

// resolver function to be passed as resolver in _.memoize() method
function resolver(...args) {
    const now = new Date();
    const key = Math.floor(now.getSeconds() / 10 ) * 10;
    return key;
  }

exports.searchmiddleware=async function(req,res,next){
    try{
        let getAnalyticDataMemoize=_.memoize(getAnalyticData,resolver); //memoization is done with help of _.memoize() method of lodash
        let data= await getAnalyticDataMemoize('https://intent-kit-16.hasura.app/api/rest/blogs');

        data=data.blogs;
        let search=req.query.query;   
        // memoization of filtered blogs
        let filterQueryMemozie=_.memoize(filterQuery,resolver);
        // result object used for storing all analysis data
        let result={}; 
        // all blogs that contain specific word (word we are quering for) in title
        result=filterQueryMemozie(data,search) 
        // adding data to req 
        req.result=result; 
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