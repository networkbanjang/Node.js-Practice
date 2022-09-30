const http = require('http');
const fs = require('fs').promises; //promise가있어야 async await이 된다

const server=http.createServer(async (req,res)=>{
  try{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  const data = await fs.readFile('./server2.html'); 
  res.end(data);}
  catch(error){
    console.error(err);
    res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
    res.end(err.message);
  }
})
.listen(8080);

server.on('listening', () => {
  console.log('8080번 포트에서 대기중입니다.');
})
server.on('error', () => {
  console.error(error);
})
