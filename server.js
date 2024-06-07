const http = require('http');
const url = require('url');
const fs = require('fs');
http.createServer((request, response) => {
  // response.writeHead(200, {'Content-Type': 'text/plain'});
  // response.end('Hello Node!\n');
  let addr = request.url
filePath = '';
  if (request.url.includes("documentation")){
    filePath = 'documentation.html';
  }
  else{
    filePath = 'index.html';
  }
  // response.writeHead(200, { 'Content-Type': 'text/html' });
  // response.write(filePath);
  // response.end();
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();

  });
  fs.appendFile('log.txt', 'URL: ' + addr +'\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');


