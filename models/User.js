import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  refreshTokens: [
    {
      token: {
        type: String,
        required: true,
      }
    }
  ]
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id, name: this.name, email: this.email }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: 3600,
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.generateRefreshToken = async function () {
  try {
    const refreshToken = jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: '7d',
    });
    this.refreshTokens = this.refreshTokens.concat({ token: refreshToken });
    await this.save();
    return refreshToken;
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, this.password);
  if (!isMatch) {
    throw new Error('Invalid Credentials 123');
  }
  return user;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error(`Invalid Credentials 444 ${email}`);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid Credentials 555');
  }
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;
