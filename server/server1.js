const http = require('http');

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'context-type' : 'text/html; charset=utf-8'})
    res.write('<h1>hello node! </h1>');
    res.write('<p>Hello Server</p>');
    res.end('<p>Hello Zerocho</p>')
}).listen(8080);

server.on('listening',()=>{
    console.log('8080번 포트에서 대기중입니다.');
})
server.on('error',()=>{
    console.error(error);
})