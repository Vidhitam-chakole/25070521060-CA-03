import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      default: '',
      trim: true,
    },
    username: {
      type: String,
      required: false,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'parrot',
    },
    loginCount: {
      type: Number,
      default: 1,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to sanitize user output (hide password)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
