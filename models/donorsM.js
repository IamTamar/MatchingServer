const  mongoose  = require("mongoose");
const Joi= require("joi")
const donorSchema = new mongoose.Schema(
    {
      code:Number,
      f_name:String,
      l_name:String,
      email:String
    }
)

const donorMODEL= mongoose.model("Donors",donorSchema,"Donors")
exports.donorMODEL = donorMODEL
exports.donorJoi=(_bodyData)=>{
  let joiSchema=Joi.object({
  code:Joi.number().min(0).required(),
  f_name:Joi.string().min(2).max(15).alphanum().required(),
  l_name:Joi.string().min(2).max(15).alphanum(),
  email:Joi.string().min(1).pattern(new RegExp(/@/)).required()
  })
  return joiSchema.validate(_bodyData);
  }
