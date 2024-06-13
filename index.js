const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

let topBooks = [
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling'
    },
    {
      title: 'Lord of the Rings',
      author: 'J.R.R. Tolkien'
    },
    {
      title: 'Twilight',
      author: 'Stephanie Meyer'
    }
  ];
  
  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my book club!');
  });
  
//   app.get('/documentation', (req, res) => {                  
//     res.sendFile('public/documentation.html', { root: __dirname });
//   });
  
  app.get('/books', (req, res) => {
    res.json(topBooks);
  });


  app.get('/', (req, res) => {
    res.send('Welcome to my book club!');
  });
  app.use("/documentation", express.static("public/documentation.html"));

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});



app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  err.stack("Error")
});