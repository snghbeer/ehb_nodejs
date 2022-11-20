var mongoose = require("mongoose");
const { User } = require("../models/user");
const dbURI = process.env.dbURI;

async function registerUser(data) {
  var aUser;
  await mongoose.connect(dbURI, { ssl: true }).then(async () => {
    // create a user a new user
    aUser = new User({
      username: data.username,
      password: data.password,
    });
    await aUser.save().then(() => mongoose.connection.close());
  });
  return aUser;
}

async function fetchUser(username, password, callback) {
  await mongoose.connect(dbURI, { ssl: true }).then(async () => {
    // fetch the user and test password verification
    await User.findOne({username: username}).then(function(user) {
        user.comparePassword(password, function(matchError, isMatch) {
            if (matchError) {
              callback({error: true})

            } else if (!isMatch) {
              callback({error: true})
            } else {
              callback({error: false})
            }
          })
      })
      mongoose.connection.close()
  });
}

module.exports = {
  registerUser: registerUser,
  fetchUser: fetchUser,
};
