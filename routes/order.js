const express = require('express');
const mongoose = require("mongoose")
const CreateOrder = mongoose.model("CreateOrder")
const router = express.Router()
const requireLogin = require('../middleWare/requireLogin')


router.post("/createorder", requireLogin, (req, res) => {
    let productPrice = [{ type:"shirt",washing: 10, iron: 10, toweling: 15, bleaching: 25 }, 
        {type:"tshirt", washing: 15, iron: 10, toweling: 20, bleaching: 25 }, 
        { type:"trouser",washing: 30, iron: 15, toweling: 10, bleaching: 20 }, 
        { type:"jeans",washing: 20, iron: 10, toweling: 20, bleaching: 30 }, 
        {type:"boxer", washing: 15, iron: 7, toweling: 25, bleaching: 30 }, 
        {type:"jogger", washing: 27, iron: 30, toweling: 5, bleaching: 15 }, 
        { type:"others",washing: 30, iron: 20, toweling: 40, bleaching: 40 } 
    ]
    console.log(req.body)
    

    if (!req.body.service || !req.body.quantity || !req.body.product) {
        return res.status(422).json({ error: "Please fill all the fields" })

    }
    if(!req.body.service.length){
        return res.status(422).json({ error: "Please select the wash type" })
    }
    let {quantity,service,product}=req.body
    // console.log(quantity,service)
    let price = 0
    for(let i=0;i<productPrice.length;i++){
        if(productPrice[i].type==product){
            // console.log(productPrice[i])
            for(let x in productPrice[i]){
                let inp = x
                for(let j=0;j<service.length;j++){
                    if(service[j]==inp){
                        price=price+productPrice[i][inp]
                    }
                }
            }
        }
    }
    // console.log(price*quantity)
    let totalPrice = price*quantity
    const creareOrder = new CreateOrder({
        product: req.body.product,
        quantity: req.body.quantity,
        service: req.body.service,
        price:totalPrice,
        createdBy: req.user
    })
    // console.log(creareOrder)
    creareOrder.save()
        .then(result => {
            res.json(result)
        }).catch(err => console.log(err))
})

router.get("/getorder", requireLogin, (req, res) => {
    CreateOrder.find({ createdBy: req.user._id })
        .populate("createdBy", "_id email")//only the order user created will be shown to the user
        .then(result => {
            // console.log(result)
            res.json({ message: result })
        }).catch(err => console.log(err))
})

router.delete("/deleteorder",requireLogin,(req,res)=>{
    console.log(req.body)
    CreateOrder.findOneAndDelete({_id:req.body._id})
    .then(user=>{
        console.log(user)
        res.json({user})
    })
})

router.post("/getprice",(req,res)=>{
    console.log(req.body)
    const {quantity,product} = req.body
    let sum = 0
    let serviceArray = []
    for(let x in req.body){
        if(req.body[x]!=="" && x!=="product" && x!=="quantity"){
            serviceArray.push(x)
            sum+=req.body[x]
        }
    }
    const price = quantity*sum
    // console.log(serviceArray,price)

    res.json({product:product,serviceArray:serviceArray,quantity:quantity,sum:sum,price:price})
})
router.post("/findorder",(req,res)=>{
    // console.log(req.body)
    CreateOrder.findById({_id:req.body._id})
    .then(user=>{
        console.log(user)
        res.json(user)
    })
})
module.exports = router