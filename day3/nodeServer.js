const http = require("http");

const server = http.createServer((req,res) =>{
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end("HELLO WORLD!!\n");
});
server.listen(3001,"127.0.0.1",() =>{
    console.log("Listening on 127.0.0.1:3001");
})