const mongoose=require('mongoose');
const User=require('./user');

const Homeschema= new mongoose.Schema({
     houseName:{type: String, required:true},
    price:{type: Number, required:true},
         location:{type: String, required:true},
              photo:{type: String, },
              rulesPdf:{type:String}
   

})
Homeschema.pre('findOneAndDelete', async function (next) {
  const homeId = this.getQuery()._id; // home id being deleted
  
  try {
    // Remove the home id from all users' favourites
    await User.updateMany(
      { favourites: homeId },
      { $pull: { favourites: homeId } }
    );

    next();
  } catch (error) {
    next(error); // pass error to next so it's handled properly
  }
});

const Home=mongoose.model('Home',Homeschema);



module.exports=Home;



//   async save()
//   {
    
    
//   }

//   static async findbyId(homeid)
//   {
    
     
//   }

// static async deleteById(homeid) {
   
// }
// }