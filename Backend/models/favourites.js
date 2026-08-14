const mongoose=require('mongoose');
const favSchema=new mongoose.Schema({
  guideId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Guide',
    required:true,
    unique:true
  }
})
const Fab=new mongoose.model('Fab',favSchema);
module.exports=Fab;

//  module.exports=class Fab{
//    constructor(homeid){
//    this.homeid=homeid;
//    }

//    async  save(){ 
//    }
  
//    static async  find(){      
//    }
//    static async removeById(homeid)
//    { 
    
//    }

//  }