import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import User from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import validator from "validator";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password, displayName } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    return next(new ErrorHandler("User already exists!", 400));
  }

  // Create a new user
  const user = await User.create({
    displayName,
    username,
    email,
    password,
  });

  // Send JWT token in response
  sendToken(user, 200, res);
});

// login user

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { loginIdentifier, password } = req.body;

  // Validate inputs
  if (!loginIdentifier || !password) {
    return next(
      new ErrorHandler("Please provide username/email and password", 400)
    );
  }

  // Find the user by username or email
  const user = await User.findOne({
    $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
  }).select("+password");

  // Check if the user exists
  if (!user) {
    return next(new ErrorHandler("Invalid username or email", 401));
  }

  // Compare the entered password with the stored hashed password
  const isPasswordMatched = await user.comparePassword(password);

  // Check if the password is valid
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  // Respond with success message or user data
  sendToken(user, 200, res);
});

// logout user

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
