const express = require('express')
const app = express();
// จะใช้เป็น express().get ก็ได้

app.get("/",(req,res) =>{
    res.send("HELLO WORLD 5555+");
})
app.listen(3001);