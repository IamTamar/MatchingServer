const Joi = require("joi");
const  mongoose  = require("mongoose");
const groupSchema = new mongoose.Schema(
    {
      code:Number,
      name:String,
      campaign:Number,
      sum:Number,
      goal:Number
    }
)

const groupMODEL = mongoose.model("Groups",groupSchema,"Groups");
exports.groupMODEL=groupMODEL

exports.groupJoi=(_bodyData)=>{
  let joiSchema=Joi.object({
  code:Joi.number().min(0).required(),
  name:Joi.string().min(2).max(50).required(),
  campaign:Joi.number().min(0),
  sum:Joi.number().min(0).required(),
  goal:Joi.number().min(1).required()
  })
  return joiSchema.validate(_bodyData);
  }
