const { error } = require("console");
const express = require("express")
const book = express.Router();

book.get('/list',(req,res) => {
    try{
        res.send("hello")
    }
    catch(e){
        res.status(500).send({error: e.message})
    }
})
module.exports = book; //database name