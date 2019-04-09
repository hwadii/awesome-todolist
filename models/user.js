const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.pre('save', async function(next) {
  var user = this;
  try {
    user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR);
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.statics.authenticate = async function(username, password) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      let err = new Error('User not found');
      err.status = 401;
      return err;
    } else {
      const result = await bcrypt.compare(password, user.password);
      return result ? user : false;
    }
  } catch (error) {
    return error;
  }
};

let User = new mongoose.model('User', UserSchema, 'users');

module.exports = User;
