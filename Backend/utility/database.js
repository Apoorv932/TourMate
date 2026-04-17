const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const url="mongodb+srv://apoorvsinghyadav137:%40Soli932@nehal.a50gmo4.mongodb.net/?retryWrites=true&w=majority&appName=Nehal";

let _db;
async function mongoConnect() {
    try {
        const client = await MongoClient.connect(url);
        _db=client.db("airbnb");
        console.log("Connected to MongoDB");
        
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        
    }
}
const getDB=()=>{
  if(!_db)
  {
    console.log("error");
  }else{
    return _db;
  }
}

module.exports={
  mongoConnect,getDB
}
