//קבוצות
const express = require('express')

const router = express.Router();
const {groupMODEL, groupJoi}=require("../models/groupsM")
const {donatorMODEL}=require("../models/donatorsM")
router.use(express.json());

//החזרת הקבוצות שהגיעו ליעדן
router.get('/reached',async(req, res,next)=>{
  try{
    const results = await groupMODEL.find({ $expr: {$eq:["$sum","$goal"]} });
    if(results.length==0)
      return res.status(500).json({message:"no group reached the goal!"})
    res.json(results)
  }catch(error){
  next.error
  }
})

router.get("/",async (req, res,next)=>{
  try{
    const results= await groupMODEL.find({})
      res.json(results) 
  }catch(error){
    next.error
  }
  })

  router.get("/summing",async (req, res,next)=>{
    try{
      const results= await groupMODEL.find({})
        res.json(results) 
    }catch(error){
      next.error
    }
    })


router.get("/:groupCode",async (req,res,next)=>{
  try{
      const results = await groupMODEL.find({code:req.params.groupCode});
      console.log(req.params.groupCode)
      //טיפול בשגיאה - לא קיים
      if (results.length==0) {
        return res.status(400).json({ message: 'group not found' });
      }
      res.json(results);
  } catch(error){
    next.error.status(500)
  }

})


router.post('/', async(req,res,next)=>{
  try{
    if(req.body[0].permission!=1)
      throw new Error("you are not permitted!")
    const validBody= groupJoi(req.body[1])
    if (validBody.error){
      return res.status(400).json({message:"group is invalid"});
    }
    const group= new groupMODEL(req.body[1])
    const maxCodeGroup = await groupMODEL.find({}).sort({ code: -1 }).limit(1);
    await group.save()
    const newcode = maxCodeGroup.length==0  ? 1 : maxCodeGroup[0].code+1
    console.log(newcode)
    await groupMODEL.updateOne({_id:group._id}, {$set: {code: newcode}}) 

    res.json( await groupMODEL.find({code:newcode})
)
  }catch(error){
    next(error)
  } 
  })

  router.put("/updateName/:codeToEdit", async (req,res,next)=>{
    try{
    const results= await groupMODEL.find({code:req.params.codeToEdit})
    if(results.length==0)
      return res.status(400).json({message:"group does not exist!"})
    let data=await groupMODEL.updateOne({code:req.params.codeToEdit},{$set: {name: req.body.name}})
    const results2= await groupMODEL.find({code:req.params.codeToEdit})
    //if it's success we get n=1 in data object
    console.log(data)
    res.json(results2);
    }
    catch(err){
      next(err)    }
    })
    router.put("/updateGoal/:codeToEdit", async (req,res,next)=>{
      try{
        if(req.body[0].permission!=1)
          throw new Error("you are not permitted!")
        const results= await groupMODEL.find({code:req.params.codeToEdit})
        if(results.length==0)
          return res.status(400).json({message:"group does not exist!"})
      let data=await groupMODEL.updateOne({code:req.params.codeToEdit},{$set: {goal: req.body[1].goal}})
      const results2= await groupMODEL.find({code:req.params.codeToEdit})
      console.log(data)
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
        let dltGroup= await groupMODEL.find({code:req.params.codeToDelete})
        if(dltGroup.length==0)
          return res.status(400).json({message:"group does not exist!"})
        //all donators of this group are taken to group 0- default group
        const donators= donatorMODEL.find({group_id:req.params.codeToDelete})
        console.log(donators)
        let data=await donatorMODEL.updateMany({group_id:req.params.codeToDelete},{$set: {group_id: 0}})
        const donators2= donatorMODEL.find({group_id:0})
        console.log(donators2)
        let data2=await groupMODEL.updateOne({group_id:0},{$set: {sum: dltGroup.sum}})
        let data3=await groupMODEL.deleteOne({code:req.params.codeToDelete})
        console.log(data3)
        res.json(data3);
      }
      catch(err){
      next(err)
      }
      })

module.exports=router
