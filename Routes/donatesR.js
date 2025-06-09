//תרומות
const express = require('express')
const router = express.Router();

const {donateMODEL,donateJoi}=require('../models/donatesM')
const {donatorMODEL}=require("../models/donatorsM")
const {groupMODEL}=require("../models/groupsM")

router.use(express.json());

router.get('/', async (req, res,next) => {
  try {
      const results = await donateMODEL.find({});
      res.json(results);
  } catch (error) {
      next(error)
  }
});
//search specific donate by code
router.get('/:donateCode', async (req, res,next) => {
  try {
      const results = await donateMODEL.find({code:req.params.donateCode});
      console.log(req.params.donateCode)
      //טיפול בשגיאה - לא קיים
      if (results.length==0) {
        return res.status(400).json({ message: 'donate not found' });
      }
      res.json(results);
  } catch (error) {
      next(error)
  }
});

router.post('/', async (req,res,next)=> {
  try{
      const validBody=donateJoi(req.body)
      if (validBody.error) {
          return res.status(400).json({message: validBody.error.message})}
      const donate =new donateMODEL(req.body)
      await donate.save()
      const donator = await donatorMODEL.findOne({code: donate.donator_id})
      const sumDonator = donator.sum
      const group = await groupMODEL.findOne({code: donator.group_id})
      const sumGroup = group.sum
      if(donator.length != 0)
         await donatorMODEL.updateOne({code: donate.donator_id},  {$set: {sum: sumDonator+donate.sum}})
      if(group.length != 0)
        await groupMODEL.updateOne({code: donator.group_id},  {$set: {sum: sumGroup+donate.sum}})
      const results= [await groupMODEL.find({code:group.code}), await donatorMODEL.find({code:donator.code})]
      res.json(results)
      }       
  catch (error){
      next(error)}
})

router.put("/updateDonorCode/:codeToEdit", async (req,res,next)=>{
  try{
    if (req.body[0].permission != 1)
      throw new Error("you are not permitted!")
 
    const results= await donateMODEL.find({code:req.params.codeToEdit})
    if(results.length==0)
      return res.status(400).json({message:"donate does not exist!"})
   
  let data=await donateMODEL.updateOne({code:req.params.codeToEdit},{$set: {donor_id: req.body[1].donor_id}})
  const results2= await donateMODEL.find({code:req.params.codeToEdit})
  console.log(data)
  res.json(results2);
  }
  catch(err){
    next(err)
    }
  })


    router.delete("/:idToDelete",async (req,res,next)=>{
      try
      {
        res.send(" a donate is unremoved!")
      }
      catch(err){
      next(err)
      }
      })

module.exports=router