const Joi = require("joi");
const  mongoose  = require("mongoose");
const donatorSchema = new mongoose.Schema(
    {
      code:Number,
      name:String,
      group_id: Number,
      sum:Number
    }
)

 
const donatorMODEL = mongoose.model("donators",donatorSchema,"donators");
exports.donatorMODEL = donatorMODEL
exports.donatorJoi=(_bodyData)=>{
  let joiSchema=Joi.object({
  code:Joi.number(),
  name:Joi.string().min(2).max(30).alphanum().required(),
  group_id:Joi.number().required(),
  sum:Joi.number().min(0).max(0).required()
  })
  return joiSchema.validate(_bodyData);
  }
