const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const allowedGenders = ["Male", "Female", "Other"];

const validateRegisterPayload = ({ username, password, age, gender }) => {
  if (!username || !password || age === undefined || !gender) {
    throw new ApiError(400, "username, password, age and gender are required.");
  }

  if (String(username).trim().length < 3) {
    throw new ApiError(400, "username must be at least 3 characters long.");
  }

  if (String(password).length < 6) {
    throw new ApiError(400, "password must be at least 6 characters long.");
  }

  const numericAge = Number(age);
  if (!Number.isInteger(numericAge) || numericAge <= 0 || numericAge > 120) {
    throw new ApiError(400, "age must be a valid integer between 1 and 120.");
  }

  if (!allowedGenders.includes(gender)) {
    throw new ApiError(400, `gender must be one of: ${allowedGenders.join(", ")}.`);
  }
};

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  );
};

const register = async ({ username, password, age, gender }) => {
  validateRegisterPayload({ username, password, age, gender });

  const existingUser = await UserModel.findByUsername(username);
  if (existingUser) {
    throw new ApiError(409, "username already exists.");
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  const user = await UserModel.create({
    username: String(username).trim(),
    passwordHash,
    age: Number(age),
    gender
  });

  const token = signToken(user);

  return {
    user,
    token
  };
};

const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new ApiError(400, "username and password are required.");
  }

  const user = await UserModel.findByUsername(username);
  if (!user) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const token = signToken(user);

  return {
    user: {
      id: user.id,
      username: user.username,
      age: user.age,
      gender: user.gender,
      created_at: user.created_at
    },
    token
  };
};

module.exports = {
  register,
  login
};
