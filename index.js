const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// let topBooks = [
//     {
//       title: 'Harry Potter and the Sorcerer\'s Stone',
//       author: 'J.K. Rowling'
//     },
//     {
//       title: 'Lord of the Rings',
//       author: 'J.R.R. Tolkien'
//     },
//     {
//       title: 'Twilight',
//       author: 'Stephanie Meyer'
//     }
//   ];
// let users = [];
let movies = [];
  //read
  app.get ('/movies', (req, res) =>{
    res.status(200).json("movies");
  })
//endpoint gets
  app.get ('/movies/:title', (req, res) =>{
    const title = req.params.title;
    res.status(200).json("Details for " + title)
})  
  

  app.get('/movies/genre/:genreName', (req, res)=> {
    const {genreName} = req.params;
    res.status(200).json("Data about " + genreName)
    // const genre = movies.find ( movie => movie.Genre.Name === genreName).Genre;

    // if (genre){
    //   res.status(200).json(genre);
    // }
    // else {
    //   res.status(400).send('No such genre')
    // }
  })
  app.get('/movies/director/directorName', (req, res)=> {
    const {directorName} = req.params;
    const director = movies.find ( movie => movie.Director.Name === directorName).Director;

    if (director){
      res.status(200).json(director);
    }
    else {
      res.status(400).send('No such genre')
    }
  })
  //endpoint posts

  app.post('/users', (req, res)=> 
    {const newUser = req.body;

  if (newUser.name){
    newUser.id = uuid.v4();
    URLSearchParams.push(newUser);
    res.status(201).json(newUser);

  } else {
    res.status(400).send('users need names');
  }
    }
);

  // app.get('/books', (req, res) => {
  //   res.json(topBooks);
  // });


  app.use("/documentation", express.static("public/documentation.html"));
//update
app.put('/users/:id', (req, res)=> 
  {
    const {id} = req.params;
    const updatedUser = req.body;

let user = user.find(user => user.id == id)

if (user){
  user.name = updatedUser.name;
  res.status(200).json(user);
}else{
  res.status(400).send('no such user');
}
  }
);
//post
app.post('/users/:id/movieTitle', (req, res)=> 
  {
    const {id, movieTitle} = req.params;
   

let user = user.find(user => user.id == id)

if (user){
  user.favoriteMvovies.push(movieTitle);
  res.status(200).send("${movieTitle} has been added to use ${id}'s array");
}else{
  res.status(400).send('no such user');
}
  });
  //Delete
  app.delete('/users/:id/movieTitle', (req, res)=> 
    {
      const {id, movieTitle} = req.params;
     
  
  let user = user.find(user => user.id == id)
  
  if (user){
    user.favoriteMvovies.user.favoriteMovies.filer(title => tile !== movieTitle);
    res.status(200).send("${movieTitle} has been removed from user ${id}'s array");
  }else{
    res.status(400).send('no such user');
  }
    }
  );
  
  app.delete('/users/:id', (req, res)=> 
    {
      const {id} = req.params;
     
  
  let user = user.find(user => user.id == id)
  
  if (user){
    users = user.filter (user => user.id != id);
    res.status(200).send("${userID} has been deleted");
  }else{
    res.status(400).send('no such user');
  }
    }
  );

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