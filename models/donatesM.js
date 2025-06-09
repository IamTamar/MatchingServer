const Joi = require("joi");
const  mongoose  = require("mongoose");
const donateSchema = new mongoose.Schema(
    {
      code: Number,
      donor_id: Number,
      donator_id: Number,
      sum:Number
    }
)
const donateMODEL = mongoose.model('Donates',donateSchema,'Donates');
exports.donateMODEL=donateMODEL


exports.donateJoi=(_bodyData)=>{
let joiSchema=Joi.object({
code:Joi.number().required(),
donor_id:Joi.number(),
donator_id:Joi.number(),
sum:Joi.number().min(1).required()
})
return joiSchema.validate(_bodyData);
}