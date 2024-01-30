import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
    minLength: [4, "Your name must be at least 4 characters long"],
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Your password must be at least 6 characters long"],
    select: false,
  },

  displayName: {
    type: String,
    required: [true, "Please enter your display name"],
    maxLength: [30, "Your display name cannot exceed 30 characters"],
    minLength: [4, "Your display name must be at least 4 characters long"],
    trim: true,
  },

  avatar: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },

  role: {
    type: String,
    default: "user",
  },

  bio: {
    type: String,
    trim: true,
  },

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,



  createdAt: {
    type: Date,
    default: Date.now(),
  },

  tweets: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
  },
});



// Encrypting password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // If password is modified
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    }
  );
};

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", userSchema);
