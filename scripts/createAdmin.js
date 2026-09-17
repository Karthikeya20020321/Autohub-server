const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

const requiredSettings = ["MONGO_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD"];

const createAdmin = async () => {
  const missingSettings = requiredSettings.filter(
    (setting) => !process.env[setting]
  );

  if (missingSettings.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingSettings.join(", ")}`
    );
  }

  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const name = (process.env.ADMIN_NAME || "AutoHub Admin").trim();
  const password = process.env.ADMIN_PASSWORD;

  if (password.length < 6) {
    throw new Error("ADMIN_PASSWORD must be at least 6 characters");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.name = name;
    existingUser.password = passwordHash;
    existingUser.role = "admin";
    existingUser.isBlocked = false;
    await existingUser.save();
    console.log(`Admin account updated: ${email}`);
    return;
  }

  await User.create({
    name,
    email,
    password: passwordHash,
    role: "admin",
  });

  console.log(`Admin account created: ${email}`);
};

createAdmin()
  .catch((error) => {
    console.error(`Admin bootstrap failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
