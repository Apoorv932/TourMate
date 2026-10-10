import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;

const url = process.env.MONGO_URI;

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
