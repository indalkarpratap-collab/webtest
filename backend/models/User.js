const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('User', userSchema);
