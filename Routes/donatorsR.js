//מתרימים
const express = require('express')
const {donatorMODEL, donatorJoi}=require('../models/donatorsM')
const {groupMODEL}=require("../models/groupsM");
const {donateMODEL}=require("../models/donatesM")

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res,next) => {
  try{
    const results = await donatorMODEL.find({});
    res.json(results)
  }catch(error){
    next.error.status(500)
  }
  })

  router.get('/:donatorCode', async (req, res, next) => {
    try{
      console.log(req.params.donatorCode)
      const results = await donatorMODEL.find({code:req.params.donatorCode});
      //טיפול בשגיאה - לא קיים
      if (results=="") {
        return res.status(404).json({ message: 'donator not found' });
      }
      res.json(results);
  } catch (error) {
     next.error
   }

  })
  //insert donator and give automatic code
router.post('/', async (req, res, next) => {
  try {
    if(req.body[0].permission!=1)
      throw new Error("you are not permitted!")
      const validBody = donatorJoi(req.body[1]);
      if (validBody.error) {
          return res.status(400).json({message: validBody.error.message})
      }
      const donator = new donatorMODEL(req.body[1]); 

      //checking if the group of donator is existing
      const group= await groupMODEL.find({code: donator.group_id})
      if(group.length == 0){
        return res.status(400).json({message:"group does not exists"});
      }
      //sort- מיון מהגדול לקטן בגלל -1
      //limit - מביא את הערך העליון הראשון
      const maxCodeDonator = await donatorMODEL.find({}).sort({ code: -1 }).limit(1);
      await donator.save() 
      const newcode = maxCodeDonator.length==0 ? 1 : maxCodeDonator[0].code+1
      console.log(newcode)
      await donatorMODEL.updateOne({_id:donator._id}, {$set: {code: newcode}})   
      const results= await donatorMODEL.find({code:newcode})
      res.json(results);
  } catch (error) {
      next(error)
     }
})
// פונקציה המעבירה מתרים מקבוצה ומעדכנת את סכומי הקבוצות 
router.put("/updateGroupCode/:codeToEdit", async (req,res,next)=>{
  try{
    if(req.body[0].permission!=1)
      throw new Error("you are not permitted!")
    
    const newGroup= await groupMODEL.findOne({code:req.body[1].group_id})
    if(newGroup.length==0)
      return res.status(400).json({message:"group does not exist!"})
  let sumNewGroup = newGroup.sum
  console.log(sumNewGroup)
  const donator= await donatorMODEL.findOne({code:req.params.codeToEdit})
  console.log(donator)
  const prevGroup= await groupMODEL.findOne({code:donator.group_id})
  console.log(prevGroup)
  const sumPrevGroup= prevGroup.sum
  console.log(sumPrevGroup)

  const data1=await donatorMODEL.updateOne({code:req.params.codeToEdit},{$set: {group_id: req.body[1].group_id}})
  console.log("dgfgg")
  const data2=await groupMODEL.updateOne({code:req.body[1].group_id},{$set: {sum: Number(sumNewGroup+donator.sum)}})
  console.log("dvcb2")
  console.log(await groupMODEL.findOne({code:req.body[1].group_id}))
  const data3=await groupMODEL.updateOne({code:req.params.codeToEdit},{$set: {sum: Number(sumPrevGroup - donator.sum)}})
  console.log(await groupMODEL.findOne({code:prevGroup.code}))

  console.log(data1)
  console.log(data2)
  console.log(data3)
  const results= [await donatorMODEL.find({code:req.params.codeToEdit}),await groupMODEL.findOne({code:newGroup.code})]
  res.json(results);
  }
  catch(err){
   next(err)  }
  })

  router.put("/updateName/:codeToEdit", async (req,res,next)=>{
    try{
    let data=await donatorMODEL.updateOne({code:req.params.codeToEdit},{$set: {name: req.body.name}})
    const results= await donatorMODEL.find({code:req.params.codeToEdit})
    console.log(data)
    res.json(results);
    }
    catch(err){
    next(err)    }})
//צריך למחוק גם את הקוד של המתרים מהקבוצה, כי בפעולות אחרות זה יכול לסבך שהמתרים כבר לא קיים והקוד שלו כן
    router.delete("/:codeToDelete",async (req,res,next)=>{
      try
      {
        if(req.body.permission!=1)
          throw new Error("you are not permitted!")
        let data= await donateMODEL.updateMany({donator_id:req.params.codeToDelete},{$set:{donator_id:0}})
        let data1=await donatorMODEL.deleteOne({code:req.params.codeToDelete})
        console.log(await donatorMODEL.find({}))
        res.json(data1);
      }
      catch(err){
      next(err)
      }
      })
  
  module.exports=router