const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Models = require('./models.js');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
const Movies = Models.Movie;
const Users = Models.User;
const jwt = require('jsonwebtoken');
// const passport = require('passport');
// require('passport');
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});



//read

app.get('/movies', (req, res) => {
   Movies.find()
      .then((movies) => {
          res.status(201).json(movies);
      })
      .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
      });
});
//readno
app.get('/movies/:title', async (req, res) => {

  const title = req.params.title;
  const movie = await  Movies.findOne({ Title: title });

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(404).send('Movie not found');
  }

});
  //read
  app.get('/movies/directors/:directorName', async (req, res) => {
    try {
        const directorName = req.params.directorName;
        const movie = await Movies.findOne({ 'Director.Name': directorName });

        if (movie) {
            res.status(200).json(movie.Director);
        } else {
            res.status(404).send('No such director');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
}); 
  
//read
app.get('/movies/genre/:genreName', async (req, res) => {
  try {
      const genreName = req.params.genreName;
      const movie = await Movies.findOne({ 'Genre.Name': genreName });

      if (movie) {
          res.status(200).json(movie.Genre);
      } else {
          res.status(404).send('No such genre found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
  }
});
//read
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
  //create

  app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });


// Update User Route
app.put('/users/:Username',  async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
      }
  },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      })

});

  //Delete
  app.delete('/users/:Username/:movieTitle', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username }, 
        { $pull: { FavoriteMovies: req.params.movieTitle } },
        { new: true } // Return the updated document
    )
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
  //delete
  app.delete('/users/:Username', async (req, res) => {

     await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(404).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



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
  console.error(err.stack); // Log the stack trace
  res.status(500).send('Something went wrong!');
});

app.use("/documentation", express.static("public/documentation.html"));