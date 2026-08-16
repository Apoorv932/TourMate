import mongoose from 'mongoose';

const favSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide',
    required: true,
    unique: true
  }
});
const Fab = mongoose.model('Fab', favSchema);
export default Fab;

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