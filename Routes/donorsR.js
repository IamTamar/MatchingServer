//תורמים
const express = require('express')

//const donors_list = require('../Data/donors')// export of donors-list
const {donorMODEL,donorJoi}=require("../models/donorsM")

const router = express.Router();
router.use(express.json());

router.get('/:donorID', async (req, res, next) => {
  try{
    const results= await donorMODEL.find({code :donorID})
    console.log(results)
    if (results.length==0){
      return res.status(400).json({message:"donor not found"})
    }
    res.json(results)
  }catch(error){
    next.error
  }
}) 

router.get('/', async(req, res, next) => {
  try{
    const results= await donorMODEL.find({})
    res.json(results)
  }catch(error){
    next.error
  }
  })



router.post('/',async(req,res, next)=>{
  try{
    if(req.body[0].permission!=1)
      throw new Error("you are not permitted!")
    const validBody = donorJoi(req.body[1]);
    if (validBody.error) {
        return res.status(400).json({message: validBody.error.message})
    }
    const donor = new donorMODEL(req.body[1]);
    const maxCodeDonor = await donorMODEL.find({}).sort({ code: -1 }).limit(1);
    await donor.save()
    const newcode = maxCodeDonor.length==0  ? 1 : maxCodeDonor[0].code+1
    console.log(newcode)
    await donorMODEL.updateOne({_id:donor._id}, {$set: {code: newcode}})   
    res.json(await donorMODEL.find({code:newcode}))
  }catch(error){
    next(error)
  }
  })

  router.put("/updateDonorFirstName/:codeToEdit", async (req,res,next)=>{
    try{   
       const results= await donorMODEL.find({code:req.params.codeToEdit})
       if(results.length==0)
        return res.status(400).json({message:"donor does not exist!"})
    let data=await donorMODEL.updateOne({code:req.params.codeToEdit},{$set: {f_name: req.body.f_name}})
    const results2= await donorMODEL.find({code:req.params.codeToEdit})

    console.log(data)
    res.json(results2);
    }
    catch(err){
    next(err)    }
    })
    router.put("/updateDonorLastName/:codeToEdit", async (req,res,next)=>{
      try{
        const results= await donorMODEL.find({code:req.params.codeToEdit})
        if(results.length==0)
          return res.status(400).json({message:"donor does not exist!"})
     
      let data=await donorMODEL.updateOne({code:req.params.codeToEdit},{$set: {l_name: req.body.l_name}})
      const results2= await donorMODEL.find({code:req.params.codeToEdit})
      console.log(data)
      res.json(results2);
      }
      catch(err){
      next(err)      }
      })
      router.put("/updateDonorEmail/:codeToEdit", async (req,res,next)=>{
        try{     
         const results= await donorMODEL.find({code:req.params.codeToEdit})
         if(results.length==0)
          return res.status(400).json({message:"donor does not exist!"})
        let data=await donorMODEL.updateOne({code:req.params.codeToEdit},{$set: {email: req.body.email}})
        console.log(data)
        const results2= await donorMODEL.find({code:req.params.codeToEdit})
        res.json(results2);
        }
        catch(err){
        next(err)
        }
        })

    router.delete("/:codeToDelete",async (req,res,next)=>{
      try
      {
        if(req.body.permission!=1)
          throw new Error("you are not permitted!")
      let data=await donorMODEL.deleteOne({code:req.params.codeToDelete})
      console.log(data)
      console.log(await donorMODEL.find({}))
      res.json(data);
      }
      catch(err){
      next(err)
      }
      })
      

module.exports=router