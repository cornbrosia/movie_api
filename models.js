const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
  });
  
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: String, required: true}]

    
  });
  userSchema.index({ Username: 1 }, { unique: true });
  userSchema.index({ Email: 1 }, { unique: true });
  
  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  
  let Movie = mongoose.model('Movies', movieSchema);
  let User = mongoose.model('Users', userSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;