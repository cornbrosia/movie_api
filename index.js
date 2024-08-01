const cors = require('cors');
app.use(cors());
const express = require('express');
const app = express();
const { check, validationResult } = require('express-validator');
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
app.use(bodyParser.urlencoded({
  extended: true

}));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  err.stack("Error")
});

app.use("/documentation", express.static("public/documentation.html"));


//read

app.get('/movies',passport.authenticate('jwt', { session: false }), async (req, res) => {
   await Movies.find()
      .then((movies) => {
          res.status(201).json(movies);
      })
      .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
      });
});
//readno
app.get('/movies/:title',passport.authenticate('jwt', { session: false }), async (req, res) => {

  const title = req.params.title;
  const movie = await  Movies.findOne({ Title: title });

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(404).send('Movie not found');
  }

});
  //read
  app.get('/movies/directors/:directorName',passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/movies/genre/:genreName',passport.authenticate('jwt', { session: false }), async (req, res) => {
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
  app.get('/movies/director/directorName',passport.authenticate('jwt', { session: false }), async (req, res)=> {
    const {directorName} = req.params;
    const director = await movies.find ( movie => movie.Director.Name === directorName).Director;

    if (director){
      res.status(200).json(director);
    }
    else {
      res.status(400).send('No such genre')
    }
  })
  //create

      
      app.post('/users',  [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
      ],async (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('User in request:', req.user);
  console.log('Requested Username:', req.params.Username);

  // Check permission
  if (!req.user || req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
  }

  try {
      const updatedUser = await Users.findOneAndUpdate(
          { Username: req.params.Username },
          {
              $set: {
                  Username: req.body.Username,
                  Password: req.body.Password,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday,
                  FavoriteMovies: req.body.FavoriteMovies // Include this if necessary
              }
          },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).send('User not found');
      }

      res.json(updatedUser);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err.message);
  }
});
//update

app.post('/users/:Username/FavoriteMovies/:title',passport.authenticate
  ('jwt', { session: false }), async (req, res) => {
    const title = req.params.title;

  await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: title } },
      { new: true }
  )
  .then((updatedUser) => {
      if (!updatedUser) {
          return res.status(404).send('User not found');
      }
      res.status(200).json(updatedUser);
  })
  .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
  });
});
  //Deletetitle
  app.delete('/users/:Username/FavoriteMovies/:title',passport.authenticate('jwt', { session: false }), async (req, res)=> 
    {
      const title = req.params.title;

       await Users.findOneAndUpdate({ Username: req.params.Username }, {
          $pull: { FavoriteMovies: title }
      },
          { new: true }) // This line makes sure that the updated document is returned
          .then((updatedUser) => {
              res.json(updatedUser);
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
          });
  });
  //delete
  app.delete('/users/:Username',passport.authenticate('jwt', { session: false }), async  (req, res) => {

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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});



