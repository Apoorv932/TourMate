const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
 firstName:{
  type:String,
  required:true,
 },
  lastName:{
  type:String,
  default:'',
 },
 email:{
  type:String,
  required:true,
  unique:true
 },
 password:{
  type:String,
  required:function requiredPassword() {
    return this.authProvider !== 'google';
  },
  default:''
 },
 role:{
  type:String,
   enum: ['guest', 'host'],
  required:true
 },
 authProvider:{
  type:String,
  enum:['local','google'],
  default:'local',
 },
 googleId:{
  type:String,
  unique:true,
  sparse:true,
 },
 profilePhoto:{
  type:String,
  default:'',
 },
 favourites:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:'Home',
 }]
})
const User=new mongoose.model('User',userSchema);
module.exports=User;
