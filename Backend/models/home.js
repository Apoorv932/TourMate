const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  location: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  languages: [{ type: String }],
  specialties: [{ type: String }],
  photo: { type: String },
  isAvailable: { type: Boolean, default: true },
});

// Index for search filters
GuideSchema.index({ location: 1, isAvailable: 1 });

const Guide = mongoose.model('Guide', GuideSchema);
module.exports = Guide;



//   async save()
//   {
    
    
//   }

//   static async findbyId(homeid)
//   {
    
     
//   }

// static async deleteById(homeid) {
   
// }
// }