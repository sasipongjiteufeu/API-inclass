const express = require('express')
const app = express();
const bodyParser = require('body-parser');
//const { count } = require('console');
// จะใช้เป็น express().get ก็ได้
const {PrismaClient} = require('@prisma/client');
const { count, error } = require('console');
const { data } = require('jquery');
const { waitForDebugger } = require('inspector');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))
app.use(fileUpload())
const bookControler = require('./controler/bookControler');
app.use('/book', bookControler)
app.use('/uploads', express.static('uploads'))
const cors = require('cors');
app.use(cors())

function checkSingIn( req, res, next){
    try{
        const secret = process.env.TOKEN_SECRET
        const token = req.headers['authorization']

        const result = jwt.verify(token,secret);
        if(result != undefined){
            next()
        }
    }catch(e){
        res.status(500).send({error: e.message})
    }
}
app.get("/user/info",checkSingIn,(req,res,next) =>{
    try{
        res.send("!!!!!!!! *--* Hello *--* !!!!!!!!!")
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/",(req,res) =>{
    res.send("HI");
})
app.get("/hello/:name/:age",(req,res) =>{
    const name = req.params.name;
    const age = req.params.age;
    //res.send("name = "+ name + " age = " + age);
    res.send(`name = ${name} age = ${age}`);
})
app.get('/book/list' , async(req , res) =>{
    const data = await prisma.book.findMany();
    res.send({data : data});
})
app.post('/book/create' , async(req,res) => {
    const data = req.body;
    const result = await prisma.book.create({data: data});
    res.send({result:result})
})
app.post('/book/createManual', async(req,res) =>{
    const result = await prisma.book.create({data:{
        isbn: '1004',
        name: 'Flutter',
        price: 850}
    })
    res.send({result : result})
})
app.put("/book/update/:id" , async(req,res) =>{
    try{
        await prisma.book.update({
            data:{
                isbn: '10022',
                name: 'test update',
                price: 999
            },
            where: {
                id : parseInt(req.params.id)
            }
        })
        res.send({message: 'super'})
    }catch(e){
        res.status(500).send({error: e.message})
        
    }
})
app.delete("/book/remove/:id",async (req,res) =>{
    try{
        await prisma.book.delete({
            where:{
                id: parseInt(req.params.id)
            }
        })
        res.send({message: 'super'})
    }catch(e){
        res.status(500).send({error: e.message});
    }
})
app.post("/book/search", async (req,res) =>{
    try{
        const keyword = req.body.keyword;
        const data = await prisma.book.findMany({
            where:{
                name: {
                    contains: keyword
                }
            }
        })
        res.send({result: data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.post("/book/endsWith", async(req,res)=>{
    try{
    const keyword = req.body.keyword;
    const data = await prisma.book.findMany({
        where:{
            name:{
                endsWith:keyword
            }
        },
        
    })
    res.send({result: data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/orderBy",async (req,res) =>{
    try{
        const data = await prisma.book.findMany({
            orderBy: {
                price: "desc"
            }
        })
        res.send({result: data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/gt",async(req,res)=>{
    try{
        const data = await prisma.book.findMany({
            where: {
                price: {
                    gt: 300
                }
            }
        })
        res.send({result:data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/lt",async(req,res)=>{
    try{
        const data = await prisma.book.findMany({
            where: {
                price: {
                    lt: 300
                }
            }
        })
        res.send({result:data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/notNull",async(req,res) =>{
    try{
        const data = await prisma.book.findMany({
            where: {
                detail: {
                    not: null
                }
            }
        })
        res.send({result : data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/isNull",async(req,res) =>{
    try{
        const data = await prisma.book.findMany({
            where:{
                detail: null
            }
        })
    res.send({result : data})
    }catch(e){
        res.status(500).send({error : e.message})
    }
})
app.get("/book/between",async(req,res) =>{
    try{const data = await prisma.book.findMany({
        where:{
            price:{
                gte: 100 //>= 100
            },
            price:{
                lte: 320//<= 320
            }
        }   
    })
    res.send({result:data})
}catch(e){
    res.status(500).send({error : e.message})
    }
})
app.get("/book/sum",async(req,res) => {
    try{
        const data = await prisma.book.aggregate({
        _sum:{
            price: true
        }
    })
    res.send({result:data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/max",async(req,res) =>{
    try{
        const data = await prisma.book.aggregate({
            _max:{
                price: true
            }
        })
        res.send({result: data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/min",async(req,res) =>{
    try{
        const data = await prisma.book.aggregate({
            _min:{
                price: true
            }
        })
        res.send({result: data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/avg",async(req,res) =>{
    try{
        const data = await prisma.book.aggregate({
            _avg:{
                price: true
            }
        })
        res.send({result: data})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/book/findYearMonthDay" , async(req,res)=>{
    try{
        const data = await prisma.book.findMany({
            where:{
                registerDate: new Date('2024-05-08')
            }
        })
        res.send({result:data})
    }catch(e){
        res.status(500).send({error : e.message})
    }
})
app.get("/book/findYearMonth" , async(req,res)=>{
    try{
        const data = await prisma.book.findMany({
            where:{
                registerDate: {
                    gte: new Date("2024-05-01"),
                    lte: new Date("2024-05-31")
                }
            }
        })
        res.send({result:data})
    }catch(e){
        res.status(500).send({error : e.message})
    }

})
app.get("/book/findYear" , async(req,res)=>{
    try{
        const data = await prisma.book.findMany({
            where:{
                registerDate: {
                    gte: new Date("2024-01-01"),
                    lte: new Date("2024-12-31")
                }
            }
        })
        res.send({result:data})
    }catch(e){
        res.status(500).send({error : e.message})
    }
    
})
app.get("/user/createToken",(req,res)=>{
    try{
        const secret = process.env.TOKEN_SECRET
        const payload = {
            id: 100,
            name: 'beer',
            level: 'admin'
        }
        const token = jwt.sign(payload,secret,{expiresIn:'1d'})
        res.send({token:token})
    }catch(e){
        res.status(500).send({error: e.message})
    }

})
app.get("/user/verifyToken",(req,res)=>{
    try{
        const secret = process.env.TOKEN_SECRET
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJuYW1lIjoiYmVlciIsImxldmVsIjoiYWRtaW4iLCJpYXQiOjE3MjcwNjI4MzMsImV4cCI6MTcyNzE0OTIzM30.gJ05x-u4MDTBZLAZj2EEv_XgvMuG4gqkoYSa9MHrJcM'
        /*const payload = {
            id: 100,
            name: 'beer',
            level: 'admin'
        }*/
        const result = jwt.verify(token,secret)
        res.send({result:result})
    }catch(e){
        res.status(500).send({error: e.message})
    }

})
app.get("/oneToOne",async(req,res)=>{
    try {
        const data = await prisma.orderDetail.findMany({
            include: {
                Book: true
            }
        })
        res.send({result: data})
    } catch (e) {
       res.status(500).send({error: e.message}) 
    }
})
app.get("/oneToMany",async (req,res) =>{
    try {
        const data = await prisma.book.findMany({
            include:{
                OrderDetail: true
            }
        })
        res.send({result: data}) 
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})
app.get("/multiModel",async (req,res) =>{
    try {
        const data = await prisma.customer.findMany({
            include:{
                Order:{
                    include:{
                        OrderDetail: true
                    }
                }
            }
        })
        res.send({result: data})
    } catch (e) {
     res.status(500).send({error:e.message})   
    }
})
app.post("/book/testUpload",(req,res) => {
    try{
        const myFile = req.files.myFile
        
        myFile.mv("./uploads/" + myFile.name, (e) =>{
            if(err){
                res.status(500).send({error: e.message})
            }
        })
        res.send({message: 'Ok'})
    }
    catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/readFile",(req,res) => {
    try{
        const fs = require('fs')
        fs.readFile('test.txt' , (e,data) =>{
            if(e){
                throw e
            }
            res.send(data)
        })
        
    }
    catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/writeFile",(req,res) => {
    try{
        const fs = require('fs')
        fs.writeFile('test.txt' ,"555555555555555" ,(e) =>{
            if(e){
                throw e
            }
            res.send({message:'OK'})
        })
        
    }
    catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/removeFile",(req,res) => {
    try{
        const fs = require('fs')
        fs.unlinkSync('test.txt')
        res.send({message:'OK'})
    }
    catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get("/FileExist",(req,res) => {
    try{
        const fs = require('fs')
        const found = fs.existsSync('package.json')
        res.send({found:found})
    }
    catch(e){
        res.status(500).send({error: e.message})
    }
})
app.get('/creater',(req,res) =>{
    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const doc = new PDFDocument()

    doc.pipe(fs.createWriteStream('output.pdf'))
    doc
        .font('Kanit/Kanit-Medium.ttf')
        .fontSize(25)
        .text('😀😀😀😀😀Some text adn embeded font😀😀😀😀😀  สวัสดี55555+ นั้นไง hello!!!',100,100)
    doc
        .addPage()
        .fontSize(25)
        .text('Here is some vector graphics...',100,100)
    doc.end();
    res.send({message: 'success'})
})
app.get('/readExcel',async(req,res) =>{
    try{
        const excel = require('exceljs')
        const wb = new excel.Workbook()
        await wb.xlsx.readFile('productExport.xlsx')
        const ws = wb.getWorksheet(1);

        for(let i = 1; i < ws.rowCount;i++){
            const row = ws.getRow(i)
            const barcode = row.getCell(1).value
            const name = row.getCell(2).value
            const cost = row.getCell(3).value
            const sale = row.getCell(4).value
            const send = row.getCell(5).value
            const unit = row.getCell(6).value
            const point = row.getCell(7).value
            const productTypeId = row.getCell(8).value

            console.log(barcode,name,cost,sale,send,unit,point,productTypeId)
        }
        res.send({message:"ok"})
    }catch(e){
        res.status(500).send({error: e.message})
    }
})
app.delete('/orderDetail/remove/:id', async(req,res) =>{
    try {
        await prisma.orderDetail.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.send({message: 'success'})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})
app.listen(3001); 